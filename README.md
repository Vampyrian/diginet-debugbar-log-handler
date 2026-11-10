# Debugbar

## How to use

### How to install
```bash
composer require --dev vampyrian/monolog-debugbar
```

### How to instantiate handler
```php
$logger = new Logger('name');
$logger->pushHandler(new DiginetDebugHandler());
```

### How to log query
```php
$logger->info('pdo::execute', [
    'query' => 'SELECT * FROM `user_emails` WHERE `user_id` = 991',
    'duration' => 0.0002901554107666,
    'memory' => 0.0027084350585938,
    'count' => 1,
    'query_md5' => 'aetjhsryjmsrynsryj',
]);
```

### How to log controller method
```php
$logger->info('controller', [
    'link' => 'phpstorm://open?file=/Erp/Controller/Home/HomeController.php&line=50',
    "name": "/Erp/Controller/Home/HomeController",
]);
```

### Output in browser (data + compiled public/js/debugbar.js in one module)
```html
<script type="module">
    const data = [
            {
                type: 'pdo::execute',
                query: 'SELECT * FROM `user_emails` WHERE `user_id` = 991',
                duration: 0.0002901554107666,
                memory: 0.0027084350585938,
                count: 1,
                query_md5: 'aetjhsryjmsrynsryj',
            },
            {
                type: 'controller',
                link: 'phpstorm://open?file=/Erp/Controller/Home/HomeController.php&line=50',
            }
        ];
    (function(){ /* public/js/debugbar.js */ })();
</script>
```

## How to develop frontend

The debugbar is a React + TypeScript + Tailwind app built with Vite.

### Project structure
- `resources/js/` – debugbar source code
  - `main.tsx` – entry point; reads the global `data` array printed by the PHP handler and mounts the app inside a Shadow DOM
  - `App.tsx` – root component
  - `components/` – UI components
  - `helpers/` – shared helpers (localStorage, link replacer, ...)
  - `types.ts` – record types
  - `app.css` – Tailwind styles (inlined into the bundle)
- `playground/` – local development environment
  - `index.html` – a fake host page that imitates the PHP handler output
  - `data.json` – sample log records passed to the debugbar; edit it to test different data

### Install dependencies
```bash
npm install
```

### Run development environment
```bash
npm run playground
```
Starts the Vite dev server with hot reload and opens `playground/index.html` in the browser.
Changes in `resources/js/` and `playground/data.json` are picked up automatically.

### Other commands
```bash
npm run typecheck   # TypeScript type check
npm run build       # type check + build public/js/debugbar.js
npm run dev         # rebuild public/js/debugbar.js on every change
```
