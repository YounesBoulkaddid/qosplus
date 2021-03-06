/**
 * Created by medrupaloscil on 19/03/2016.
 */

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var logger = require('winston');
var jwt = require('jsonwebtoken');


var Product = require("../models/product/product.js").Product;
var product = require("../modules/product.js");
var Token    = require('../modules/jsonwebtoken/module');

router.get('/list', function(req, res, next) {
   product.getProducts(req, res);
});

router.get('/listActive', function(req, res, next) {
   product.getActiveProducts(req, res);
});

router.get('/product/:id', function(req, res, next){
    product.getOneProduct(req, res);
});

router.post('/add', function(req, res, next) {
    if(req.body.product != 'undefined'){
        product.addProduct(req, res);
    } else {
        res.sendStatus(500);
    }
});

router.get('/price/count', function(req, res, next) {
        product.countPrice(req, res);
});

router.get('/price/list', function(req, res, next) {
    product.listPrice(req, res);
});
router.post('/price/update', function(req, res, next) {
    if(req.body.product != 'undefined'){
        product.updatePrice(req, res);
    } else {
        res.sendStatus(500);
    }
});
router.post('/checkStock', function(req, res, next) {
    if(req.body != 'undefined'){
        product.checkStock(req, res);
    } else {
        res.sendStatus(500);
    }
});

router.put('/edit/', function(req, res, next){
    if(req.body.product != 'undefined'){
        product.editProduct(req, res);
    } else {
        res.sendStatus(500);
    }
});

router.post('/price/create', function(req, res, next) {
    if(req.body.price != 'undefined'){
        product.createPrice(req, res);
    } else {
        res.sendStatus(500);
    }
});

router.post('/getProductsById', function(req, res, next) {
    if(req.body.price != 'undefined'){
        product.getProductsById(req, res);
    } else {
        res.sendStatus(500);
    }
});

router.post('/delete', function(req, res){
    if(req.body.product != "undefined"){
        product.deleteProduct(req, res);
    }else{
        res.sendStatus(500);
    }
});

router.post('/deleteItem', function(req, res){
    if(req.body.product != "undefined"){
        product.deleteItem(req, res);
    }else{
        res.sendStatus(500);
    }
});

router.post('/deletes', function(req, res){
    if(req.body.products != "undefined"){
        product.deleteProducts(req, res);
    }else{
        res.sendStatus(500);
    }
});
router.get('/list/supplier/asc', function(req, res){
    if(req.body.products != "undefined"){
        product.getProductsBySupplier(req, res);
    }else{
        res.sendStatus(500);
    }
});

router.post('/changeProductStatus',function(req, res) {
    if(req.body != 'undefined'){
        product.changeProductStatus(req, res);
    }else{
        res.sendStatus(500);
    }
});

router.post('/editItem', function(req, res){
    if(req.body != 'undefined'){
        product.editItem(req, res);
    }else{
        res.sendStatus(500);
    }
});

router.post('/duplicateProduct', function(req, res){
    if(req.body != 'undefined'){
        product.duplicateProduct(req, res);
    }else{
        res.sendStatus(500);
    }
});

module.exports = router;