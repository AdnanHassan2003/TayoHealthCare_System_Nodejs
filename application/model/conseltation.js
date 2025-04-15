var mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

conseltationschema = new Schema({
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
    roomID: {
        type: String,
        required: true
      },
      status: {
        type: String,
        enum: ["ringing", "answered", "ended", "pending"],
        default: "pending"
      },
    create_date: {
        type: Date,
        default: Date.now
    }
});

conseltationschema.index({ create_date: 1 }, { background: true });


module.exports = mongoose.model('conseltation', conseltationschema);