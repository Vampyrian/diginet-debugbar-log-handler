## Format

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