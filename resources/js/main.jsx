import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// The PHP handler prints `const data = [...]` in a <script> tag before this bundle runs.
// eslint-disable-next-line no-undef
const records = typeof data !== 'undefined' ? data : [];

const container = document.createElement('div');
container.id = 'diginet-debugbar';
document.body.appendChild(container);

createRoot(container).render(<App records={records} />);
