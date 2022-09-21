const path = require('path');
const fs = require('fs');

const { response } = require("express");
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require("../helpers/actualizar-imagen");


const fileUpload = ( req, res = response ) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    //Validar tipo
    const tiposValidos = ['sucursales', 'empleados', 'usuarios'];
    if ( !tiposValidos.includes(tipo) ){
        return res.status(400).json({
            ok: false,
            msg: 'No es un empleado, usuario o sucursal(tipo)'
        });
    }
    //Validar que existe un archivo
    // Viene de la documentacion en https://github.com/richardgirges/express-fileupload/tree/master/example#basic-file-upload
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No se cargo ningun archivo'
        })
      }

    //procesar la imagen
    const file =  req.files.imagen;

    const nombreCortado = file.name.split('.') //default.1.2.3.jpg
    const extensionArchivo = nombreCortado [ nombreCortado.length-1 ];

    //Validar extension
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif','JPG','PNG', 'JPEG'];
    if ( !extensionesValidas.includes( extensionArchivo ) ){
        return res.status(400).json({
            ok: false,
            msg: 'No es correcta la extension del archivo'
        })
    }  

    //Generar el nombre del archivo
    const nombreArchivo = `${ uuidv4() }.${ extensionArchivo }`;

    // Path para guardar la imagen
    const path = `./uploads/${ tipo }/${ nombreArchivo }`;

    // Mover imagen cargada
    file.mv( path, (err) => {
        if (err){
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            })
        }

        //Actualizar la BD
        actualizarImagen( tipo, id, nombreArchivo );

        res.json({
            ok: true,
            msg: 'Archivo cargado',
            nombreArchivo
        });    
    });

    
}


const retornaImagen = ( req, res = response) => {

    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join( __dirname, `../uploads/${ tipo }/${ foto }` );

    //Imagen por defecto sino existe
    if( fs.existsSync( pathImg ) ){
        res.sendFile( pathImg );
    } else { 
        const pathImg = path.join( __dirname, `../uploads/no-img-def.jpg` );
        res.sendFile( pathImg );
    }


}

module.exports = {
    fileUpload,
    retornaImagen
}