const { response } = require('express');
const bcrypt = require('bcryptjs/dist/bcrypt');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');


const getUsuarios = async(req, res) => { 
    //Para recibir de parametro de url el 5 
    const desde = Number(req.query.desde) || 0;

    // const usuarios = await Usuario
    //                         .find({}, 'nombre email rol google') //agregar pss para cont sin bcrypt
    //                         .skip(desde)
    //                         .limit( 5 );
    // //contar cuantos registros hay
    // const total = await Usuario.count(); 
    
  const [ usuarios, total ] =   await Promise.all([
        Usuario
          .find({}, 'nombre email rol google img') //agregar pss para cont sin bcrypt
          .skip(desde)
          .limit( 5 ),

        Usuario.countDocuments()  
    ])

    res.json({
        ok: true,
        usuarios,
        total
    });

}

const crearUsuario = async(req, res = response) => { 

    const { email, password } = req.body; 


    try {

        const existeEmail = await Usuario.findOne({ email });
        
        if ( existeEmail ){
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado'
            });
        }

        const usuario = new Usuario( req.body );

        // Encriptar contraseña y guardarla sin encriptar en pss habilitar en modelo y en get
        //usuario.pss = password;
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );
        

        // Guardar usuario
        await usuario.save();

        //Generar el TOKEN  - JWT
        const token = await generarJWT( usuario.id );


        res.json({
            ok: true,
            usuario,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar crearUsuario'
        });
    }

}

const actualizarUsuario = async (req, res = response) => {

     // TODO : Validar token y comprobar si es el usuario correcto

    const uid = req.params.id;
    
    try {

        const usuarioDB = await Usuario.findById( uid );

        if ( !usuarioDB ){
            res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese uid'
            });
        }

        //Actualizaciones
        const { password, google, email, ...campos } = req.body;

        if ( usuarioDB.email !== email ){             
            const existeEmail = await Usuario.findOne({ email });
            if ( existeEmail ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con este email'
                });
            }
        }

        campos.email = email;
        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos );

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado en actualizarUsuario'
        })
    }

}

const borrarUsuario = async (req, res = response) => {

    const uid = req.params.id;

    try {
        //Verificar que exista el usuario
        const usuarioDB = await Usuario.findById( uid );

        if ( !usuarioDB ){
            res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese uid'
            });
        }

        await Usuario.findByIdAndDelete( uid );

        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error no se pudo borrar el usuario'
        });   
    }
}


module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}