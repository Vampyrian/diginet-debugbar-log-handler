<?php

declare(strict_types=1);

namespace Vampyrian\DiginetDebugbar\Handler;

use Monolog\Handler\AbstractProcessingHandler;
use Monolog\LogRecord;


class DiginetDebugHandler extends AbstractProcessingHandler
{
    protected function write(LogRecord $record): void
    {
        // TODO: Implement write() method.
    }
}
