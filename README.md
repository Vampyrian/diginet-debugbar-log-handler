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
    'links' => [
        [
            'name' => '/Erp/Controller/Home/EmailGateway',
            'link' => 'phpstorm://open?file=/home/zilvinas/dev/erp/src/Erp/Controller/Home/HomeController.php&line=50',
        ],
        [
            'name' => '/Erp/Controller/Home/UserGateway',
            'link' => 'phpstorm://open?file=/home/zilvinas/dev/erp/src/Erp/Controller/UserController.php&line=2050',
        ],
    ]
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
                links: [
                    {
                        name: '/Erp/Controller/Home/EmailGateway',
                        link: 'phpstorm://open?file=/home/zilvinas/dev/erp/src/Erp/Controller/Home/HomeController.php&line=50',
                    },
                    {
                        name: '/Erp/Controller/Home/UserGateway',
                        link: 'phpstorm://open?file=/home/zilvinas/dev/erp/src/Erp/Controller/UserController.php&line=2050',
                    }
                ]
            {
                type: 'controller',
                link: 'phpstorm://open?file=/Erp/Controller/Home/HomeController.php&line=50',
                name: "/Erp/Controller/Home/HomeController",
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

## How to prepare new release

Requires `git`, `php`, installed composer/npm dependencies and an authenticated GitHub CLI (`gh auth login`).

1. Run tests (TypeScript type check + PHPUnit):
   ```bash
   composer test
   ```
2. Build the frontend bundle. `public/js/debugbar.js` is committed to the repository, so the release must contain a fresh build:
   ```bash
   npm run build
   ```
3. Commit the built `public/js/debugbar.js` (and any other changes) and push to `main`.
   The release script requires a clean working tree on `main` that is in sync with `origin/main`.
4. Create the release:
   ```bash
   bin/release create patch
   ```
   This reads the current version from `composer.json`, bumps it, runs tests again, commits the version change,
   creates and pushes a `vX.Y.Z` tag and publishes a GitHub release with generated notes.

Other release options:
```bash
bin/release create minor              # 0.1.1 -> 0.2.0
bin/release create major              # 0.2.0 -> 1.0.0
bin/release list                      # show GitHub releases
bin/release delete 0.2.0-beta         # delete release + tag
```
