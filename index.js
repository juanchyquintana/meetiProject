const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const router = require("./routes");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("./config/passport.js");

require("dotenv").config({ path: ".env" });

const db = require("./config/db.js");
require("./models/Usuarios.js");
require("./models/Categorias.js");
require("./models/Comentarios.js");
require("./models/Grupos.js");
require("./models/Meeti.js");
db.sync()
  .then(() => console.log("DB Conectada"))
  .catch((error) => console.log(error));

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));

app.use(express.static("public"));

app.use(cookieParser());

app.use(
  session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
  res.locals.usuario = {...req.user} || null;
  res.locals.mensajes = req.flash();
  const fecha = new Date();
  res.locals.year = fecha.getFullYear();

  next();
});

app.use("/", router());

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 5000

app.listen(port, host, () => {
  console.log(`Servidor Funcionando`);
});
