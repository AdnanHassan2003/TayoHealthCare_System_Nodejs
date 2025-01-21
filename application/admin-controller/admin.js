var Admin = require('mongoose').model('admin')
var User = require('mongoose').model('users')
var Doctor = require('mongoose').model('doctor')
var Setting = require('mongoose').model('setting')
var Menu = require('mongoose').model('menu')
const Bcrypt = require('bcryptjs');
var moment = require('moment-timezone');
var Excel = require('exceljs');
var fs = require('fs');
var node_gcm = require("node-gcm")
var crypto = require('crypto');
var Utils = require('../controller/utils');
var passwordValidator = require('password-validator');
const { body } = require('express-validator');
const { filter, flatMap, has, add } = require('lodash');
const { title } = require('process')
const session = require('express-session')
const { response } = require('express')
const { type } = require('os')
const setting = require('../model/setting')
const { each } = require('async')
const { utils } = require('xlsx')
const { group, Console } = require('console')
// const { utils } = require('xlsx/types')
var ObjectId = require('mongodb').ObjectID;







exports.admin = function (req, res) {
    Utils.check_admin_token(req.session.admin, function (response) {
        if (response.success) {

            Admin.aggregate([

                {$group:{_id:null,
                    Total_Admin:{$sum:1}}},
                    
                    
                  {$project:{
                      _id:0,
                      Total_Admin:1
                      
                      
                      }}
                ]).then((totaladmin) => {
                            res.render('home', {
                                Totaladmin: totaladmin,
                                url_data: req.session.menu_array,
                                Totalsudents: 0,
                                Totalcass: 0,
                                Totalpayment: 0

                            })
            })

        } else {
            Utils.redirect_login(req, res);
        }
    });
}





///// check admin credentiale /////
exports.check_admin_login = function (req, res) {
    Utils.check_admin_token(req.session.admin, function (response) {
        var hash = crypto.createHash('md5').update(req.body.password).digest('hex');
        if (!response.success) {
            var name = req.body.email
            // Encrypt
            var phone = {};
            phone['phone'] = name;
            var email = {};
            email['email'] = name;
            var user_name = {};
            user_name['user_name'] = name;
            var password = {};
            password['password'] = hash;
           // console.log("hash", hash)
            Admin.findOne({ $and: [{ $or: [phone, email, user_name] }, { status: 1 }] }).then((admin) => {
              
                if (!admin) {
                    req.session.error = process.env.user_not_registered;
                    res.redirect("/admin")
                } else {
                    if (!admin.comparePassword((req.body.password).toString())) {
                      //!admin.comparePassword((req.body.password).toString())
                      //admin.password != hash
                        var login_attempts = admin.login_attempts + 1;
                        Admin.updateOne({ _id: admin._id }, { login_attempt_time: new Date(Date.now()), login_attempts: login_attempts }, { useFindAndModify: false }).then((Admin) => {
                        });
                        req.session.error = process.env.email_pass_invalid;
                        res.redirect("/admin")
                    } else {

                        var token = Utils.tokenGenerator(36);
                        var admin_data = {
                            usertype: admin.type,
                            name: admin.name,
                            username: admin.user_name,
                            user_id: admin._id,
                            userphone: admin.phone,
                            menu_array: admin.allowed_urls,
                            token: token,
                            picture: admin.picture
                        }
                        req.session.admin = admin_data;
                        Admin.updateOne({ _id: admin._id }, { token: token, last_login: new Date(Date.now()), login_attempts: 0 }, { useFindAndModify: false }).then((Adminn) => {

                            Admin.aggregate([

                                {$group:{_id:null,
                                    Total_Admin:{$sum:1}}},
                                     
                                  {$project:{
                                      _id:0,
                                      Total_Admin:1
                                       
                                      }}
                                ]).then((totaladmin) => {
                                              
                                            var match = {
                                                $match: {
                                                    parent_menu: null,
                                                },
                                            };
                                            var lookup = {
                                                $lookup: {
                                                    from: "menus",
                                                    let: { menu_id: "$_id" },
                                                    pipeline: [{
                                                        $match: {
                                                            $expr: {
                                                                $eq: [
                                                                    "$parent_menu",
                                                                    "$$menu_id",
                                                                ],
                                                            },
                                                            status: 1
                                                        },
                                                    },],
                                                    as: "menu_details",
                                                },
                                            };
                
                                            if (admin.type != 0) {
                                                const allowed_urls = admin.allowed_urls.map((url) => ObjectId(url));
                                                console.log("urls",allowed_urls)
                                                lookup = {
                                                    $lookup: {
                                                        from: "menus",
                                                        let: { parent_menu: "$_id" },
                                                        pipeline: [{
                                                            $match: {
                                                                $expr: {
                                                                    $and: [{
                                                                        $eq: [
                                                                            "$parent_menu",
                                                                            "$$parent_menu",
                                                                        ],
                                                                    },
                                                                    { $in: ["$_id", allowed_urls] },
                                                                    ],
                                                                },
                                                                status: 1
                                                            },
                                                        },],
                                                        as: "menu_details",
                                                    },
                                                };
                                            }
                                            var project = {
                                                $project: {
                                                    title: 1,
                                                    icon: 1,
                                                    status: 1,
                                                    "menu_details.title": 1,
                                                    "menu_details.icon": 1,
                                                    "menu_details.url": 1,
                                                },
                                            };
                                            Menu.aggregate([ match,lookup, project]).then((menu_array) => {
                                                console.log("menu_array",menu_array)
                                                req.session.menu_array = menu_array;

                                            res.render('home', {

                                                url_data: req.session.menu_array,
                                                Totaladmin: totaladmin,
                                                Totalsudents: 0,
                                                Totalcass: 0,
                                                Totalpayment: 0
                                      
                                })
                                })
                            })
                        })
                    }
                }
            });
        } else {
            res.render('home')
        }
    });
};





