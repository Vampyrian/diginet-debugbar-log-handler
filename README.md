## Format

### How to instantiate handler
```php
$log = new Logger('name');
$log->pushHandler(new DiginetDebugHandler());
```

### How to log query to context
```php
$logger->info('pdo::execute', [
    'query' => 'SELECT * FROM `user_emails` WHERE `user_id` = 991',
    'duration' => 0.0002901554107666,
    'memory' => 0.0027084350585938,
    'count' => 1,
    'query_md5' => 'aetjhsryjmsrynsryj',
]);
```

### How to log controller method to context
```php
$logger->info('controller', [
    'link' => 'phpstorm://open?file=/home/zilvinas/dev/erp/src/Erp/Controller/Home/HomeController.php&line=50',
]);
```

### Json output in browser before body tag
```html
<script>
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
                link: 'phpstorm://open?file=/home/zilvinas/dev/erp/src/Erp/Controller/Home/HomeController.php&line=50',
            }
        ];
</script>
```