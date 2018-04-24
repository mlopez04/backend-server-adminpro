// Requires

var express = require('express');
var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/autenticacion');

var Hospital = require('../models/hospital');


//Inicializar variables
var app = express();

// ======================================================
// Obtener todos los hospitales
// ======================================================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, hospitales) => {

                if (err) {
                    return res.status(500).json({
                        ok: true,
                        mensaje: 'Error cargando hospital',
                        errors: err

                    });
                }

                Hospital.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        hospitales: hospitales,
                        total: conteo
                    });
                });



            });

});


// ======================================================
// Actualizar un hospital
// ======================================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {

        if (err) {
            return res.status(500).json({
                ok: true,
                mensaje: 'Error al buscar un hospital',
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: true,
                mensaje: 'El hospital con el id ' + id + ' no existe',
                errors: { message: 'No existe un hospital con ese ID ' }
            });
        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;


        /*  Object.keys(req.body).forEach(key => {
             usuario[key] = req.body[key];
         }); */

        hospital.save((err, hospitalGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado

            });

        });

    });


});

// ======================================================
// Crear un nuevo hospital
// ======================================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: true,
                mensaje: 'Error al crear hospital',
                errors: err

            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado,
            hospitaltoken: req.hospital
        });

    });
});


// ======================================================
// Borrar un hospital por el ID
// ======================================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: true,
                mensaje: 'Error al borrar hospital',
                errors: err
            });
        }

        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: true,
                mensaje: 'No existe ningún hospital con ese ID',
                errors: { message: 'No existe ningún hospital con ese ID ' }
            });
        }

        res.status(200).json({
            ok: true,
            usuario: hospitalBorrado

        });


    });


});

module.exports = app;