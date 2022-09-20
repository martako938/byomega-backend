const { Schema, model } = require('mongoose');

const EmpleadoSchema = Schema({

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
    img:{
        type: String,
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
    sucursal: {
        type: Schema.Types.ObjectId,
        ref: 'Sucursal',
        required: true,
    },

});


EmpleadoSchema.method('toJSON', function(){
    const { _v, ...object } = this.toObject();
    return object;
});

module.exports = model( 'Empleado', EmpleadoSchema );