exports.list_admin = function (req, res) {
    Utils.check_admin_token(req.session.admin, function (response) {
        if (response.success) {
            if (req.body.search_item == undefined) {
                search_item = "sequence_id";
                search_value = req.body.search_value;
                start_date = "";
                end_date = "";
            } else {
                search_item = req.body.search_item;
                search_value = req.body.search_value;
                start_date = req.body.start_date;
                end_date = req.body.end_date;
            }
            if (req.body.start_date == undefined && req.body.end_date == undefined) {
                var now = new Date(Date.now());
                var date = now.addHours();
                start_date = date.setHours(0, 0, 0, 0);   // Set hours, minutes and seconds
                start_date = new Date(start_date)

                end_date = date.setHours(23, 59, 59, 59);   // Set hours, minutes and seconds
                end_date = new Date(end_date)
            } else if (req.body.start_date == "" || req.body.end_date == "") {
                var now = new Date(Date.now());
                var date = now.addHours();
                start_date = date.setHours(0, 0, 0, 0);   // Set hours, minutes and seconds
                start_date = new Date(start_date)

                end_date = date.setHours(23, 59, 59, 59);   // Set hours, minutes and seconds
                end_date = new Date(end_date)
            } else {
                var sdate = new Date(req.body.start_date);
                start_date = sdate.setHours(0, 0, 0, 0);   // Set hours, minutes and seconds
                start_date = new Date(start_date)

                var edate = new Date(req.body.end_date);
                end_date = edate.setHours(23, 59, 59, 59);   // Set hours, minutes and seconds
                end_date = new Date(end_date)
            }

            // var date_filter = { "$match": { "create_date": { $gte: start_date, $lte: end_date } } };

            f_start_date = moment(start_date).format("YYYY-MM-DD");
            f_end_date = moment(end_date).format("YYYY-MM-DD");

            //order by sequecy number
            var sort = { "$sort": {} };
            sort["$sort"]["_id"] = parseInt(-1);

            //query search
            var query_search = { "$match": {} };

            if (search_item == 'email') {
                if (search_value != undefined && search_value != '') {
                    search_value = search_value.replace(/^\s+|\s+$/g, '');
                    search_value = search_value.replace(/ +(?= )/g, '');
                    query_search["$match"][search_item] = { $regex: new RegExp(search_value, 'i') };
                }
            } else if (search_item == 'phone') {
                if (search_value != undefined && search_value != '') {
                    search_value = search_value.replace(/\D/g, '');
                    query_search["$match"][search_item] = { $regex: new RegExp(search_value, 'i') };
                }
            } else {
                if (search_value != undefined && search_value != '') {
                    query_search["$match"][search_item] = search_value;
                }
            }

            //  // Add date filter
            //  query_search["$match"]["create_date"] = { $gte: start_date, $lte: end_date };

            Admin.aggregate([
                query_search,
                sort
            ]).then((admin_array) => {
                console.log("lists", admin_array)
                res.render('admin_list', {
                    url_data: req.session.menu_array,
                    admins: admin_array,
                    msg: req.session.error,
                    moment: moment,
                    admin_type: req.session.admin.usertype
                });
            });
        } else {

            Utils.redirect_login(req, res);
        }
    });
};

 

