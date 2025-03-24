var mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

appointmentschema = new Schema({
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
    appointment_date:{
        type: Date,
        required: true
    },
    shifts_id: {
        type: Schema.Types.ObjectId,
    },
    status: {
        type: Number,
        default: 0,
    },
    token: {
        type: String,
    },
    reason: {
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


appointmentschema.index({ create_date: 1 }, { background: true });


module.exports = mongoose.model('appointment', appointmentschema);