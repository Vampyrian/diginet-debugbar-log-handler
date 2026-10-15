<?php

declare(strict_types=1);

namespace Vampyrian\DiginetDebugbar\Handler;

use Monolog\Handler\AbstractProcessingHandler;
use Monolog\LogRecord;

use function headers_list;
use function stripos;

class DiginetDebugHandler extends AbstractProcessingHandler
{
    protected static bool $initialized = false;

    /** @var LogRecord[] */
    protected static array $records = [];

    protected const FORMAT_HTML = 'html';
    protected const FORMAT_JS = 'js';
    protected const FORMAT_UNKNOWN = 'unknown';

    protected function write(LogRecord $record): void
    {
        if (str_starts_with($record->message, 'pdo::execute') || str_starts_with($record->message, 'controller')) {
            static::$records[] = $record;
        }

        // Register shutdown handler if not already done
        if (!static::$initialized) {
            static::$initialized = true;
            $this->registerShutdownFunction();
        }
    }

    protected function registerShutdownFunction(): void
    {
        if (PHP_SAPI !== 'cli') {
            register_shutdown_function(self::send(...));
        }
    }

    public static function send(): void
    {
        $format = static::getResponseFormat();
        if ($format === self::FORMAT_UNKNOWN) {
            return;
        }

        if (\count(static::$records) > 0) {
            if ($format === self::FORMAT_HTML) {
                // One module: `data` stays module-scoped (no global to clash with the host page)
                // but is still in scope for the bundle that follows it
                static::writeOutput('<script type="module">' . self::generateData() . self::generateScript() . '</script>');
            } else { // js format
                static::writeOutput(self::generateData());
            }
            static::resetStatic();
        }
    }

    public static function resetStatic(): void
    {
        static::$records = [];
    }

    protected static function getResponseFormat(): string
    {
        // Check content type
        foreach (headers_list() as $header) {
            if (stripos($header, 'content-type:') === 0) {
                return static::getResponseFormatFromContentType($header);
            }
        }

        return self::FORMAT_HTML;
    }

    protected static function getResponseFormatFromContentType(string $contentType): string
    {
        // This handler only works with HTML and javascript outputs
        // text/javascript is obsolete in favour of application/javascript, but still used
        if (stripos($contentType, 'application/javascript') !== false || stripos($contentType, 'text/javascript') !== false) {
            return self::FORMAT_JS;
        }

        if (stripos($contentType, 'text/html') !== false) {
            return self::FORMAT_HTML;
        }

        return self::FORMAT_UNKNOWN;
    }

    protected static function writeOutput(string $str): void
    {
        echo $str;
    }

    /**
     * @return LogRecord[]
     */
    public function getRecords(): array
    {
        return static::$records;
    }

    /**
     * Records flattened for the browser: message becomes "type", context is merged in.
     *
     * @return array<int, array<string, mixed>>
     */
    public static function getData(): array
    {
        return array_map(
            static fn (LogRecord $record): array => ['type' => $record->message] + $record->context,
            static::$records,
        );
    }

    private static function generateData(): string
    {
        // JSON_HEX_* keeps "</script>" or quotes inside queries from breaking out of the script tag
        $json = json_encode(
            self::getData(),
            JSON_PRETTY_PRINT
            | JSON_UNESCAPED_SLASHES
            | JSON_UNESCAPED_UNICODE
            | JSON_HEX_TAG
            | JSON_HEX_AMP
            | JSON_HEX_APOS
            | JSON_HEX_QUOT
            | JSON_PARTIAL_OUTPUT_ON_ERROR,
        );

        return "const data = {$json};\n";
    }

    /**
     * The compiled React bundle (npm run build), inlined because public/js is not web-accessible from vendor/.
     */
    private static function generateScript(): string
    {
        $js = @file_get_contents(static::getScriptPath());
        if ($js === false) {
            return '';
        }

        // Never let the bundle close its own script tag early
        return str_ireplace('</script', '<\\/script', $js);
    }

    protected static function getScriptPath(): string
    {
        return \dirname(__DIR__, 2) . '/public/js/debugbar.js';
    }

    public function reset(): void
    {
        parent::reset();

        static::$records = [];
    }
}