// Handle menu_list
exports.menu_list = function (req, res) {
    Utils.check_admin_token(req.session.admin, function (response) {
        if (response.success) {
            
            var menu_lookup = {
                $lookup: {
                    from: 'menus',
                    localField: 'parent_menu',
                    foreignField: '_id',
                    as: 'menu_details'
                }
            }

            var unwind_menu = {
                $unwind: {
                    path: "$menu_details",
                    preserveNullAndEmptyArrays: true
                }
            }  
             var project = {
                $project: {
                    _id: 1,
                    sequence_id: 1,
                    title: 1,
                    type: 1,
                    status: 1,
                    icon: 1,
                    url: 1,
                    create_date: 1,
                    "menu_details.title": 1,
                    "menu_details.status": 1
                }
            }

            Menu.aggregate([
                menu_lookup,
                unwind_menu,
                project
            ]).then((menu) => {
                res.render('menu_list', {
                    url_data: req.session.menu_array,
                    menu: menu,
                    msg: req.session.error,
                    moment: moment,
                    admin_type: req.session.admin.usertype
                });
            })
        } else {
           
            Utils.redirect_login(req, res);
        }
    });
};



exports.user_list = function (req, res) {
    Utils.check_admin_token(req.session.admin, function (response) {
        if (response.success) {
            User.find({}).then((user) => {
                res.render('user_list', {
                    detail: user,
                    msg: req.session.error,
                    moment: moment,
                    admin_type: req.session.admin.usertype
                });
            })
        } else {

            Utils.redirect_login(req, res);
        }
    })
}




exports.doctor_list = function (req, res) {
    Utils.check_admin_token(req.session.admin, function (response) {
        if (response.success) {
            if (req.body.search_item == undefined) {
                search_item = "sequence_id";
                search_value = req.body.search_value;
                start_date = "";
                end_date = "";
            } else {
                search_item = req.body.search_item;
                search_value = req.body.search_value;
                start_date = req.body.start_date;
                end_date = req.body.end_date;
            }
            if (req.body.start_date == undefined && req.body.end_date == undefined) {
                var now = new Date(Date.now());
                var date = now.addHours();
                start_date = date.setHours(0, 0, 0, 0);   // Set hours, minutes and seconds
                start_date = new Date(start_date)

                end_date = date.setHours(23, 59, 59, 59);   // Set hours, minutes and seconds
                end_date = new Date(end_date)
            } else if (req.body.start_date == "" || req.body.end_date == "") {
                var now = new Date(Date.now());
                var date = now.addHours();
                start_date = date.setHours(0, 0, 0, 0);   // Set hours, minutes and seconds
                start_date = new Date(start_date)

                end_date = date.setHours(23, 59, 59, 59);   // Set hours, minutes and seconds
                end_date = new Date(end_date)
            } else {
                var sdate = new Date(req.body.start_date);
                start_date = sdate.setHours(0, 0, 0, 0);   // Set hours, minutes and seconds
                start_date = new Date(start_date)

                var edate = new Date(req.body.end_date);
                end_date = edate.setHours(23, 59, 59, 59);   // Set hours, minutes and seconds
                end_date = new Date(end_date)
            }

            //var date_filter = { "$match": { "create_date": { $gte: start_date, $lte: end_date } } };

            f_start_date = moment(start_date).format("YYYY-MM-DD");
            f_end_date = moment(end_date).format("YYYY-MM-DD");

            //order by sequecy number
            var sort = { "$sort": {} };
            sort["$sort"]["_id"] = parseInt(-1);

            //query search
            var query_search = { "$match": {} };

            if (search_item == 'email') {
                if (search_value != undefined && search_value != '') {
                    search_value = search_value.replace(/^\s+|\s+$/g, '');
                    search_value = search_value.replace(/ +(?= )/g, '');
                    query_search["$match"][search_item] = { $regex: new RegExp(search_value, 'i') };
                }
            } else if (search_item == 'phone') {
                if (search_value != undefined && search_value != '') {
                    search_value = search_value.replace(/\D/g, '');
                    query_search["$match"][search_item] = { $regex: new RegExp(search_value, 'i') };
                }
            } else {
                if (search_value != undefined && search_value != '') {
                    query_search["$match"][search_item] = search_value;
                }
            }
            Doctor.aggregate([
                query_search,
                sort
            ]).then((doctor)=>{
                res.render('doctor_list', {
                    url_data: req.session.menu_array,
                    detail: doctor,
                    msg: req.session.error,
                    moment: moment,
                    admin_type: req.session.admin.usertype
                });
            })
        } else {

            Utils.redirect_login(req, res);
        }
    })
}




