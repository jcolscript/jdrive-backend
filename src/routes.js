const express = require('express');
const multer = require('multer');
const multerConfig = require('./config/multer');

const authServices = require('./services/authService');

const routes = express.Router();

const FolderController = require('./controllers/FolderController');
const FileController = require('./controllers/FileController');
const UserController = require('./controllers/UserController');

routes.post("/", (req, res) => {
    res.json({message: "Connected"})
});
routes.post("/users/signup", UserController.signup);
routes.post("/users/signin", UserController.signin);
routes.post("/folders", authServices.authorize, FolderController.create);
routes.get("/folders", authServices.authorize, FolderController.getAll);
routes.post("/folders/:id/files", authServices.authorize, multer(multerConfig).single('file'), FileController.create);
routes.get("/folders/:id", authServices.authorize, FolderController.getById);
// routes.post("/send", UserController.send);


module.exports = routes;