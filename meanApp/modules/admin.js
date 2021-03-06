/**
 * Created by Younes on 26/03/2016.
 */
var User = require("../models/user.js").User;
var Shop = require("../models/shop.js").Shop;
var Admin = require("../models/admin/admin.js").Admin;
var UserModule    = require('./user');

var logger = require('winston');

module.exports = {

    getUsers: function(req, res) {
        User.find({state: 0}, function(err, users) {
            if(err){
                console.log(err);
                logger.log('error', err);
                 res.json({success: false, message:error});
            }
            var i = 0;
            getUsers(users, i);
        });

        function getUsers(users, i){
            if(i < users.length){
                var user = users[i];

                if(user.director != user._id){
                    User.findOne({_id: user.director}, function(err, director) {
                        if(err){
                            console.log(err);
                            logger.log('error', err);
                             res.json({success: false, message:error});
                        }
                         users[i].director = JSON.stringify(director);
                        Shop.find({
                            '_id': { $in: user.associateShop}
                        }, function(err, shops){
                            users[i].associateShop = shops;
                            i++;
                            getUsers(users, i);
                        });

                    });
                }else{
                    Shop.find({
                        '_id': { $in: user.associateShop}
                    }, function(err, shops){
                        users[i].associateShop = shops;
                        i++;
                        getUsers(users, i);
                    });
                }

            }else{
                res.json({success: true, message:"User List Find with success", data: users});
            }
        }
    },

    setAdmin: function(req, res){
        var crypted  = UserModule.generatePassword(req.body.admin.password);
        req.body.admin.password = crypted.password;
        req.body.admin.hash = crypted.hash;
        req.body.admin.role = 1;
        var admin = new Admin(req.body.admin);
        Admin.findOne({
            mail: req.body.admin.mail
        }, function(err, user) {
            if(err){
                console.log(err);
                logger.log('error', err);
                res.json({success: false, message:err});
            }
            if (!user) {
                admin.save( function(error) {
                    if(error){
                        console.log(error);
                        logger.log('error', error);
                        res.json({success: false, message:error});
                    }
                    delete req.body.admin.password;
                    var data = req.body.admin;
                    res.json({success: true, message:"Subscribe success", data: data});
                });
            } else if (user) {
                res.json({ success: false, message: 'Subscribe failed. User Already exist.' });
            }
        });
    },

    updateAdmin: function(req, res){

        var admin = req.body.admin;


        Admin.findOneAndUpdate({_id: admin._id}, {$set: admin }, { 'new': true },  function(error, data){
            if(error){
                console.log(error);
                logger.log('error', error);
                res.json({ success: false, message: "Subscribe Failed", data:error});
            }else{
                res.json({ success: true, message: "Update Success"});
            }

        });

    },


    getAdmin: function(req, res){
        var id = req.body.admin;

        Admin.findOne({_id: id}, function(error, admin){
            if(error){
                console.log(error);
                logger.log('error', error);
                res.json({ success: false, message: "Admin not Found", data:error});
            }
            res.json({success: true, message: "Admin found", data:admin})
        })
    },
};
