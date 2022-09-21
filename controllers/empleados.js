const { response } = require('express');

const Empleado = require('../models/empleado');

const getEmpleados = async(req, res = response) => {
    
    const empleados = await Empleado.find()
                                        .populate('usuario', 'nombre img')
                                        .populate('sucursal', 'nombre img');

    res.json({
        ok: true,
        empleados
    })


}

const crearEmpleado = async(req, res = response) => {
     //Recibimos es UID del usuario q esta creando el empleado
    const uid = req.uid;
    const empleado = new Empleado({
        usuario: uid,
        ...req.body
    });


    try {
        // Guardar empleado
        const empleadoDB = await empleado.save();
        //Mandamos como respuesta empleadoDB que es el empleado creado
        res.json({
            ok: true,
            empleado: empleadoDB
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Error en crearEmpleado contacte al admin'
        })
    }

}

const actualizarEmpleado = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'actualizarEmpleado'
    })
}

const borrarEmpleado = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'borrarEmpleado'
    })
}





module.exports = {
    getEmpleados,
    crearEmpleado,
    actualizarEmpleado,
    borrarEmpleado,
}