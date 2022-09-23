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

const actualizarEmpleado = async(req, res = response) => {
    const id = req.params.id;
    //para el uid dela sucursal donde pertenece
    const uid = req.uid;

    try {

        const empleado = await Empleado.findById( id );
        
        if( !empleado){
            return res.status(404).json({
                ok: true,
                msg: 'No se encontro empleado con este id',
                id
            })
        }
        //Actualizando el nombre
        const cambiosEmpleado = {
            ...req.body,
            usuario: uid
        }
        //Actualiza en la BD todo lo que le enviamos
        const empleadoActualizado = await Empleado.findByIdAndUpdate( id, cambiosEmpleado, { new: true });

        res.json({
            ok: true,
            empleado: empleadoActualizado
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error en actualizarEmpleado'
        });
    }
}

const borrarEmpleado = async(req, res = response) => {

    const id = req.params.id;

    try {
        const empleado = await Empleado.findById( id );   
        if( !empleado){
            return res.status(404).json({
                ok: true,
                msg: 'No se encontro empleado con este id',
                id
            })
        }
        //Borrando empleado pasandole el id por url
        await Empleado.findByIdAndDelete( id );

        Empleado.nombre = req.body.nombre;
        res.json({
            ok: true,
            msg: 'Empleado eliminado'
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error en borrarEmpleado'
        });
    }
}





module.exports = {
    getEmpleados,
    crearEmpleado,
    actualizarEmpleado,
    borrarEmpleado,
}