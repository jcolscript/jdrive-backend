const jwt = require('jsonwebtoken');

exports.generateToken = async (data) => {
    return await jwt.sign(data, process.env.SALT, {
        expiresIn: '3h'
    });
}

exports.decodeToken = async (token) => {
    let data = await jwt.verify(token, process.env.SALT);
    return data;
}

exports.authorize = (req, res, next) => {
    let token = req.headers['x-access-token'];

    if (!token) {
        res.status(401).json({
            sucess: false,
            message: 'unauthorized access'
        });
    } else {
        jwt.verify(token, process.env.SALT, function (error, decoded) {
            if (error) {
                res.status(401).json({
                    sucess: false,
                    message: 'unauthorized access, invalid token'
                });
            } else {
                next();
            }
        })
    }
}