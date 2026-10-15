<?php

declare(strict_types=1);

namespace Vampyrian\DiginetDebugbar\Tests\Handler;

use Monolog\Logger;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use Vampyrian\DiginetDebugbar\Handler\DiginetDebugHandler;

class DiginetDebugHandlerTest extends TestCase
{
    private DiginetDebugHandler $handler;
    private Logger $logger;

    protected function setUp(): void
    {
        $this->handler = new DiginetDebugHandler();
        $this->handler->reset();

        $this->logger = new Logger('test');
        $this->logger->pushHandler($this->handler);
    }

    public function testCollectsQueryAndControllerRecords(): void
    {
        $this->logger->info('pdo::execute', [
            'query' => 'SELECT * FROM `user_emails` WHERE `user_id` = 991',
            'duration' => 0.0002901554107666,
            'memory' => 0.0027084350585938,
            'count' => 1,
            'query_md5' => 'aetjhsryjmsrynsryj',
        ]);
        $this->logger->info('controller', [
            'link' => 'phpstorm://open?file=/home/zilvinas/dev/erp/src/Erp/Controller/Home/HomeController.php&line=50',
        ]);

        self::assertCount(2, $this->handler->getRecords());
        self::assertSame([
            [
                'type' => 'pdo::execute',
                'query' => 'SELECT * FROM `user_emails` WHERE `user_id` = 991',
                'duration' => 0.0002901554107666,
                'memory' => 0.0027084350585938,
                'count' => 1,
                'query_md5' => 'aetjhsryjmsrynsryj',
            ],
            [
                'type' => 'controller',
                'link' => 'phpstorm://open?file=/home/zilvinas/dev/erp/src/Erp/Controller/Home/HomeController.php&line=50',
            ],
        ], $this->handler->getData());
    }

    public function testSendWrapsDataInScriptTagForHtmlResponse(): void
    {
        $this->logger->info('controller', ['link' => 'phpstorm://open?file=/a.php&line=1']);

        $this->expectOutputRegex('~^<script type="module">const data = \[.*"type": "controller".*\];\s*\(function\(\).*</script>$~s');

        DiginetDebugHandler::send();

        self::assertSame([], $this->handler->getRecords());
    }

    public function testSendOutputsPlainJavascriptForJsResponse(): void
    {
        $handler = $this->handlerWithFormat('js');
        $this->logger->info('controller', ['link' => 'phpstorm://open?file=/a.php&line=1']);

        $this->expectOutputRegex('~^const data = \[.*"type": "controller".*\];\s*$~s');

        $handler::send();
    }

    public function testSendOutputsNothingForUnknownResponse(): void
    {
        $handler = $this->handlerWithFormat('unknown');
        $this->logger->info('controller');

        $this->expectOutputString('');

        $handler::send();

        self::assertCount(1, $this->handler->getRecords());
    }

    public function testSendOutputsNothingWithoutRecords(): void
    {
        $this->expectOutputString('');

        DiginetDebugHandler::send();
    }

    public function testEscapesClosingScriptTagInsideData(): void
    {
        $this->logger->info('pdo::execute', ['query' => "SELECT '</script><script>alert(1)'"]);

        ob_start();
        DiginetDebugHandler::send();
        $script = (string) ob_get_clean();

        self::assertSame(1, substr_count($script, '</script>'));
        self::assertStringNotContainsString('</script><script>alert(1)', $script);
    }

    /**
     * @return array<string, array{string, string}>
     */
    public static function contentTypeProvider(): array
    {
        return [
            'html' => ['Content-Type: text/html; charset=UTF-8', 'html'],
            'application/javascript' => ['Content-Type: application/javascript', 'js'],
            'text/javascript' => ['content-type: text/javascript', 'js'],
            'json' => ['Content-Type: application/json', 'unknown'],
        ];
    }

    #[DataProvider('contentTypeProvider')]
    public function testDetectsResponseFormatFromContentType(string $header, string $expected): void
    {
        self::assertSame($expected, $this->handlerWithFormat('html')::formatFromContentType($header));
    }

    private function handlerWithFormat(string $format): DiginetDebugHandler
    {
        $handler = new class extends DiginetDebugHandler {
            public static string $format = self::FORMAT_HTML;

            protected static function getResponseFormat(): string
            {
                return static::$format;
            }

            public static function formatFromContentType(string $contentType): string
            {
                return static::getResponseFormatFromContentType($contentType);
            }
        };
        $handler::$format = $format;

        return $handler;
    }
}
