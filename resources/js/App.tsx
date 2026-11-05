import { useState, type ReactNode } from 'react';
import ControllerPanel from './components/ControllerPanel.tsx';
import QueriesPanel from './components/QueriesPanel.tsx';
import type { ControllerRecord, DebugRecord, QueryRecord } from './types.ts';
import {getBooleanFromStorage, setBooleanToStorage} from "./helpers/localStorageHelper.ts";

type TabKey = 'queries' | 'controller';

const HIDDEN_KEY = 'diginet-debugbar-hidden';

interface Tab {
    key: TabKey;
    label: string;
    panel: ReactNode;
}

interface AppProps {
    records?: DebugRecord[];
}

export default function App({ records = [] }: AppProps) {
    const [activeTab, setActiveTab] = useState<TabKey | null>(null);
    const [hidden, setHidden] = useState<boolean>(getBooleanFromStorage(HIDDEN_KEY, true));

    const toggleHidden = (value: boolean) => {
        setHidden(value);
        setBooleanToStorage(HIDDEN_KEY, value)
    };

    const queries = records.filter((r): r is QueryRecord => r.type === 'pdo::execute');
    const controllers = records.filter((r): r is ControllerRecord => r.type === 'controller');

    const tabs: Tab[] = [
        { key: 'queries', label: `Queries (${queries.length})`, panel: <QueriesPanel queries={queries} /> },
        { key: 'controller', label: 'Controller', panel: <ControllerPanel controllers={controllers} /> },
    ];

    const current = tabs.find((t) => t.key === activeTab);

    if (hidden) {
        return (
            <button
                type="button"
                className="fixed right-0 bottom-0 z-99999 cursor-pointer border-t border-l border-neutral-700 bg-neutral-900 px-2 py-1 font-mono text-xs text-neutral-300 hover:bg-neutral-800"
                onClick={() => toggleHidden(false)}
            >
                DB
            </button>
        );
    }

    return (
        <div className="fixed inset-x-0 bottom-0 z-99999 border-t border-neutral-700 bg-neutral-900 font-mono text-xs text-neutral-300">
            {current && (
                <div className="max-h-[40vh] overflow-auto border-b border-neutral-700 p-2">
                    {current.panel}
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
                {!current && (
                    <button
                        type="button"
                        className="ml-auto cursor-pointer px-2.5 py-1 hover:bg-neutral-800"
                        onClick={() => toggleHidden(true)}
                    >
                        ×
                    </button>
                )}
            </div>
        </div>
    );
}
