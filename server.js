const http = require('http');
const url = require("url");
const fs = require("fs");

http.createServer(function (req, res) {
    let address = req.url;
    let q = url.parse(address, true);
    let filepath = '';

    fs.appendFile('log.txt', 'URL: ' + address + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Added to log.');
        }
    });
    if (q.pathname.includes("documentation")) {
        filepath = (__dirname + "/documentation.html");
        console.log(filepath);
    } else {
        filepath = "index.html";
    }
    fs.readFile(filepath, (error, data) => {
        if (error) {
            throw error;
        } else {
            res.writeHead(200, {
                "Content-Type": "text/html"
            });
            res.write(data);
            res.end();
        }
    });
}).listen(8080);
console.log('Server is running in port 8080');