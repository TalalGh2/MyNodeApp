var port = process.env.PORT || 3000,
    http = require('http'),
    fs = require('fs');

// نقرأ ملف الـ HTML
var html = fs.readFileSync('index.html', 'utf8');

// نقرأ المتغير البيئي من بيئة بينزتالك
// (بدّله باسم المتغير اللي أنت حطيته في الـ console)
var myEnvVar = process.env.TALAL || 'Default value';

// نستبدل الـ placeholder في الـ HTML بقيمة المتغير
html = html.replace('/*PLACEHOLDER_TALAL*/', 'document.write("' + myEnvVar + '")');

// دالة لكتابة اللوق
var log = function(entry) {
    fs.appendFileSync('/tmp/sample-app.log', new Date().toISOString() + ' - ' + entry + '\n');
};

// السيرفر الأساسي
var server = http.createServer(function (req, res) {
    if (req.method === 'POST') {
        var body = '';

        req.on('data', function(chunk) {
            body += chunk;
        });

        req.on('end', function() {
            if (req.url === '/') {
                log('Received message: ' + body);
            } else if (req.url === '/scheduled') { // هنا كان فيه خطأ بسيط، استخدمنا = بدل ===
                log('Received task ' + req.headers['x-aws-sqsd-taskname'] + 
                    ' scheduled at ' + req.headers['x-aws-sqsd-scheduled-at']);
            }

            res.writeHead(200, 'OK', {'Content-Type': 'text/plain'});
            res.end();
        });
    } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(html);
        res.end();
    }
});

// Listen on port 3000, IP defaults to 127.0.0.1
server.listen(port);

// Put a friendly message on the terminal
console.log('Server running at http://127.0.0.1:' + port + '/');
