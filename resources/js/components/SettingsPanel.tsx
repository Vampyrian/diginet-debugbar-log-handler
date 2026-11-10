import { useEffect, useRef, useState } from 'react';
import { getStringFromStorage, setStringToStorage } from '../helpers/localStorageHelper.ts';
import { LINK_REPLACE_KEY, LINK_SEARCH_KEY, resetLinkReplacerCache } from '../helpers/linkReplacer.ts';

export default function SettingsPanel() {
    const [search, setSearch] = useState<string>(() => getStringFromStorage(LINK_SEARCH_KEY));
    const [replace, setReplace] = useState<string>(() => getStringFromStorage(LINK_REPLACE_KEY));

    // Keep the latest values in a ref so the unmount cleanup doesn't save stale state.
    const valuesRef = useRef({ search, replace });
    valuesRef.current = { search, replace };

    useEffect(() => {
        return () => {
            setStringToStorage(LINK_SEARCH_KEY, valuesRef.current.search);
            setStringToStorage(LINK_REPLACE_KEY, valuesRef.current.replace);
            resetLinkReplacerCache();
        };
    }, []);

    return (
        <form className="flex gap-3" onSubmit={(event) => event.preventDefault()}>
            <div className="gap-1">
                <label htmlFor="link-search" className="text-neutral-400">
                    Search string in file link
                </label>
                <input
                    id="link-search"
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search in link"
                    className="rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-neutral-200"
                />
            </div>
            <div className="gap-1">
                <label htmlFor="link-replace" className="text-neutral-400">
                    Replace with
                </label>
                <input
                    id="link-replace"
                    type="text"
                    value={replace}
                    onChange={(event) => setReplace(event.target.value)}
                    placeholder="Replace with"
                    className="rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-neutral-200"
                />
            </div>
        </form>
    );
}
