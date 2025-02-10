var mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

paymentschema = new Schema({
    sequence_id: {
        type: String,
        lovercase: true,
        trim: true,
        required: true
    },
    doctor_id: {
        type: Schema.Types.ObjectId,
    },
    patient_id: {
        type: Schema.Types.ObjectId,
    },
    amount:{
        type:Number
    },
    payment_method:{
        type:String,
        default:"EVC-Plus"
    },
    status: {
        type: String,
        default: 'Paid'
    },
    token: {
        type: String,
    },
    type: {
        type: Number,
        default: 0
    },
    create_date: {
        type: Date,
        default: Date.now
    }
});


paymentschema.index({ create_date: 1 }, { background: true });


module.exports = mongoose.model('payment', paymentschema);