//---------------------------------------------------------------------------------------------------




exports.add_admin = function (req, res) {
    Utils.check_admin_token(req.session.admin, function (response) {
        if (response.success) {
            Menu.find({type:1}).then((menu)=>{

       
            res.render("add_admin", { menu: menu, msg: req.session.error })
        })
        } else {
            Utils.redirect_login(req, res);
        }
    });
};



exports.add_menu = function (req, res) {
    Utils.check_admin_token(req.session.admin, function (response) {
        if (response.success) {
            
            Menu.find({type:0 }).then((menu) => {
                res.render('add_menu', {
                    menu: menu,
                    msg: req.session.error,
                    moment: moment,
                    admin_type: req.session.admin.usertype
                });
            })
        } else {
           
            Utils.redirect_login(req, res);
        }
    });
};




/// ADD USER
exports.add_user = function (req, res) {
    Utils.check_admin_token(req.session.admin, function (response) {
        if (response.success) {
            res.render("add_user",
                {
                    systen_urls: systen_urls, msg: req.session.error
                })
        } else {
            Utils.redirect_login(req, res);
        }
    });
};




/// Add a doctor
exports.add_doctor = function (req, res) {
    Utils.check_admin_token(req.session.admin, function (response) {
        if (response.success) {
            res.render("add_doctor",
                {
                    systen_urls: systen_urls, msg: req.session.error
                })
        } else {
            Utils.redirect_login(req, res);
        }
    });
};


//---------------------------------------------------------------------------------------------------



// Handle create admin actions
exports.save_admin_details = function (req, res) {
    console.log("req.body", req.files)
    Utils.check_admin_token(req.session.admin, function (response) {
        if (response.success) {
            Admin.findOne({ "phone": req.body.phone }).then((admin) => {

                if (admin) {
                    req.session.error = "Sorry, There is an admin with this phone, please check the phone";
                    Utils.redirect_login(req, res);
                } else {
                    var image_name = ""
                    var url = "";
                    var liner = "";
                    // Create a schema
                    var schema = new passwordValidator();
                    schema.is().min(8)                                 // Minimum length 8
                        .is().max(30)                                  // Maximum length 100
                        .has().lowercase()                             // Must have lowercase letters
                        .has().digits()                                // Must have at least 2 digits
                        .has().not().spaces();                         // Blacklist these values
                    // Validate against a password string
                    if (schema.validate(req.body.password)) {
                        var profile_file = req.files;
                        var name = req.body.name
                        var admin = new Admin({
                            name: name,
                            sequence_id: Utils.get_unique_id(),
                            email: req.body.email,
                            phone: req.body.phone,
                            type:req.body.type,
                            status: 1,
                            allowed_urls:req.body.allowed_urls,
                            extra_detail: req.body.extra_detail,
                            picture: "",
                            password: Bcrypt.hashSync(req.body.password, 10)
                        });
                        if (profile_file != undefined && profile_file.length > 0) {
                            // var image_name = admin._id + Utils.tokenGenerator(4);
                            // var url = Utils.getImageFolderPath(1) + image_name + '.jpg';
                            // Utils.saveImageIntoFolder(req.files[0].path, image_name + '.jpg', 1);


                            /// inser images
                            image_name = Utils.tokenGenerator(29) + '.jpg';
                            //v
                            url = "./uploads/admin_profile/" + image_name;
                            liner = "admin_profile/" + image_name;
                            // console.log("linear", liner)
                            // console.log("url", url)
                            fs.readFile(req.files[0].path, function (err, data) {
                                fs.writeFile(url, data, 'binary', function (err) { });
                                fs.unlink(req.files[0].path, function (err, file) {

                                });
                            });

                            admin.picture = liner;
                        }
                        admin.save().then((admin) => {
                            req.session.error = "Congrates, Admin was created successfully.........";
                            res.redirect("/admin_list");
                        });
                    } else {
                        req.session.error = "Please use strong password that contains latrers and Digitals";
                        res.redirect("/add_admin")
                    }
                }
            })
        } else {
            Utils.redirect_login(req, res);
        }
    });
};



