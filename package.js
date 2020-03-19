let http = require('http');
let fs = require('fs')
let mime = require("mime-types")
let queryStr = require('querystring');

class sandgate {
  
    constructor(options) {
      
        this.server = []
        this.opts = { "404": require.resolve("sandgate/placeHolders/404.html") }

        if (options !== undefined) this.opts = options;
    }

    listen(port, callback) {
      
      let server = this.server;
      
      setTimeout(() => {
        http.createServer((req, res) => {

            if (server.length == 0) {
                res.writeHead(200, { 'server': 'SandGate', 'Content-Type': 'text/html; charset=utf-8' });
                res.write(fs.readFileSync(require.resolve("sandgate/placeHolders/default.html")));
            };

            res.sendFile = (path) => {
                res.writeHead(200, { 'server': 'SandGate', 'Content-Type': mime.contentType(path.replace(/^.*[\\\/]/, '')) });
                res.write(fs.readFileSync(path));
            }

            res.send = (text, status) => {
                let writeStatus = status == undefined ? 200 : status

                res.writeHead(writeStatus, { 'server': 'SandGate', 'Content-Type': 'text/html; charset=utf-8'})
                res.write(text)
            }
            let route = server.find(item => item.url == req.url && item.Method == req.method);
            
            if (route !== undefined && route.Method == "POST" || route.Method == "PUT" || route.Method == "DELETE") {
              new Promise(async (resolve, reject) => {
                let holdBody = ""

                req.on('data', chunk => {
                  holdBody += chunk.toString();
                });

                req.on('end', () => {
                  resolve(holdBody)
                })
              }).then((body) => {
                req.body = body;

                route.callback(req, res, body)
                res.end()
              })
            }

            if (route == undefined) {
                res.writeHead(404, { 'server': 'SandGate', 'Content-Type': mime.contentType(this.opts["404"].replace(/^.*[\\\/]/, '')) });
                res.write(fs.readFileSync(this.opts["404"]))
            };
          
            if (route !== undefined && server.length !== 0 && route.Method == "GET") {
              route.callback(req, res)
              res.end()
            }
        }).listen(port)

        if (typeof callback == "function") callback(port)
        }, 50)
    }

    get(url, callback) {
        this.server.push({ "Method": "GET", "url": url, "callback": callback })
    }

    post(url, callback) {
      this.server.push({ "Method": "POST", "url": url, "callback": callback })
    }

    put(url, callback) {
      this.server.push({ "Method": "PUT", "url": url, "callback": callback })
    }

    delete(url, callback) {
      this.server.push({ "Method": "DELETE", "url": url, "callback": callback })
    }
  
    public(directory) {
      new Promise((resolve, reject) => {
        fs.readdir(directory, function(err, files) {
          
          let p = [];
          
          files.forEach((file) => {
            p.push({"Method": "GET", "url": "/" + file, "callback": (req, res) => {res.sendFile(directory + "/" + file)}})
            
            if (p.length == files.length) resolve(p);
          })
        })
      }).then((items) => {
        this.server = this.server.concat(items)
      })
      
    }

}

module.exports = sandgate;