let http = require('http');
let fs = require('fs')
let mime = require("mime-types")
let queryStr = require('querystring');

// Sandgate v1.2.2
// Syntax#9930


class sandgate {
  
    constructor(options) {

        this.plugins = []
      
        this.server = []
        this.opts = { "404": require.resolve("sandgate/placeHolders/404.html") }

        if (options !== undefined) this.opts = options;
    }


    use(callback) {
      this.plugins.push("callback");
    }

    listen(port, callback) {
      setTimeout(() => {
        http.createServer((req, res) => {
          this.plugins.forEach((plugin) => {
            plugin.callback(req, res)
          })

          let server = this.server;
            if (server.length == 0) {
                res.writeHead(200, { 'server': 'SandGate', 'Content-Type': 'text/html; charset=utf-8' });
                res.write(fs.readFileSync(require.resolve("sandgate/placeHolders/default.html"), 'utf-8').toString());

                res.end()
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

            res.json = (json) => {
              res.writeHead(200, { 'server': 'SandGate', 'Content-Type': 'application/json; charset=utf-8'})
              res.write(JSON.stringify(json));
            }
            let getParamLocations = ((item) => {
              let paramLoc = [];
              let nn = 0; 
              item.url.split("/").forEach((flake) => { 
                if (flake[0] == ":") paramLoc.push(nn); 
                nn++
              });
            
              return paramLoc;
            })
            
            let removeParams = ((item, url) => {
                
              let locations = getParamLocations(item)
              console.log(locations)
              
              let tempurl = url.split("/")
              locations.forEach((location) => {
                tempurl.splice(location, 1, '')
              })

              return tempurl.join("/");
            })
            
            let route = server.find(item => (item.url == req.url || removeParams(item, item.url) == removeParams(item, req.url)) && item.url.split("/").filter(n => n).length == req.url.split("/").filter(n => n).length && item.Method == req.method);
            
            req.params = {};

            let n = 0;
            
            route.url.split("/").forEach((part) => {
              if (part[0] == ":") {
                
                req.params[part.slice(1)] = req.url.split("/")[n]
              }
              
              n++
            })

            if (route !== undefined) {
              if (route.Method == "POST" || route.Method == "PUT" || route.Method == "DELETE") {
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
            }

            if (route == undefined && server.length !== 0) {
                res.writeHead(404, { 'server': 'SandGate', 'Content-Type': mime.contentType(this.opts["404"].replace(/^.*[\\\/]/, '')) });
                res.write(fs.readFileSync(this.opts["404"]))

                res.end()
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
module.exports.cors = ((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, POST, GET")
  res.setHeader("Access-Control-Max-Age", "2592000")
})