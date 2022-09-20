const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({

    nombre:{
            type: String,
            required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    // pss:{
    //     type: String,
    //     required: false
    // },
    img:{
        type: String,
    },
    rol:{
        type: String,
        required: true,
        default: 'User_ROL'
    },
    google:{
        type: Boolean,
        default: false
    },

});

/* Configuracion para cambiar nombre de _id a uid y excluir la contrasenia del listado en GET */
UsuarioSchema.method('toJSON', function(){
    const { _v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model( 'Usuario', UsuarioSchema );