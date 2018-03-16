// Requires

var express = require('express');
var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/autenticacion');

/* var SEED = require('../config/config').SEED; */
var Medico = require('../models/medico');


//Inicializar variables
var app = express();

// ======================================================
// Obtener todos los medicos
// ======================================================

app.get('/', (req, res, next) => {

    Medico.find({}, 'nombre img usuario hospital')
        .exec(
            (err, medico) => {

                if (err) {
                    return res.status(500).json({
                        ok: true,
                        mensaje: 'Error cargando el médico',
                        errors: err

                    });
                }

                res.status(200).json({
                    ok: true,
                    medico: medico
                });


            });

});

// ======================================================
// Crear un nuevo médico
// ======================================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: true,
                mensaje: 'Error al crear el médico',
                errors: err

            });
        }

        res.status(201).json({
            ok: true,
            medico: medicoGuardado,
            medicotoken: req.medico
        });

    });
});


// ======================================================
// Actualizar un medico
// ======================================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {

        if (err) {
            return res.status(500).json({
                ok: true,
                mensaje: 'Error al buscar medico',
                errors: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok: true,
                mensaje: 'El medico con el id ' + id + ' no existe',
                errors: { message: 'No existe un medico con ese ID ' }
            });
        }

        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;


        /*  Object.keys(req.body).forEach(key => {
             usuario[key] = req.body[key];
         }); */

        medico.save((err, medicoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });
            }



            res.status(200).json({
                ok: true,
                medico: medicoGuardado

            });

        });

    });


});


// ======================================================
// Borrar un medico por el ID
// ======================================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: true,
                mensaje: 'Error al borrar medico',
                errors: err
            });
        }

        if (!medicoBorrado) {
            return res.status(400).json({
                ok: true,
                mensaje: 'No existe un medico con ese ID',
                errors: { message: 'No existe un medico con ese ID ' }
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado

        });


    });


});


module.exports = app;