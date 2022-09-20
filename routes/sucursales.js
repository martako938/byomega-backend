/*
    Sucursales
    ruta: '/api/sucursales'
*/

const { Router } = require('express'); 
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jwt');

const { 
        getSucursales,
        crearSucursal,
        actualizarSucursal,
        borrarSucursal
    } = require('../controllers/sucursales') 


const router = Router();

router.get( '/', validarJWT, getSucursales );

router.post( '/',
    [
        validarJWT,
        check('nombre', 'El nombre de la sucursal es necesario').not().isEmpty(),
        validarCampos
    ], 
    crearSucursal
 );

 router.put( '/:id', 
     [],     
     actualizarSucursal
);

router.delete( '/:id',    
    borrarSucursal
);


module.exports = router;