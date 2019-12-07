const File = require('../models/File');
const Folder = require('../models/Folder');
const logger = require('../utils/logger');

class FileController {
    async create(req, res) {
        try {
            const folder = await Folder.findById(req.params.id);
            const file = await File.create({
                title: req.file.originalname,
                path: req.file.key,
            });
            folder.files.push(file);
            await folder.save();
            req.io.sockets.in(folder._id).emit('file', file);
        
            return res.json(file);
        } catch (error) {
            logger.error(error)
        }
        
    }
}

module.exports = new FileController();