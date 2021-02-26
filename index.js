const expr = require("express"),
      app  = expr(),
      serv = require("http").createServer(app),
      io   = require("socket.io")(serv),
      f    = require("fs"),
      sass = require("node-sass-middleware");

app.use(sass({
  src: __dirname,
  dest: `${__dirname}/public`,
  outputStyle: 'extended',
}));

app.set("view engine", "pug");
app.use(expr.static(`${__dirname}/public`));

app.get("/signup", (req, res) => {
  let usr = req.get('X-Replit-User-Name');
  res.render("signup.pug", {
    name: usr ? usr : false }
  );
});

app.get("/", (_, res) => {
  res.render("index.pug");
});

app.get("*", (_, res) => {
  res.status(404).render("404.pug", { err: 404 });
});

io.on("connection", sock => {
  console.log("New session started.");
  sock.on("acc-new", (usr, prism) => {
    console.log(`débug: new acc by name of ${usr}, with prismic ${prism}`)
  });
});

serv.listen(6111);