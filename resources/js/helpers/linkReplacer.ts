import { getStringFromStorage } from './localStorageHelper.ts';

export const LINK_SEARCH_KEY = 'diginet-debugbar-link-search';
export const LINK_REPLACE_KEY = 'diginet-debugbar-link-replace';

type LinkReplaceSettings = { search: string; replace: string };

let cachedSettings: LinkReplaceSettings | null = null;

const getSettings = (): LinkReplaceSettings => {
    if (cachedSettings === null) {
        console.log('Reading settings from localStorage');
        cachedSettings = {
            search: getStringFromStorage(LINK_SEARCH_KEY),
            replace: getStringFromStorage(LINK_REPLACE_KEY),
        };
    }
    return cachedSettings;
};

/** Drop cached values so the next call re-reads them from localStorage. */
export const resetLinkReplacerCache = (): void => {
    cachedSettings = null;
};

export const linkReplacer = (link: string): string => {
    const { search, replace } = getSettings();
    if (search === '' || replace === '') {
        return link;
    }
    return link.replaceAll(search, replace);
};
