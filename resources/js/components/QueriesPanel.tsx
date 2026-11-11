import { useState } from 'react';
import type { QueryRecord } from '../types.ts';
import CopyButton from "./ui/CopyButton.tsx";
import LinksDropdown from "./ui/LinksDropdown.tsx";

const formatMs = (seconds: number): string => `${(seconds * 1000).toFixed(2)} ms`;

const formatMemory = (megabytes: number): string => (
    megabytes >= 1
        ? `${megabytes.toFixed(2)} MB`
        : `${(megabytes * 1024).toFixed(2)} KB`
);

type SortKey = 'duration' | 'memory' | 'count';
type SortDirection = 'asc' | 'desc';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
    { key: 'duration', label: 'Duration' },
    { key: 'memory', label: 'Memory' },
    { key: 'count', label: 'Count' },
];

const sortValue = (query: QueryRecord, key: SortKey): number => (key === 'count' ? (query.count ?? 1) : (query[key] ?? 0));

interface QueriesPanelProps {
    queries?: QueryRecord[];
}

export default function QueriesPanel({ queries = [] }: QueriesPanelProps) {
    const [sort, setSort] = useState<{ key: SortKey; direction: SortDirection } | null>(null);

    // Each click cycles: descending -> ascending -> execution order.
    const toggleSort = (key: SortKey) => {
        setSort((current) => {
            if (current?.key !== key) {
                return { key, direction: 'desc' };
            }
            return current.direction === 'desc' ? { key, direction: 'asc' } : null;
        });
    };

    if (queries.length === 0) {
        return <p className="text-neutral-500">No queries.</p>;
    }

    const totalMemory = queries.reduce((sum, q) => sum + (q.memory ?? 0), 0);

    // The same query_md5 executed more than once points to an N+1 problem.
    const md5Counts: Record<string, number> = {};
    queries.forEach((q) => {
        if (q.query_md5) {
            md5Counts[q.query_md5] = (md5Counts[q.query_md5] ?? 0) + 1;
        }
    });
    const repeatsOf = (query: QueryRecord): number => (query.query_md5 ? (md5Counts[query.query_md5] ?? 0) : 0);
    const nPlusOneCount = Object.values(md5Counts).filter((count) => count > 1).length;

    // Keep the original index as a stable React key across re-sorts.
    const rows = queries.map((query, index) => ({ query, index }));
    if (sort) {
        const factor = sort.direction === 'asc' ? 1 : -1;
        rows.sort((a, b) => factor * (sortValue(a.query, sort.key) - sortValue(b.query, sort.key)));
    }

    return (
        <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <p className="text-neutral-500">
                    {queries.length} queries, {formatMemory(totalMemory)}
                    {nPlusOneCount > 0 && (
                        <span className="ml-2 text-amber-400">
                            · {nPlusOneCount} possible N+1 {nPlusOneCount === 1 ? 'problem' : 'problems'}
                        </span>
                    )}
                </p>
                <div className="flex items-center gap-1 text-neutral-500">
                    <span>Sort by:</span>
                    {SORT_OPTIONS.map(({ key, label }) => {
                        const active = sort?.key === key;
                        return (
                            <button
                                key={key}
                                type="button"
                                onClick={() => toggleSort(key)}
                                title={active ? 'Click to change direction or reset to execution order' : `Sort by ${label.toLowerCase()}`}
                                className={`cursor-pointer rounded border px-1.5 ${
                                    active ? 'border-neutral-500 bg-neutral-800 text-neutral-200' : 'border-neutral-700 hover:bg-neutral-800 hover:text-neutral-200'
                                }`}
                            >
                                {label}
                                {active && (sort.direction === 'desc' ? ' ↓' : ' ↑')}
                            </button>
                        );
                    })}
                </div>
            </div>
            <ul className="divide-y divide-neutral-800">
                {rows.map(({ query, index }) => (
                    <li key={index} className={`flex items-start gap-4 py-1.5 ${repeatsOf(query) > 1 ? 'bg-amber-400/5 hover:bg-amber-400/20' : 'hover:bg-neutral-700/60'}`}>
                        {repeatsOf(query) > 1 && (
                            <span
                                className="shrink-0 rounded bg-amber-400/15 px-1.5 text-amber-400"
                                title={`This query ran ${repeatsOf(query)} times (same query_md5)`}
                            >
                                N+1 ×{repeatsOf(query)}
                            </span>
                        )}
                        <code className="flex-1 break-all whitespace-pre-wrap text-neutral-200">{query.query}</code>
                        <LinksDropdown links={query.links ?? []} />
                        <span className="shrink-0 text-neutral-500" title="Query duration">{formatMs(query.duration ?? 0)}</span>
                        <span className="w-20 shrink-0 text-right text-neutral-500" title="Memory used by the query">
                            {formatMemory(query.memory ?? 0)}
                        </span>
                        <span className="w-12 shrink-0 text-right text-neutral-500" title="Affected rows count">×{query.count ?? 1}</span>
                        <CopyButton text={query.query} />
                    </li>
                ))}
            </ul>
        </div>
    );
}
