var mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

settingchema = new Schema({
    firebase_token: {
        type: String, 
        default:"AAAAjib-3fA:APA91bGcXBe6HBl61YYdoVKqFsSin_X5d9A2V5rNi0jSLU-3rnpdTTf9OoeXxpSZ-tnh33kSEFq-0fgoMsCdorSromVh2xQBKiNYvE9FBM5uS5zrOZJdFxcvw67JIxc3bHXZqqa7ln6e"
    },
   
});



//Create a Schema method to compare password 

module.exports = mongoose.model('setting', settingchema);