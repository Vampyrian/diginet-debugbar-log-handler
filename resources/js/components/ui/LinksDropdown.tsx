import { useEffect, useRef, useState } from 'react';
import type { Link } from '../../types.ts';
import { linkReplacer } from '../../helpers/linkReplacer.ts';

export default function LinksDropdown({ links }: { links: Link[] }) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) {
            return;
        }
        const handlePointerDown = (event: MouseEvent) => {
            const container = containerRef.current;
            if (container && !event.composedPath().includes(container)) {
                setOpen(false);
            }
        };
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [open]);

    if (links.length === 0) {
        return null;
    }

    return (
        <div ref={containerRef} className="relative shrink-0">
            <button
                type="button"
                onClick={() => setOpen((current) => !current)}
                title="Show where this query was executed from"
                className={`cursor-pointer rounded border px-1.5 ${
                    open ? 'border-neutral-500 bg-neutral-800 text-neutral-200' : 'border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
                }`}
            >
                ({links.length}) {open ? '▴' : '▾'}
            </button>
            {open && (
                <ul className="absolute right-0 z-10 mt-1 max-w-[90vw] min-w-3xl space-y-1 rounded border border-neutral-700 bg-neutral-900 p-2 shadow-lg">
                    {links.map((link, index) => (
                        <li key={index} className="break-all">
                            <a href={linkReplacer(link.link)} className="text-sky-400 hover:underline">
                                {link.name}
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
