const { response } = require('express');

const Sucursal = require('../models/sucursal');


const getSucursales = async(req, res = response) => {

    const sucursales = await Sucursal.find()
                                        .populate('usuario', 'nombre img');

    res.json({
        ok: true,
        sucursales
    });
    
    
}

const crearSucursal = async(req, res = response) => {
    //Recibimos es UID del usuario q esta creando la sucursal
    const uid = req.uid;
    const sucursal = new Sucursal({
        usuario: uid,
        ...req.body
    });

    try {
        // Guardar sucursal
        const sucursalDB = await sucursal.save();
        //Mandamos como respuesta sucursalDB que es la sucursal creada
        res.json({
            ok: true,
            sucursal: sucursalDB
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Error en crearSucursal contacte al admin'
        })
    }

}

const actualizarSucursal = async(req, res = response) => {

    const id = req.params.id;
    //para el uide del usuario q lo creo
    const uid = req.uid;

    try {

        const sucursal = await Sucursal.findById( id );
        
        if( !sucursal ){
            return res.status(404).json({
                ok: true,
                msg: 'No se encontro sucursal con este id',
                id
            })
        }
        //Actualizando el nombre
        const cambiosSucursal = {
            ...req.body,
            usuario: uid
        }

        const sucursalActualizada = await Sucursal.findByIdAndUpdate( id, cambiosSucursal, { new: true });


        res.json({
            ok: true,
            sucursal: sucursalActualizada
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error en actualizarSucursal'
        });
    }

}

const borrarSucursal = async(req, res = response) => {
    
    const id = req.params.id;


    try {
        const sucursal = await Sucursal.findById( id );   
        if( !sucursal ){
            return res.status(404).json({
                ok: true,
                msg: 'No se encontro sucursal con este id',
                id
            })
        }
        //borrando sucursal pasandole el id por url
        await Sucursal.findByIdAndDelete( id );

        sucursal.nombre = req.body.nombre;
        res.json({
            ok: true,
            msg: 'Sucursal eliminada'
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error en borrarSucursal'
        });
    }

}





module.exports = {
    getSucursales,
    crearSucursal,
    actualizarSucursal,
    borrarSucursal
}
