var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;


// ======================================================
// Verificar ToKEN - Middleware
// ======================================================

exports.verificaToken = function(req, res, next) {

    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: true,
                mensaje: 'Token incorrecto. No se encuentra autorizado',
                errors: err
            });
        }

        req.usuario = decoded.usuario;

        next(); //para que continúe con las funciones


    });
}