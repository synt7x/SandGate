let sand = require("./package")
let gate = new sand()

gate.listen(3000, (port) => {
    console.log("Listening on port " + port)
})