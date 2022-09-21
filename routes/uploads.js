/*
    Carga de archivos
    ruta: '/api/uploads/'
*/
const { Router } = require('express'); 
const expressfileUpload = require('express-fileupload');

const { validarJWT } = require('../middlewares/validar-jwt');
const { fileUpload, retornaImagen } = require('../controllers/uploads');


const router = Router();

// Viene de la documentacion en https://github.com/richardgirges/express-fileupload/tree/master/example#basic-file-upload
router.use(expressfileUpload());

router.put( '/:tipo/:id', validarJWT, fileUpload );

router.get( '/:tipo/:foto', retornaImagen );



module.exports = router;