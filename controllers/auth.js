const express = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');


const crearUsuario = async(req, res = express.response) => {

    
    const { email, password } = req.body

    try {
        let usuario = await Usuario.findOne({ email });

        if ( usuario ) {
            return res.status(400).json({
                ok:false,
                msg: 'el usuario ya existe con este correo'
            })
        }

        usuario = new Usuario(req.body);

        //encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);


        await usuario.save();

        //generar jwt
        const token = await generarJWT(usuario.id, usuario.name);

        
        res.status(201).json({
            ok : true,
            uid: usuario.id,
            name: usuario.name,
            token
        })
            
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'hable con el admin'
        })
    }
    
    
}

const loginUsuario = async(req, res = express.response) => {

    const { email, password } = req.body 

    try {
        const usuario = await Usuario.findOne({ email });

        if ( !usuario ) {
            return res.status(400).json({
                ok:false,
                msg: 'el usuario no existe con este correo'
            });
        }

        //confirmar los passwords
        const validPassword = bcrypt.compareSync( password, usuario.password )

        if( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'Password Incorrecto'
            });
        }

        //generar nuestro json web token
        const token = await generarJWT(usuario.id, usuario.name);

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'hable con el admin'
        })
        
    }
    
}

const revalidarToken = async(req, res = express.response) => {

    const {uid, name} = req;

    //generar nuevo jwt 
    const token = await generarJWT(uid, name);

    res.json({
        ok : true,
        token: token
    })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken,
}