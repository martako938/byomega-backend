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

const actualizarSucursal = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'actualizarSucursal'
    })
}

const borrarSucursal = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'borrarSucursal'
    })
}





module.exports = {
    getSucursales,
    crearSucursal,
    actualizarSucursal,
    borrarSucursal
}