exports.save_menu=function(req,res){
    console.log("body", req.body)
    Menu.findOne({
        "title": req.body.title
    }).then((menu) => {
        if (menu) {
            req.session.msg = "Sorry, There is an menu with this title, please check the title";
            res.redirect("/add_menu");
        } else {
            if (req.body.type == 0) {
                req.body.parent_menu = null;
            }
            var menu = new Menu({
                title: req.body.title,
                url: req.body.url,
                icon: req.body.icon,
                status: req.body.status,
                parent_menu: req.body.parent_menu,
                type: req.body.type
            });
            menu.save().then((menu) => {
                req.session.error = "Congrates, menu was created successfully.........";
                res.redirect("/menu_list");
            }, (err) => {
                console.error(err);
                res.redirect("/add_menu")
            });
        }
    })
}


///  handele create user list
exports.save_user_data = function (req, res) {
    Utils.check_admin_token(req.session.admin, function (response) {
        console.log("body", req.body)
        if (response.success) {
            User.findOne({ "phone": req.body.phone }).then((user) => {
                console.log("user", user)
                if (user) {
                    req.session.error = "Sorry, There is an admin with this phone, please check the phone";
                    Utils.redirect_login(req, res);
                } else {
                    // Create a schema
                    var schema = new passwordValidator();
                    schema.is().min(8)                                 // Minimum length 8
                        .is().max(30)                                  // Maximum length 100
                        .has().lowercase()                             // Must have lowercase letters
                        .has().digits()                                // Must have at least 2 digits
                        .has().not().spaces();                         // Blacklist these values
                    // Validate against a password string
                    if (schema.validate(req.body.password)) {
                        var profile_file = req.files;
                        var name = req.body.name
                        var user = new User({
                            name: name,
                            sequence_id: Utils.get_unique_id(),
                            email: req.body.email,
                            phone: req.body.phone,
                            status: 1,
                            extra_detail: req.body.extra_detail,
                            picture: "",
                            password: Bcrypt.hashSync(req.body.password, 10)
                        });
                        if (profile_file != undefined && profile_file.length > 0) {
                            // var image_name = user._id + Utils.tokenGenerator(4);
                            // var url = Utils.getImageFolderPath(1) + image_name + '.jpg';
                            // Utils.saveImageIntoFolder(req.files[0].path, image_name + '.jpg', 1);


                            /// inser images
                            image_name = Utils.tokenGenerator(29) + '.jpg';
                            //v
                            url = "./uploads/admin_profile/" + image_name;
                            liner = "admin_profile/" + image_name;
                            // console.log("linear", liner)
                            // console.log("url", url)
                            fs.readFile(req.files[0].path, function (err, data) {
                                fs.writeFile(url, data, 'binary', function (err) { });
                                fs.unlink(req.files[0].path, function (err, file) {

                                });
                            });

                            user.picture = liner;
                        }
                        user.save().then((admin) => {
                            req.session.error = "Congrates, Admin was created successfully.........";
                            res.redirect("/user_list");
                        });
                    } else {
                        req.session.error = "Please use strong password that contains latrers and Digitals";
                        res.redirect("/add_user")
                    }
                }
            })
        } else {
            Utils.redirect_login(req, res);
        }
    });
};






exports.save_doctor_data = function (req, res) {
    Utils.check_admin_token(req.session.admin, function (response) {
        console.log("body", req.body)
        if (response.success) {
            Doctor.findOne({ "phone": req.body.phone }).then((doctor) => {
                console.log("user", doctor)
                if (doctor) {
                    req.session.error = "Sorry, There is an admin with this phone, please check the phone";
                    Utils.redirect_login(req, res);
                } else {
                    // Create a schema
                    var schema = new passwordValidator();
                    schema.is().min(8)                                 // Minimum length 8
                        .is().max(30)                                  // Maximum length 100
                        .has().lowercase()                             // Must have lowercase letters
                        .has().digits()                                // Must have at least 2 digits
                        .has().not().spaces();                         // Blacklist these values
                    // Validate against a password string
                    if (schema.validate(req.body.password)) {
                        var profile_file = req.files;
                        var name = req.body.name
                        var doctor = new Doctor({
                            name: name,
                            sequence_id: Utils.get_unique_id(),
                            email: req.body.email,
                            consultation_fee:req.body.consultation_fee,
                            experience_years:req.body.experience_years,
                            license_number:Utils.get_unique_id(),
                            phone: req.body.phone,
                            status: 1,
                            extra_detail: req.body.extra_detail,
                            picture: "",
                            user_name: req.body.user_name,
                            PassWord: req.body.password,
                            password: Bcrypt.hashSync(req.body.password, 10)
                        });
                        if (profile_file != undefined && profile_file.length > 0) {
                            image_name = Utils.tokenGenerator(29) + '.jpg';
                            url = "./uploads/admin_profile/" + image_name;
                            liner = "admin_profile/" + image_name;

                            fs.readFile(req.files[0].path, function (err, data) {
                                fs.writeFile(url, data, 'binary', function (err) { });
                                fs.unlink(req.files[0].path, function (err, file) {

                                });
                            });

                            doctor.picture = liner;
                        }
                        doctor.save().then((admin) => {
                            req.session.error = "Congrates, Admin was created successfully.........";
                            res.redirect("/doctor_list");
                        });
                    } else {
                        req.session.error = "Please use strong password that contains latrers and Digitals";
                        res.redirect("/add_doctor")
                    }
                }
            })
        } else {
            Utils.redirect_login(req, res);
        }
    });

};

