import { useState } from 'react';

export default function App({ records = [] }) {
    const [activeTab, setActiveTab] = useState(null);

    const queries = records.filter((r) => r.type === 'pdo::execute');
    const controllers = records.filter((r) => r.type === 'controller');

    const tabs = [
        { key: 'queries', label: `Queries (${queries.length})`, items: queries },
        { key: 'controller', label: 'Controller', items: controllers },
    ];

    const current = tabs.find((t) => t.key === activeTab);

    return (
        <div className="fixed inset-x-0 bottom-0 z-[99999] border-t border-neutral-700 bg-neutral-900 font-mono text-xs text-neutral-300">
            {current && (
                <div className="max-h-[40vh] overflow-auto border-b border-neutral-700 p-2">
                    {/* TODO: replace with dedicated panel components */}
                    <pre>{JSON.stringify(current.items, null, 2)}</pre>
                </div>
            )}
            <div className="flex gap-1 p-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        type="button"
                        className={`cursor-pointer px-2.5 py-1 hover:bg-neutral-800 ${tab.key === activeTab ? 'bg-neutral-700' : ''}`}
                        onClick={() => setActiveTab(tab.key === activeTab ? null : tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
