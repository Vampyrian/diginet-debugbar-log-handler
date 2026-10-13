<?php

declare(strict_types=1);

namespace Vampyrian\DiginetDebugbar\Handler;

use Monolog\Handler\AbstractProcessingHandler;
use Monolog\LogRecord;

class DiginetDebugHandler extends AbstractProcessingHandler
{
    /** @var LogRecord[] */
    protected static array $records = [];

    protected function write(LogRecord $record): void
    {
        static::$records[] = $record;
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
    public function getData(): array
    {
        return array_map(
            static fn (LogRecord $record): array => ['type' => $record->message] + $record->context,
            static::$records,
        );
    }

    public function render(): string
    {
        // JSON_HEX_* keeps "</script>" or quotes inside queries from breaking out of the script tag
        $json = json_encode(
            $this->getData(),
            JSON_PRETTY_PRINT
            | JSON_UNESCAPED_SLASHES
            | JSON_UNESCAPED_UNICODE
            | JSON_HEX_TAG
            | JSON_HEX_AMP
            | JSON_HEX_APOS
            | JSON_HEX_QUOT
            | JSON_PARTIAL_OUTPUT_ON_ERROR,
        );

        return "<script>\n    const data = {$json};\n</script>\n";
    }

    /**
     * Inserts the rendered script right before the last closing body tag.
     * HTML without a body tag is returned unchanged.
     */
    public function inject(string $html): string
    {
        $position = strripos($html, '</body>');

        if ($position === false) {
            return $html;
        }

        return substr($html, 0, $position) . $this->render() . substr($html, $position);
    }

    public function reset(): void
    {
        parent::reset();

        static::$records = [];
    }
}
