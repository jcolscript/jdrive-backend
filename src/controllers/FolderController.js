const Folder = require('../models/Folder');
const User = require('../models/User');
const logger = require('../utils/logger');

const authServices = require('../services/authService')

class FolderController {
    async create(req, res) {
        try {
            const token = req.headers['x-access-token'];
            const userData = await authServices.decodeToken(token);
            const user = await User.findById(userData.id);
            const folder = await Folder.create(req.body);
            user.folders.push(folder);
            await user.save();
            req.io.sockets.in(user._id).emit('folder', folder);

            return res.json(folder);
        } catch (error) {
            logger.error(error)
        }

    }

    async getAll(req, res) {
        try {
            let folders = null;
            const token = req.headers['x-access-token'];
            const userData = await authServices.decodeToken(token);
            const user = await User.findById(userData.id).populate({
                path: 'folders',
                options: { sort: { createdAt: -1 } }
            });
            if(user && user.folders) folders = user.folders

            return res.json(folders);
        } catch (error) {
            logger.error(error)
        }

    }

    async getById(req, res) {
        try {
            const folder = await Folder.findById(req.params.id).populate({
                path: 'files',
                options: { sort: { createdAt: -1 } }
            });
            
            return res.json(folder);
        } catch (error) {
            logger.error(error)
        }
    }
}

module.exports = new FolderController();