const fs = require('fs');

const Empleado = require('../models/empleado');
const Sucursal = require('../models/sucursal');
const Usuario = require('../models/usuario');

const borrarImagen = ( path ) =>{
    if ( fs.existsSync( path ) ){
        // borrar la imagen anterior
        fs.unlinkSync( path );
 }
}


const actualizarImagen = async( tipo, id, nombreArchivo ) => {

    let pathViejo = '';

    switch ( tipo ) {
        case 'empleados':
            const empleado = await Empleado.findById(id);
            if ( !empleado ){
                console.log('No es un empleado por id');
                return false;
            }
            //Si existe una img asociada anterior en la base de datos, la borra
            pathViejo = `./uploads/empleados/${ empleado.img }`;
            //Vamos a la funcion que lo hace
            borrarImagen( pathViejo );

            empleado.img = nombreArchivo;
            await empleado.save();
            return true;

        break;

        case 'sucursales':
            const sucursal = await Sucursal.findById(id);
            if ( !sucursal ){
                console.log('No es una sucursal por id');
                return false;
            }
            //Si existe una img asociada anterior en la base de datos, la borra
            pathViejo = `./uploads/sucursales/${ sucursal.img }`;
            //Vamos a la funcion que lo hace
            borrarImagen( pathViejo );

            sucursal.img = nombreArchivo;
            await sucursal.save();
            return true;

        break;     
        
        case 'usuarios':
            const usuario = await Usuario.findById(id);
            if ( !usuario ){
                console.log('No es un usuario por id');
                return false;
            }
            //Si existe una img asociada anterior en la base de datos, la borra
            pathViejo = `./uploads/usuarios/${ usuario.img }`;
            //Vamos a la funcion que lo hace
            borrarImagen( pathViejo );

            usuario.img = nombreArchivo;
            await usuario.save();
            return true;
        break;                  

    }


}


module.exports = {
    actualizarImagen
}