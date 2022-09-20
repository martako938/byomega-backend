const { Schema, model } = require('mongoose');

const SucursalSchema = Schema({

    nombre:{
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

}, { collection: 'sucursales' });


SucursalSchema.method('toJSON', function(){
    const { _v, ...object } = this.toObject();
    return object;
});

module.exports = model( 'Sucursal', SucursalSchema );