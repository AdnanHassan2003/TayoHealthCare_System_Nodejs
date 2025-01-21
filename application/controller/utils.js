//waxaa lagu qoraa functions ka intabasan solalabta kadibna lawacdo  si markasto looqorin
var myUtils = require('./utils');
var fs = require('fs');
var Admin = require('mongoose').model('admin')
var { customAlphabet } = require("nanoid");
var moment = require('moment');
var momentzone = require('moment-timezone');
var FCM = require('fcm-node');
var node_gcm=require("node-gcm")
var nodemailer = require('nodemailer');
var requestAPI = require('request');
const cons = require('consolidate');
//////crypto things end////////////////

//add hours to current timezone
Date.prototype.addHours = function () {
    this.setTime(this.getTime() + (process.env.time_zone_hour * 60 * 60 * 1000));
    return this;
}

exports.getTimeDifferenceInMinute = function (endDate, startDate) {
    var difference = 0;
    var startDateFormat = moment(startDate, process.env.DATE_FORMAT);
    var endDateFormat = moment(endDate, process.env.DATE_FORMAT);
    difference = endDateFormat.diff(startDateFormat, 'minutes')
    difference = (difference.toFixed(2));

    return difference;
};

exports.deleteImageFromFolderTosaveNewOne = function (old_img_path, name_id) {
    if (old_img_path != "" || old_img_path != null) {
        var old_file_name = old_img_path.split('/');
        var fs = require('fs');
        var old_file_path = myUtils.saveImageFolderPath(name_id) + old_file_name[1];

        fs.unlink(old_file_path, function (err, file) {
            if (err) {
            } else {
            }
        });
    }
};

exports.getImageFolderPath = function (name_id) {
    return myUtils.getImageFolderName(name_id);
};

//unique id with sufiix 07300 for fiyoore
exports.get_unique_id = function () {
    const alphabet = '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nanoid = customAlphabet(alphabet, 5)
    return "07300" + nanoid(); //=> "TMOTG7NQACG51CN";
}

exports.get_otp_number = function (length) {
    if (typeof length == "undefined")
        length = 4;
    var otp = "";
    var possible = "123456789";
    for (var i = 0; i < length; i++)
        otp += possible.charAt(Math.floor(Math.random() * possible.length));
    return otp;
}

exports.send_bulk_sms_otp = function (req, to, msg) {
    var username = "user";
    var password = "password";
    var options = {
        method: 'POST',
        uri: 'https://api.bulksms.com/v1/messages?auto-unicode=true',
        body: {
            to: to,
            body: msg,
        },
        json: true,
        headers: {
            'Authorization': 'Basic ' + new Buffer.from(username + ":" + password).toString('base64'),
            'content-type': 'application/json'
        }
    };
    requestAPI(options, function (error, response, body) {
        if (error) {
            //console.error(error.message);           
        } else {
            //console.log("here send sms ... ... ...");         
        }
    });
}

exports.send_infobip_sms_otp = function (to, msg) {
    const https = require('https')
    var username = 'user';
    var password = 'password';
    var auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
    const data = JSON.stringify({
        "messages": [{
            "from": process.env.app_name,
            "destinations": [{
                "to": to
            }],
            "text": msg
        }]
    });
    const options = {
        hostname: '4mel88.api.infobip.com',
        path: '/sms/2/text/advanced',
        method: 'POST',
        headers: {
            'Authorization': auth,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        maxRedirects: 20
    }
    const req = https.request(options, res => {
        res.on('data', d => {
            //console.log("infobip_sms", d);
        })
    })
    req.on('error', error => {
        console.log("infobip_sms_error", error);
    })
    req.write(data)
    req.end()
}

exports.send_email_otp = function (req, email, msg) {
    Settings.findOne({}, { email: 1, password: 1 }).then((setting) => {
        // create reusable transport method (opens pool of SMTP connections)
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: setting.email,
                pass: setting.password
            }
        });
        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: setting.email,
            to: email,
            subject: 'Verification',
            text: msg
        };
        // send mail with defined transport object
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                //console.log(error);               
            } else {
                //console.log('Email sent: ' + info.response);               
            }
        });
    });
}

exports.saveImageAndGetURL = function (imageID, req, res, id) {
    var pictureData = req.body.pictureData;
    function decodeBase64Image(dataString) {
        res.pictureData = Buffer.from(pictureData, 'base64');
        return res;
    }
    var urlSavePicture = myUtils.saveImageFolderPath(id);
    urlSavePicture = urlSavePicture + imageID + '.jpg';
    var imageBuffer = decodeBase64Image(pictureData);
    fs.writeFile(urlSavePicture, imageBuffer.pictureData, function (err) {
        //console.log(' File update successfully.');
    });
};

