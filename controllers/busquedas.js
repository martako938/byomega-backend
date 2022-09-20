const { response } = require('express');
const Usuario = require('../models/usuario');
const Empleado = require('../models/empleado');
const Sucursal = require('../models/sucursal');

const getTodo= async(req, res = response) => {
    //Obtener lo que viene en url
    const busqueda = req.params.busqueda;
    //Usando una expresion regular
    const regex = new RegExp( busqueda, 'i' );

    //Desestructurando para hacer todas las peticiones al mismo tiempo
    const [ usuarios, empleados, sucursales] = await Promise.all([
        Usuario.find({ nombre: regex }),
        Empleado.find({ nombre: regex }),
        Sucursal.find({ nombre: regex }),
    ])

    res.json({
        ok: true,
        usuarios,
        empleados,
        sucursales
    });
} 


const getDocumentosColeccion = async(req, res = response) => {
    //Obtener lo que viene en url
    const tabla    = req.params.tabla;
    const busqueda = req.params.busqueda;
    //Usando una expresion regular
    const regex    = new RegExp( busqueda, 'i' );
    
    let data = [];
    
    switch ( tabla ) {
        case 'empleados':
            data = await Empleado.find({ nombre: regex })
            .populate('usuario', 'nombre img')
            .populate('sucursal', 'nombre img');
            break;
            case 'sucursales':
                data = await Sucursal.find({ nombre: regex })
                .populate('usuario', 'nombre img');
            break;
            case 'usuarios':
                data = await Usuario.find({ nombre: regex }); 
            break;
                    
            default:
                return res.status(400).json({
                        ok: false,
                    msg: 'La tabla tiene que ser usuarios/empleados/sucursales'
                })       
    }
                    
    res.json({
        ok: true,
        resultados: data
    }) 
                    
} 
                
    module.exports = {
        getTodo,
        getDocumentosColeccion
    }