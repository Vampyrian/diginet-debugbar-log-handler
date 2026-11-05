import type { DebugRecord } from './types.ts';

declare global {
    // Printed by the PHP handler in a <script> tag before the bundle runs.
    // eslint-disable-next-line no-var
    var data: DebugRecord[] | undefined;
}

export {};
