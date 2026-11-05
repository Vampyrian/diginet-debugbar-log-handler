// Records printed by the PHP handler (DiginetDebugHandler) as `const data = [...]`.

export interface ControllerRecord {
    type: 'controller';
    link: string;
    name?: string;
}

export interface QueryRecord {
    type: 'pdo::execute';
    query: string;
    /** Seconds. */
    duration?: number;
    /** Megabytes. */
    memory?: number;
    count?: number;
    query_md5?: string;
}

export interface UnknownRecord {
    type: string;
    [key: string]: unknown;
}

export type DebugRecord = ControllerRecord | QueryRecord | UnknownRecord;
