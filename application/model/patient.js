var mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

patientschema = new Schema({
    sequence_id: {
        type: String,
        lovercase: true,
        trim: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    user_name: {
        type: String,
    },
    phone: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    password: String,
    status: {
        type: Number,
        default: 0
    },
    age: {
        type: Number,
        required: true,
        min: 0
      },
      address: {
        type: String,
        required: true,
        trim: true
      },
      gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true,
      },
    token: {
        type: String,
    },
    extra_detail: {
        type: String,
    },
    type: {
        type: Number,
        default: 0
    },
    picture: String,
    create_date: {
        type: Date,
        default: Date.now
    }
});


patientschema.index({ email: 1 }, { background: true });
patientschema.index({ phone: 1 }, { background: true });
patientschema.index({ create_date: 1 }, { background: true });

//Create a Schema method to compare password 
patientschema.methods.comparePassword = function (passwords) {
    return bcrypt.compareSync(passwords, this.password);
}
module.exports = mongoose.model('patient', patientschema);