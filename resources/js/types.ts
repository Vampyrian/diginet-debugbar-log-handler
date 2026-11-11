// Records printed by the PHP handler (DiginetDebugHandler) as `const data = [...]`.

export interface Link {
    link: string;
    name: string;
}

export interface ControllerRecord {
    type: 'controller';
    link: string;
    name: string;
}

export interface QueryRecord {
    type: 'pdo::execute';
    query: string;
    duration?: number;
    memory: number;
    count: number;
    query_md5: string;
    links: Link[];
}

export interface UnknownRecord {
    type: string;
    [key: string]: unknown;
}

export type DebugRecord = ControllerRecord | QueryRecord | UnknownRecord;