//---------------------------------------------------------------------------------------------------



// Handle update admin info
exports.edit_admin = function (req, res) {
    Utils.check_admin_token(req.session.admin, function (response) {
        if (response.success) {
            Admin.findOne({ _id: req.body.admin_id }, { password: 0 }).then((admin) => {
                if (admin) {
                    // console.log(admin)
                    res.render("add_admin", { admin_data: admin, systen_urls: systen_urls })
                } else {
                    res.redirect("/admin_list")
                }
            });
        } else {
            Utils.redirect_login(req, res);
        }
    });
};



//// handle edit user info
exports.edit_user = function (req, res) {
    Utils.check_admin_token(req.session.admin, function (response) {
        if (response.success) {
            User.findOne({ _id: req.body.user_id }, { password: 0 }).then((user) => {
                if (user) {
                    // console.log(admin)
                    res.render("add_user", { user_data: user, systen_urls: systen_urls })
                } else {
                    res.redirect("/user_list")
                }
            });
        } else {
            Utils.redirect_login(req, res);
        }
    });
};




exports.edit_doctor = function (req, res) {
    Utils.check_admin_token(req.session.admin, function (response) {
        if (response.success) {
            Doctor.findOne({ _id: req.body.doctor_id }, { password: 0 }).then((doctor) => {
                if (doctor) {
                    // console.log(admin)
                    res.render("add_doctor", { doctor_data: doctor, systen_urls: systen_urls })
                } else {
                    res.redirect("/doctor_list")
                }
            });
        } else {
            Utils.redirect_login(req, res);
        }
    });
};




//---------------------------------------------------------------------------------------------------


//// handle edit typequiz info







// Handle update admin actions
exports.update_admin_details = function (req, res) {
    Utils.check_admin_token(req.session.admin, function (response) {
        if (response.success) {
            var profile_file = req.files;
            req.body.name = req.body.name.split(' ').map(w => w[0].toUpperCase() + w.substr(1).toLowerCase()).join(' ');
            if (profile_file == '' || profile_file == 'undefined') {
                Admin.findByIdAndUpdate(req.body.admin_id, req.body, { useFindAndModify: false }).then((data) => {
                    if (data._id.equals(req.session.admin.user_id)) {
                        Utils.redirect_login(req, res);
                    } else {
                        res.redirect("/admin_list");
                    }
                }, (err) => {
                    res.redirect("/admin_list");
                });
            } else {
                Admin.findById(req.body.admin_id).then((admin) => {
                    if (admin.picture) {
                        Utils.deleteImageFromFolderTosaveNewOne(admin.picture, 1);
                    }
                    var image_name = admin._id + Utils.tokenGenerator(4);
                    var url = Utils.getImageFolderPath(1) + image_name + '.jpg';
                    Utils.saveImageIntoFolder(req.files[0].path, image_name + '.jpg', 1);
                            req.body.picture = url;
                    // req.body.passport_expire_date = moment(req.body.passport_expire_date).format("MMM Do YYYY");
                    Admin.findByIdAndUpdate(req.body.admin_id, req.body, { useFindAndModify: false }).then((data) => {
                        if (data._id.equals(req.session.admin.user_id)) {
                            Utils.redirect_login(req, res);
                        } else {
                            res.redirect("/admin_list");
                        }
                    }, (err) => {
                        res.redirect("/admin_list");
                    });
                });
            }
        } else {
            Utils.redirect_login(req, res);
        }
    });
};



