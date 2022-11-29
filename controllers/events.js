const express = require('express');
const Evento = require('../models/Evento');

const getEventos = async(req, res = express.response) => {

    const eventos = await Evento.find()
                                .populate('user', 'name');


    res.json({
        ok : true,
        eventos
    })
}


const crearEvento = async(req, res = express.response) => {

    const evento = new Evento( req.body );

    try {

        evento.user = req.uid

        const eventoGuardado = await evento.save();
        
        res.json({
            ok: true,
            evento: eventoGuardado

        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'hable con el Admin'
        });
        
    }


}


const actualizarEvento = async(req, res = express.response) => {

    const eventoId = req.params.id
    const uid = req.uid
    
    try {

        const evento = await Evento.findById(eventoId);

        if( !evento ){
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            });
        }

        if (evento.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'no puede editar este evento por que no le pertenece'
            });
        }

        const nuevoEvento = {
            ...req.body,
            user : uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, {new: true} );

        res.json({
            ok : true,
            evento: eventoActualizado
        });
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'hable con el Admin'
        });       
    }
    
}


const eliminarEvento = async(req, res = express.response) => {


    const eventoId = req.params.id
    const uid = req.uid
    
    try {

        const evento = await Evento.findById(eventoId);

        if( !evento ){
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            });
        }

        if (evento.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'no puede eliminar este evento por que no le pertenece'
            });
        }

        await Evento.findByIdAndDelete( eventoId );

        res.json({
            ok : true
        });
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'hable con el Admin'
        });       
    }

}


module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}