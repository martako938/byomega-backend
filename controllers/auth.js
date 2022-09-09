const { response } = require('express');
const bcrypt = require('bcryptjs/dist/bcrypt');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');


const login = async( req, res) => {

    const { email, password } = req.body;

    try {

        //Verificar email
        const usuarioDB = await Usuario.findOne({ email });

        if ( !usuarioDB ){
            return res.status(400).json({
                ok: false,
                msg: 'El email no fue encontrado'
            })
        }

        //verificar contraseña
        const validPassword = bcrypt.compareSync( password, usuarioDB.password );
        if ( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no valida'
            });
        }

        //Generar el TOKEN  - JWT
        const token = await generarJWT( usuarioDB.id );

        res.json({
            ok: true,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el adminstardor de auth cont.js'
        })
    }

}


module.exports = {
    login
}