/// handle update user info
exports.update_user_detail = function (req, res) {
    Utils.check_admin_token(req.session.admin, function (response) {
        if (response.success) {
            var profile_file = req.files;
            req.body.name = req.body.name.split(' ').map(w => w[0].toUpperCase() + w.substr(1).toLowerCase()).join(' ');
            if (profile_file == '' || profile_file == 'undefined') {
                User.findByIdAndUpdate(req.body.user_id, req.body, { useFindAndModify: false }).then((data) => {
                    if (data._id.equals(req.session.admin.user_id)) {
                        Utils.redirect_login(req, res);
                    } else {
                        res.redirect("/user_list");
                    }
                }, (err) => {
                    res.redirect("/user_list");
                });
            } else {
                User.findById(req.body.user_id).then((user) => {
                    if (user.picture) {
                        Utils.deleteImageFromFolderTosaveNewOne(user.picture, 1);
                    }
                    var image_name = user._id + Utils.tokenGenerator(4);
                    var url = Utils.getImageFolderPath(1) + image_name + '.jpg';
                    Utils.saveImageIntoFolder(req.files[0].path, image_name + '.jpg', 1);
                    req.body.picture = url;
                    // req.body.passport_expire_date = moment(req.body.passport_expire_date).format("MMM Do YYYY");
                    User.findByIdAndUpdate(req.body.user_id, req.body, { useFindAndModify: false }).then((data) => {
                        if (data._id.equals(req.session.admin.user_id)) {
                            Utils.redirect_login(req, res);
                        } else {
                            res.redirect("/user_list");
                        }
                    }, (err) => {
                        res.redirect("/user_list");
                    });
                });
            }
        } else {
            Utils.redirect_login(req, res);
        }
    });
};




exports.update_doctor_detail = function (req, res) {
    Utils.check_admin_token(req.session.admin, function (response) {
        if (response.success) {
            var profile_file = req.files;
            req.body.name = req.body.name.split(' ').map(w => w[0].toUpperCase() + w.substr(1).toLowerCase()).join(' ');
            if (profile_file == '' || profile_file == 'undefined') {
                Doctor.findByIdAndUpdate(req.body.doctor_id, req.body, { useFindAndModify: false }).then((data) => {
                    if (data._id.equals(req.session.admin.doctor_id)) {
                        Utils.redirect_login(req, res);
                    } else {
                        res.redirect("/doctor_list");
                    }
                }, (err) => {
                    res.redirect("/doctor_list");
                });
            } else {
                Doctor.findById(req.body.doctor_id).then((user) => {
                    if (user.picture) {
                        Utils.deleteImageFromFolderTosaveNewOne(user.picture, 1);
                    }
                    var image_name = user._id + Utils.tokenGenerator(4);
                    var url = Utils.getImageFolderPath(1) + image_name + '.jpg';
                    Utils.saveImageIntoFolder(req.files[0].path, image_name + '.jpg', 1);
                    req.body.picture = url;
                    // req.body.passport_expire_date = moment(req.body.passport_expire_date).format("MMM Do YYYY");
                    Doctor.findByIdAndUpdate(req.body.doctor_id, req.body, { useFindAndModify: false }).then((data) => {
                        if (data._id.equals(req.session.admin.doctor_id)) {
                            Utils.redirect_login(req, res);
                        } else {
                            res.redirect("/doctor_list");
                        }
                    }, (err) => {
                        res.redirect("/doctor_list");
                    });
                });
            }
        } else {
            Utils.redirect_login(req, res);
        }
    });
};


//---------------------------------------------------------------------------------------------------


// Handle delete admin
exports.delete_admin = function (req, res) {
    Utils.check_admin_token(req.session.admin, function (response) {
        if (response.success) {
            Admin.findById(req.body.admin_id).then((admin) => {
                if (admin) {
                    Admin.deleteOne({ _id: req.body.admin_id }).then((admin) => {
                        res.json({
                            status: "success",
                            message: 'Admin deleted'
                        });
                    });
                } else {
                    res.json({
                        status: "error",
                        message: "Admin not found",
                    });
                }
            })
        } else {
            Utils.redirect_login(req, res);
        }
    });
};


////  delete user function
exports.delete_user = function (req, res) {
    Utils.check_admin_token(req.session.admin, function (response) {
        if (response.success) {
            User.deleteOne({ _id: req.body.user_id }).then((user) => {
                res.redirect("/user_list")
            });
        } else {
            Utils.redirect_login(req, res);
        }
    });
};



