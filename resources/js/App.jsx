import { useState } from 'react';

const styles = {
    bar: {
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        font: '12px/1.4 ui-monospace, Menlo, monospace',
        background: '#1e1e1e',
        color: '#ddd',
        borderTop: '1px solid #444',
    },
    tabs: { display: 'flex', gap: 4, padding: 4 },
    tab: (active) => ({
        padding: '4px 10px',
        border: 0,
        cursor: 'pointer',
        font: 'inherit',
        color: 'inherit',
        background: active ? '#3a3a3a' : 'transparent',
    }),
    panel: { maxHeight: '40vh', overflow: 'auto', padding: 8, borderTop: '1px solid #444' },
};

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
        <div style={styles.bar}>
            {current && (
                <div style={styles.panel}>
                    {/* TODO: replace with dedicated panel components */}
                    <pre>{JSON.stringify(current.items, null, 2)}</pre>
                </div>
            )}
            <div style={styles.tabs}>
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        type="button"
                        style={styles.tab(tab.key === activeTab)}
                        onClick={() => setActiveTab(tab.key === activeTab ? null : tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
