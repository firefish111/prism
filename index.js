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

const rhex  = () => Math.random().toString(16).slice(2, 8),
    read  = loc => JSON.parse(f.readFileSync(`./data/${loc}.json`)),
    write = (dat, loc) => f.writeFileSync(`./data/${loc}.json`, JSON.stringify(dat));

app.set("view engine", "pug");
app.use(expr.static(`${__dirname}/public`));

app.get("/signup", (req, res) => {
  let usr = req.get('X-Replit-User-Name').toLowerCase();
  if (!Object.keys(read("data")).includes(usr)) {
    res.render("signup.pug", {
      name: usr ? usr : false,
      colq: [rhex(), rhex()]
    });
  } else res.redirect("/home")
});

app.get("/account", (req, res) => {
  let usr = req.get('X-Replit-User-Name').toLowerCase(),
      dat = read("data");
  if (Object.keys(dat).includes(usr)) {
    res.render("accview.pug", {
      name: usr || false,
      bio: dat[usr].bio
    });
  } else res.status(403).render("404.pug", { err: 403 });
});

app.get("/home", (req, res) => {
  let usr = req.get("X-Replit-User-Name").toLowerCase();
  if (usr) res.render("home.pug", { name: usr, posts: read("posts") });
  else res.status(403).render("404.pug", { err: 403 });
});

app.get("/post", (req, res) => {
  let usr = req.get("X-Replit-User-Name").toLowerCase();
  if (usr) res.render("post.pug", { name: usr });
  else res.status(403).render("404.pug", { err: 403 });
});

app.get("/", (req, res) => {
  let usr = req.get("X-Replit-User-Name").toLowerCase();
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
    dat[usr.toLowerCase()] = { prismic: prism, bio: "" };
    write(dat, "data");
  });
  
  sock.on("bio", (usr, bio) => {
    console.log(`débug: bio of acc ${usr} changed to ${bio}`);
    let dat = read("data");
    dat[usr.toLowerCase()].bio = bio;
    write(dat, "data");
  });

  sock.on("getUsr", (usr, fe) => {
    console.log(`débug: get prismic of ${usr}`);
    let dt = read("data")[usr.toLowerCase()];
    console.log(dt, typeof dt);
    fe(read("data")[usr.toLowerCase()].prismic);
  });
});

serv.listen(6111);
