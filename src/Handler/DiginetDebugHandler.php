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

    }
}
