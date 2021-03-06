/**
 * Created by Younes on 10/03/2016.
 */
var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
    state:{
        type: Number,
        required : false
    },
    code:{
        type: Number,
        required : true,
        index: true
    },
    role:{
        type: Number,
        required : false
    },
    type:{
        type: Object,
        required : false
    },
    lastName:{
        type: String,
        required : true
    },
    firstName:{
        type: String,
        required : true
    },
    phone:{
        type: String,
        required : true
    },
    mail:{
        type: String,
        index: true,
        required : true
    },
    director: {
        type: String,
        required : false
    },
    associateShop: {
        type: Array,
        required : false
    },
    averageLens: {
        type: Number,
        required : false
    },
    providerLens: {
        type: String,
        required : false
    },
    averageGlasses: {
        type: Number,
        required : false
    },
    providerGlasses: {
        type: String,
        required : false
    },
    IBAN:{
        type: String,
        required : false
    },
    BIC:{
        type: String,
        required : false

    },
    financialMail:{
        type: String,
        required : false
    },
    central:{
        type: String,
        required : false
    },
    comment: {
        type: String,
        required : false
    },
    commercial: {
        type: String,
        required : false
    },
    lensPoint:{
        type: String,
        required : false
    },
    giftPoint: {
        type: String,
        required : false
    },
    password:{
        type: String,
        required : false
    },
    hash: {
        type: String,
        required : false
    }
});

var User = mongoose.model('User', UserSchema);

module.exports = {
    User: User
};