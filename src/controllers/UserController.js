const User = require('../models/User');
const authService = require('../services/authService');
const mailer = require('../services/mailer');
const logger = require('../utils/logger');

class UserController {
    async signup(req, res) {
        try {
            const user = await User.create(req.body);

            const email = {
                template: 'registration',
                destino: req.body.email,
                assunto: 'JDrive - Confirmação de registro',
                context: {
                    name: req.body.name,
                },
            };

            try {
                const response = await mailer.sendMail(email);
                logger.info(` email enviado com sucesso - ${req.body.email}`);
            } catch (error) {
                logger.error('erro ao enviar o email');
                logger.error(error);
            }

            res.status(201).json({
                code: 201,
                message: "Created Item",
                id: user.id
            });
            
        } catch (error) {
            logger.error(error);
            res.status(400).json({
                code: 400,
                message: "Bad request",
            });
        }
    }

    async signin(req, res) {
        const {
            email,
            password
        } = req.body;
        if (!email || !password) {
            res.status(401).json({
                success: false,
                code: 401,
                message: 'username and/or password invalid'
            });
        } else {
            const userData = await User.findOne({
                email
            });
            if (!userData) {
                res.status(401).json({
                    success: false,
                    code: 401,
                    message: 'username and/or password invalid'
                });
            } else {
                if (User.comparePassword(password, userData.password)) {
                    const tokenData = {
                        id: userData.id,
                        name: userData.name,
                        lastName: userData.lastName,
                        email: userData.email,
                        genre: userData.genre,
                        birthDate: userData.birthDate,
                        folders: userData.folders,
                        avatar: userData.avatar,
                        createdAt: userData.createdAt                        
                    }
                    const token = await authService.generateToken(tokenData);
                    res.status(200).json({jdrive_token: token});
                } else {
                    res.status(401).json({
                        success: false,
                        code: 401,
                        message: 'username and/or password invalid'
                    });                    
                }
            }
        }
    }
}

module.exports = new UserController();