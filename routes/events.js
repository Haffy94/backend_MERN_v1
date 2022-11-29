/* 
    Rutas de Usuarios /events
    host + /api/events
*/
const express = require('express');
const { check } = require('express-validator');

const { isDate } = require('../helpers/isDate');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt')
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events')

const router = express.Router();
//todas tienen que estar validadas por jwt
router.use( validarJWT );

// obtener eventos
router.get(
        '/',
        getEventos);


//crear un nuevo evento
router.post(
        '/',
        [
                check('title', 'el titulo es obligatorio').not().isEmpty(),
                check('start', 'fecha de inicio es obligatoria').custom( isDate ),
                check('end', 'fecha de finalizacion es obligatoria').custom( isDate ),
                validarCampos
        ], 
        crearEvento);


//actualizar evento
router.put(
        '/:id',
        [
                check('title', 'el titulo es obligatorio').not().isEmpty(),
                check('start', 'fecha de inicio es obligatoria').custom( isDate ),
                check('end', 'fecha de finalizacion es obligatoria').custom( isDate ),
                validarCampos
        ],
        actualizarEvento);

//borrar evento
router.delete(
        '/:id',
        eliminarEvento);



module.exports= router;


