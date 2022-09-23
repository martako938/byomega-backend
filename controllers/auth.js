const { response } = require('express');
const bcrypt = require('bcryptjs/dist/bcrypt');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-veryfy');


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

const loginGoogle = async( req, res = response ) => {
    
    try {
        //Imprime en consola de navegador usuario el objeto de google 
        const { email, name, picture } = await googleVerify( req.body.token );
        //Para guardar usuario en DB
        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        if ( !usuarioDB ) {
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            })
        } else {
            usuario = usuarioDB;
            usuario.google = true;
            //Si ya existe el usuario no cambiar la contraseña o cambiarla
            // usuario.password = '@@';
        }

        //Guardar usuario
        await usuario.save();

        //Generar el TOKEN  - JWT
        const token = await generarJWT( usuario.id );

        res.json({
            ok: true,
            email, name, picture,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'token de google no es correcto'
        })
    }
}

const renewToken = async (req, res = response ) => {

    const uid = req.uid;

    //Generar el TOKEN  - JWT
    const token = await generarJWT( uid );

    res.json({
        ok: true,
        token
    })

}




module.exports = {
    loginGoogle,
    login,
    renewToken
}