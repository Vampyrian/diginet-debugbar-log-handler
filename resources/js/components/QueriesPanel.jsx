const formatMs = (seconds) => `${(seconds * 1000).toFixed(2)} ms`;

export default function QueriesPanel({ queries = [] }) {
    if (queries.length === 0) {
        return <p className="text-neutral-500">No queries.</p>;
    }

    const totalDuration = queries.reduce((sum, q) => sum + (q.duration ?? 0), 0);

    return (
        <div>
            <p className="mb-2 text-neutral-500">
                {queries.length} queries in {formatMs(totalDuration)}
            </p>
            <ul className="divide-y divide-neutral-800">
                {queries.map((query, index) => (
                    <li key={index} className="flex items-start gap-4 py-1.5">
                        <code className="flex-1 break-all whitespace-pre-wrap text-neutral-200">{query.query}</code>
                        <span className="shrink-0 text-neutral-500">{formatMs(query.duration ?? 0)}</span>
                        <span className="w-12 shrink-0 text-right text-neutral-500">×{query.count ?? 1}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
