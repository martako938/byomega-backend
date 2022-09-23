/*
    Empleados
    ruta: '/api/empleados'
*/

const { Router } = require('express'); 
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jwt');

const { 
        getEmpleados,
        crearEmpleado,
        actualizarEmpleado,
        borrarEmpleado,
    } = require('../controllers/empleados') 


const router = Router();

router.get( '/', validarJWT, getEmpleados );

router.post( '/',
    [
        validarJWT,
        check('nombre', 'El nombre del empleado es necesario').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('sucursal', 'El id de la sucursal debe ser valido').isMongoId(),
        validarCampos
    ], 
    crearEmpleado
 );

 router.put( '/:id', 
     [
        validarJWT,
        check('nombre', 'El nombre del empleado es necesario').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('sucursal', 'El id de la sucursal debe ser valido').isMongoId(),
        validarCampos  
     ],     
     actualizarEmpleado
);

router.delete( '/:id',   
    validarJWT, 
    borrarEmpleado
);


module.exports = router;