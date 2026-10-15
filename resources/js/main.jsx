import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import css from './app.css?inline';

// The PHP handler prints `const data = [...]` in a <script> tag before this bundle runs.
// eslint-disable-next-line no-undef
const records = typeof data !== 'undefined' ? data : [];

const host = document.createElement('div');
host.id = 'diginet-debugbar';
document.body.appendChild(host);

// Shadow DOM keeps Tailwind (incl. preflight) from leaking into the host page, and the host's CSS out of the bar.
const shadow = host.attachShadow({ mode: 'open' });

const style = document.createElement('style');
style.textContent = css;
shadow.appendChild(style);

// @property rules are ignored inside shadow roots, so register them on the document instead
// (Tailwind relies on them for shadows, rings, transforms, gradients...).
const properties = css.match(/@property[^{]+\{[^}]*\}/g);
if (properties) {
    const globalStyle = document.createElement('style');
    globalStyle.textContent = properties.join('\n');
    document.head.appendChild(globalStyle);
}

const root = document.createElement('div');
shadow.appendChild(root);

createRoot(root).render(<App records={records} />);
