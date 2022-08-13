const express = require("express");
const cors = require("cors");
const sql = require("./app/models/db.js");

const app = express();

var corsOptions = {
  //origin: "http://localhost:3000" //frontend
  origin: "https://pacientes20.netlify.app" //frontend
};


app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json()); /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); /* bodyParser.urlencoded() is deprecated */

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Pacientes Back-End application." });
});

app.post("/login", (req, res) => {
  const {username, password} = req.body
  console.log(req.body);
  //const values = [username, password]
  
  sql.query(`SELECT * FROM login WHERE username = '${req.body.username}' AND password = '${req.body.password}'`, (err, result) => {
    if (err) {
      res.status(500).send(err)
    }else{
      if (result.length > 0) {
        res.status(200).send(result[0])
      }else{
        res.status(400).send('Usuario no existe')
      }
    }
  })
})

require("./app/routes/product.routes.js")(app);
require("./app/routes/category.routes.js")(app);

const server = app.listen(process.env.PORT || 3001, () => {
  const port = server.address().port;
  console.log(`Express is working on port ${port}`);
});