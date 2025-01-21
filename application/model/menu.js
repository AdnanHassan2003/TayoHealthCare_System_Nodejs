var mongoose = require('mongoose');
var Schema = mongoose.Schema;

menuschema = new Schema({
    sequence_id: String,
    title: {
        type: String,
        required: true
    },
    parent_menu: {
        type: Schema.Types.ObjectId,
        default: null
    },
    type: {
        type: Number,
        default: 1
    },
   
    status: {
        type: Number,
        default: 1
    },
    icon: {
        type: String,
        default: ""
    },
    url: {
        type: String,
        default: ""
    },
    create_date: {
        type: Date,
        default: Date.now
    }
});

menuschema.index({type: 1}, {background: true});
menuschema.index({title: 1}, {background: true});
menuschema.index({parent_menu: 1}, {background: true});
module.exports = mongoose.model('menu', menuschema);