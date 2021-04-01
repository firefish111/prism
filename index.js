const expr = require("express"),
      app  = expr(),
      serv = require("http").createServer(app),
      io   = require("socket.io")(serv),
      f    = require("fs"),
      sass = require("node-sass-middleware");

app.use(sass({
  src: __dirname,
  dest: `${__dirname}/public`,
  outputStyle: 'compressed',
}));

let rhex  = () => Math.random().toString(16).slice(2, 8),
    read  = li => require(`./data/${li}`),
    write = (dat, li) => f.writeFileSync(`./data/${li}.json`, JSON.stringify(dat));

app.set("view engine", "pug");
app.use(expr.static(`${__dirname}/public`));

app.get("/signup", (req, res) => {
  let usr = req.get('X-Replit-User-Name');
  if (!Object.keys(read("data")).includes(usr)) {
    res.render("signup.pug", {
      name: usr ? usr : false,
      colq: [rhex(), rhex()]
    });
  } else res.redirect("/home")
});

app.get("/home", (req, res) => {
  let usr = req.get("X-Replit-User-Name");
  if (usr) {
    res.render("home.pug", { name: usr, posts: read("posts") });
  } else
    res.status(403).render("404.pug", { err: 403 });
});

app.get("/", (req, res) => {
  let usr = req.get("X-Replit-User-Name");
  if (usr) res.redirect("/home");
  else res.render("index.pug");
});

app.get("*", (_, res) => {
  res.status(404).render("404.pug", { err: 404 });
});

io.on("connection", sock => {
  console.log("New session started.");
  sock.on("acc-new", (usr, prism) => {
    console.log(`débug: new acc by name of ${usr}, with prismic ${prism}`);
    let dat = read("data");
    dat[usr] = { prismic: prism };
    write(dat, "data");
  });
});

serv.listen(6111);