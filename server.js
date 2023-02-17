// const jsonServer = require('json-server');
// const app = jsonServer.create();
// const path = require('path');
// const express = require('express');
// const middlewares = jsonServer.defaults();
// const router = jsonServer.router('./src/db/db.json');
// const port = process.env.PORT || 3000;

// app.use('/db', middlewares, router);
// app.use(express.static(path.join(__dirname, 'build')));

// app.get('/*', function (req, res) {
//     res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

// app.listen(port);

const jsonServer = require("json-server");
const clone = require("clone");
const data = require("./db.json");

const isProductionEnv = process.env.NODE_ENV === "production";
const server = jsonServer.create();

// For mocking the POST request, POST request won't make any changes to the DB in production environment
const router = jsonServer.router(isProductionEnv ? clone(data) : "db.json", {
  _isFake: isProductionEnv,
});
const middlewares = jsonServer.defaults();

server.use(middlewares);

server.use((req, res, next) => {
  if (req.path !== "/") router.db.setState(clone(data));
  next();
});

server.use(router);
server.listen(process.env.PORT || 8000, () => {
  console.log("JSON Server is running");
});

// Export the Server API
module.exports = server;