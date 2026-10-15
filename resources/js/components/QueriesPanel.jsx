import { useState } from 'react';

const formatMs = (seconds) => `${(seconds * 1000).toFixed(2)} ms`;

// navigator.clipboard only exists on https/localhost; local dev hosts like http://app.test need the old fallback.
const copyToClipboard = async (text, container) => {
    if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return;
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    container.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
};

function CopyButton({ text }) {
    const [copied, setCopied] = useState(false);

    const handleClick = async (event) => {
        await copyToClipboard(text, event.currentTarget.parentElement);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className="w-14 shrink-0 cursor-pointer rounded border border-neutral-700 px-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
        >
            {copied ? 'Copied' : 'Copy'}
        </button>
    );
}

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
                        <CopyButton text={query.query} />
                    </li>
                ))}
            </ul>
        </div>
    );
}