////  delete user function
exports.delete_doctor = function (req, res) {
    Utils.check_admin_token(req.session.admin, function (response) {
        if (response.success) {
            Doctor.deleteOne({ _id: req.body.doctor_id }).then((user) => {
                res.redirect("/doctor_list")
            });
        } else {
            Utils.redirect_login(req, res);
        }
    });
};



//---------------------------------------------------------------------------------------------------

// Handle view admin logout
exports.log_out = function (req, res) {
    Utils.check_admin_token(req.session.admin, function (response) {
        if (response.success) {
            req.session.destroy(function (err, data) {
                if (err) {
                    //console.log(err);
                } else {
                    //console.log('after'+req.session);
                    res.redirect('/');
                }
            });
        } else {
            Utils.redirect_login(req, res);
        }
    });
};

// Handle view admin excell
exports.genetare_admin_excel = function (req, res) {
    Utils.check_admin_token(req.session.admin, function (response) {
        if (response.success) {
            if (req.body.search_item != "undefined") {
                search_item = req.body.search_item;
                start_date = req.body.start_date;
                end_date = req.body.end_date;
            } else {
                search_item = "sequence_id";
                start_date = "";
                end_date = "";
            }
            Admin.find({}).then((admins) => {
                if (admins.length > 0) {
                    generate_excel_declined_list(req, res, admins);
                }
            });
        } else {
            Utils.redirect_login(req, res);
        }
    });
};

async function generate_excel_declined_list(req, res, array) {
    var now = new Date(Date.now());
    var date = now.addHours();
    var time = date.getTime()

    const save_path = './data/excell/';
    const file_name = time + '_admin.xlsx';
    const options = {
        filename: save_path + file_name,
        useStyles: true,
        useSharedStrings: true
    };

    var workbook = new Excel.stream.xlsx.WorkbookWriter(options);
    var sheet = workbook.addWorksheet('sheet1');

    sheet.columns = [
        { header: 'ID', key: 'sequence_id' },
        { header: 'Name', key: 'name' },
        { header: 'Phone', key: 'phone' },
        { header: 'Email', key: 'email' },
        { header: 'Status', key: 'status' },
        { header: 'Created Date', key: 'created_date' }
    ];

    array.forEach(function (data, index) {

        let rows = {
            sequence_id: data.sequence_id,
            name: data.name,
            phone: data.phone,
            email: data.email,
            status: data.status,
            created_date: moment(data.created_date).format("hh:mm:a") + ' ' + moment(data.created_date).format("DD MMM YYYY")
        }


        sheet.addRow(rows).commit();

        if (index == array.length - 1) {

            workbook.commit().then(
                function () {
                    //console.log('excel file created');
                    let url = "/excell/" + file_name;
                    res.json(url);
                    setTimeout(function () {
                        fs.unlink(save_path + file_name, function (err, file) { });
                    }, 10000);
                },
                function (err) {
                    res.status(500).json({ status: 500, message: err });
                }
            );
        }

    })
}

// Handle update admin actions
exports.get_admin_session = function (req, res) {
    Utils.check_admin_token(req.session.admin, function (response) {
        if (response.success) {
            res.json({ success: true, admin: req.session.admin })
        } else {
            res.json({ success: false });
        }
    });
};

// Handle admn_change_admin_pass
exports.admn_change_admin_pass = function (req, res) {
    Utils.check_admin_token(req.session.admin, function (response) {
        if (response.success) {
            Admin.findOne({ _id: req.body.admin_id }).then((admin_data) => {
                if (admin_data) {
                    // Create a schema
                    var schema = new passwordValidator();
                    schema.is().min(8)                                 // Minimum length 8
                        .is().max(30)                                  // Maximum length 100
                        .has().lowercase()                             // Must have lowercase letters
                        .has().digits()                                // Must have at least 2 digits
                        .has().not().spaces();                         // Blacklist these values
                    // Validate against a password string
                    if (schema.validate(req.body.new_pass)) {
                        Admin.findByIdAndUpdate({ _id: admin_data._id }, { password: Bcrypt.hashSync((req.body.new_pass).trim(), 10) }, { useFindAndModify: false }).then((admin) => {
                            res.json({ success: true, message: "Updated Successfully" });
                        })
                    } else {
                        res.json({ success: false, message: "Please use strong password that contains latrers and Digitals" });
                    }
                } else {
                    res.json({ success: false, message: "User info not found" });
                }
            })
        } else {
            res.json({ success: false, message: "Session failed please login" });
        }
    });
};








