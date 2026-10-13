<?php

declare(strict_types=1);

namespace Vampyrian\DiginetDebugbar\Tests\Handler;

use Monolog\Logger;
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

    public function testInjectsScriptBeforeClosingBodyTag(): void
    {
        $this->logger->info('controller', ['link' => 'phpstorm://open?file=/a.php&line=1']);

        $html = $this->handler->inject('<html><body><p>Hi</p></body></html>');

        self::assertMatchesRegularExpression(
            '~<p>Hi</p><script>\s*const data = \[.*"type": "controller".*\];\s*</script>\s*</body></html>$~s',
            $html,
        );
    }

    public function testEscapesClosingScriptTagInsideData(): void
    {
        $this->logger->info('pdo::execute', ['query' => "SELECT '</script><script>alert(1)'"]);

        $script = $this->handler->render();

        self::assertSame(1, substr_count($script, '</script>'));
    }

    public function testLeavesHtmlWithoutBodyUntouched(): void
    {
        $this->logger->info('controller');

        self::assertSame('{"ok":true}', $this->handler->inject('{"ok":true}'));
    }
}