exports.saveImageAndGetURL_S3 = function (imageID, req, res, id) {
    var picture = req.body.picture;
    function decodeBase64Image() {
        res.picture = Buffer.from(picture, 'base64');
        return res;
    }
    var urlSavePicture = myUtils.saveImageFolderPath(id);
    urlSavePicture = "picture/" + urlSavePicture + imageID + '.jpg';

    var imageBuffer = decodeBase64Image();
    //save image in folder in app
    // fs.writeFile(urlSavePicture, imageBuffer.picture, function (err) {
    //     //console.log(' File update successfully.');
    // });

    //save file in s3
    AWS.config.update({
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    });

    var s3 = new AWS.S3();
    var params = {
        Bucket: process.env.BUCKET_NAME, // pass your bucket name
        Key: urlSavePicture, // file will be saved as 
        Body: imageBuffer.picture
    };
    s3.putObject(params, function (err, data) {
        if (err) {
            console.log("Error uploading data: ", err);
        }
    });

};

exports.saveImageIntoFolder = function (local_image_path, image_name, name_id) {
    console.log("saveImageIntoFolder", local_image_path)
    var file_new_path = myUtils.saveImageFolderPath(name_id) + image_name;
    fs.readFile(local_image_path, function (err, data) {
        fs.writeFile(file_new_path, data, 'binary', function (err) {
            if (err) {
            } else {
                response = {
                    message: 'File uploaded successfully'
                };
            }
        });

        fs.unlink(local_image_path, function (err, file) {
        });
    });
};

exports.saveImageFolderPath = function (name_id) {
    console.log("saveImageFolderPath",name_id)
    return '../uploads/' + myUtils.getImageFolderName(name_id);
};

exports.getImageFolderName = function (name_id) {
    switch (name_id) {
        case 1:
            return 'admin_profile/';
        default:
            break;
    }
};

////////////// TOKEN GENERATE ////////
exports.tokenGenerator = function (length) {
    if (typeof length == "undefined")
        length = 32;
    var token = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++)
        token += possible.charAt(Math.floor(Math.random() * possible.length));
    return token;

};

//for checking admin token
exports.check_admin_token = function (admin, response) {
   
    if (admin) { 
        // Token Verification 
        Admin.findOne({ _id: admin.user_id }, { _id: 1, token: 1 }).then((ad_data) => {
            if (ad_data && admin.token == ad_data.token) {
                response({ success: true, data: ad_data })
            }
            else {
                response({ success: false, data: undefined })
            }
        });
    } else {
        response({ success: false, data: undefined });
    }
}

//for checking admin token
exports.check_pos_admin_token = function (pos, response) {
    if (pos) {
        // Token Verification 
        Pos_admin.findOne({ _id: pos.user_id }, { _id: 1, token: 1 }).then((ad_data) => {
            if (ad_data && pos.token == ad_data.token) {
                response({ success: true, data: ad_data })
            }
            else {
                response({ success: false, data: undefined })
            }
        });
    } else {
        response({ success: false, data: undefined });
    }
}

//for checking jwt token for user and admin
exports.redirect_login = function (req, res) {
    //req.session.destroy();
    var msg = req.session.error;
    req.session.destroy();
    res.render("admin_login", { msg: msg });
}

exports.redirect_504 = function (req, res) {
    res.render("504");
}




/// send notification
exports.send_notification=function(data, response) {
    console.log("data", data)
    
    let firebase_key ="AAAAjib-3fA:APA91bGcXBe6HBl61YYdoVKqFsSin_X5d9A2V5rNi0jSLU-3rnpdTTf9OoeXxpSZ-tnh33kSEFq-0fgoMsCdorSromVh2xQBKiNYvE9FBM5uS5zrOZJdFxcvw67JIxc3bHXZqqa7ln6e"

    console.log('api', firebase_key)
   
    const  device_token=data.token
    const title=data.title
    const message=data.message
    var message1 = new node_gcm.Message();

    message1.addData('title', title);
    message1.addData('message',message);
 
    
    var sender = new node_gcm.Sender(firebase_key);
    sender.sendNoRetry(message1, { registrationTokens: [device_token] }, function (err, response) {
        if (err) console.log('err', err);
        else console.log('res', response);
})
// response.send({
//     success:true
// })
}

exports = systen_urls = [
    "home",
    "admin_list",
    "user_list",
    "student_list",
    "class_list",
    "sreport_list",
    "subject_list",
    "exam_list",
    "fee_list",
    "feereport_list",
    "message_list",
    "quiz_list",
    "resultQuiz_list",
    "typequiz_list"    
]

