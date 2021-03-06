/**
 * Created by medrupaloscil on 19/03/2016.
 */

var Product = require("../models/product/product.js").Product;
var Type = require("../models/types.js").Type;
var Item = require("../models/product/item.js").Item;
var logger = require('winston');
var fs = require('fs');
var mongoose = require('mongoose');
var crypto = require('crypto');

module.exports = {

    addProduct: function(req, res){
        var i = 0;
        setItem(req.body.products, i);

        function setItem(product,i){
            Product.count({}, function(err, c) {
                if(i < product.item.length){
                    var sphere = [];
                    var spheres = [];
                    var r = 0;
                    for (var n = product.item[i].sphere.min; n <= product.item[i].sphere.max; n += product.item[i].sphere.int) {
                        var reference = c+1+'-'+i+'-'+r;


                        if(spheres.indexOf(n) == -1)
                            spheres.push(n);



                        sphere.push({
                            sphere: n,
                            stock: product.item[i].stock,
                            reference: reference
                        });
                        r++;
                    }
                    delete product.item[i].sphere;
                    product.item[i].sphere = sphere;
                    product.item[i].spheres = spheres;
                    product.param["sphere"] = spheres;
                    var item = new Item(product.item[i]);
                    item.save(function(error, data) {
                        if (error) {
                            console.log(error);
                            logger.log('error', error);
                            res.json({success: false, message:error});
                        } else {
                            delete product.item[i];
                            product.item[i] = data.id;
                            i++;
                            setItem(product, i);
                        }
                    });
                }else{
                    setProduct(product, c);
                }
            });
        }

        function setProduct(product, c ){
            product.reference = c+1;
            var productSchema = new Product(product);
             productSchema.save(function(error, data) {
                 if (error) {
                     console.log(error);
                     logger.log('error', error);
                     res.json({success: false, message:error});
                 } else {
                     res.json({success: true, message:"Product add success", data: data});
                 }
             })
        }
    },

    getProducts: function(req, res){
        Product.find({}, function(err, product) {
            if(err){
                console.log(err);
                logger.log('error', err);
                res.json({success: false, message:error});
            }
            var i = 0;
            getItem(product, i);
        });

        function getItem(product, i){
            if(i < product.length){

                    Item.find({
                        '_id': { $in: product[i].item}
                    }, function(error, item){
                        if (error) {
                            console.log(error);
                            logger.log('error', error);
                            res.json({success: false, message:error});
                        }
                        delete product[i].item;
                        product[i].item = item;
                        i++;
                        getItem(product, i);
                    });

            }else{
                res.json({success: true, message:"Product List Find with success", data: product});
            }
        };

    },

    getActiveProducts: function(req, res){
        Product.find({status: 1}, function(err, product) {
            if(err){
                console.log(err);
                logger.log('error', err);
                res.json({success: false, message:error});
            }
            var i = 0;
            getItem(product, i);
        });

        function getItem(product, i){
            if(i < product.length){

                    Item.find({
                        '_id': { $in: product[i].item}
                    }, function(error, item){
                        if (error) {
                            console.log(error);
                            logger.log('error', error);
                            res.json({success: false, message:error});
                        }
                        delete product[i].item;
                        product[i].item = item;
                        i++;
                        getItem(product, i);
                    });

            }else{
                res.json({success: true, message:"Active products List Find with success", data: product});
            }
        };

    },

    countPrice: function(req, res){
        Type.find({},function(err, count) {
            if(err){
                console.log(err);
                logger.log('error', err);
                res.json({success: false, message:error});
            }
            res.json({success: true, message:"Product Price Count with success", data: count});
        });
    },

    listPrice: function(req, res){
        Product.find({}, 'name reference price', function(err, product) {
            if(err){
                console.log(err);
                logger.log('error', err);
                res.json({success: false, message:error});
            }
            res.json({success: true, message:"Product Price Find with success", data: product});
        });
    },

    updatePrice: function(req, res){
        Product.findOneAndUpdate({_id: req.body.product._id}, {price: req.body.product.price }, { 'new': true },  function(error, data){
            if(error){
                console.log(error);
                logger.log('error', error);
                res.json({ success: false, message: "Update Product Price Failed", data:error});
            }
            res.json({success: true, message:"Update Product Price with success", data: data});
        });
    },

    checkStock: function(req, res){

        var cart = req.body.cart;

        var result = [];

        for (var i in cart) {
            var product = cart[i];

            var item = product.item;
            var quantity = product.quantity;
            var reference = item.reference;
            var nbr = 0;

            Item.findOne({_id: item._id}, function (err, found_item) {
                if (err) {
                    console.log(err);
                    logger.log('error', err);
                    res.json({success: false, message: err});
                } else {
                    for (var j in found_item.sphere) {
                        if (found_item.sphere[j].reference == reference) {
                            var stock = found_item.sphere[j].stock;
                            found_item.sphere[j].stock = stock - quantity;
                            if (found_item.sphere[j].stock < 0) {
                                var state = 0;

                                if (stock == -1) state = 1;
                                result.push([product.name, item._id, state]);
                            }
                        }
                    }

                    if (nbr == cart.length - 1) {
                        sendStock();
                    } else {
                        nbr++;
                    }
                }
            });
        }

        function sendStock() {
            res.json({success: true, message:"Stock get with success", data: result});
        }
    },

    createPrice: function(req, res){
        var type = new Type(req.body.price);
        type.save(function(error, type){
            if(error){
                console.log(error);
                logger.log('error', error);
                res.json({ success: false, message: "Update Product Price  Failed", data:error});
            }
            for(var i in req.body.price.products){
                for(var n in req.body.price.products[i].price){
                    if(req.body.price.products[i].price[n].type == type.type){
                        req.body.price.products[i].price[n]._id = type._id;
                        req.body.price.products[i].price[n].name = type.name;
                    }
                }
            }
            var i = 0;
            updatePrice(req.body.price.products, i)
        });


        function updatePrice(products, i){
           if(i < products.length){
               Product.findOneAndUpdate({_id: req.body.price.products[i]._id}, {price: req.body.price.products[i].price }, { 'new': true },  function(error, data){
                   if(error){
                       console.log(error);
                       logger.log('error', error);
                       res.json({ success: false, message: "Update Product Price  Failed", data:error});
                   }
                   i++;
                   updatePrice(req.body.price.products, i)
               });


           }else{
               res.json({success: true, message:"Update Product Price with success", data: products});
           }
        }
    },

    editProduct: function(req, res){
        var i = 0;

        updateItem(req.body.product, i);
        function updateProduct(product, i){
            Product.findOneAndUpdate({_id: product._id}, {
                $set: {
                    'name': product.name,
                    'hydrophily': product.hydrophily,
                    'material': product.material,
                    'color': product.color,
                    'price': product.price,
                    'reference': product.reference,
                    'item': product.item,
                    'param': product.param,
                    'ametropia': product.ametropia,
                    'middlePrice': product.middlePrice,
                    'ownerPrice': product.ownerPrice,
                    'port': product.port,
                    'portDuration': product.portDuration,
                    'type': product.type,
                }
            }, function(err, product){
                if(err)
                {
                    console.log(err);
                    logger.log('error', err);
                    res.json({success: false, message:err});
                }
                else
                {
                    res.json({success: true, message:"Product Successfully updated", data: product});
                }
            })
        }

        function updateItem(product, i){
            if(i < product.item.length) {
                delete product.item[i].__v;

                Item.findOneAndUpdate({_id: product.item[i]._id}, {$set: product.item[i] }, { 'new': true },  function(error, item){
                    if(error){
                        console.log(error);
                        logger.log('error', error);
                        res.json({ success: false, message: "Subscribe Failed", data:error});
                    }
                    product.item[i] = item._id;
                    i++;
                    updateItem(product, i);
                });


            }else{
                updateProduct(product);
            }
        }
    },

    //not to use
    deleteProduct: function(req, res){
        var i = 0;

        deleteItem(req.body.product, i);
        function deleteProduct(product, i){
            Product.findOneAndRemove({_id: product._id}, function(err,product){
                if(err)
                {
                    console.log(err);
                    logger.log('error', err);
                    res.json({success: false, message:err});
                }
                else
                {
                    res.json({success: true, message:"Product Successfully deleted", data: product});
                }
            });
        }

        function deleteItem(product, i){
            if(i < product.item.length) {
                delete product.item[i].__v;
                Item.findOneAndRemove({_id: product.item[i]._id}, function(err,product){
                    if(err)
                    {
                        console.log(err);
                        logger.log('error', err);
                        res.json({success: false, message:err});
                    }
                    else
                    {
                        res.json({success: true, message:"Product Successfully deleted", data: product});
                    }
                });
            }else{
                deleteProduct(product, i);
            }
        }



    },

    deleteItem: function(req, res){

        var _id = req.body._id;
        var reference = req.body.reference;

        Item.findOne({_id: _id}, function(err,item){
            if(err)
            {
                console.log(err);
                logger.log('error', err);
                res.json({success: false, message:err});
            }
            else {

                var itemSphereToRemove = null;
                var sphereToRemove = null;
                var otherSpheres = [];

                for (var i in item.sphere) {
                    if (item.sphere[i].reference == reference) {
                        itemSphereToRemove = i;
                        sphereToRemove = item.sphere[i].sphere;
                    } else {
                        if (otherSpheres.indexOf(item.sphere[i].sphere) == -1){
                            otherSpheres.push(item.sphere[i].sphere);
                        }
                    }
                }

                if (itemSphereToRemove != null) {
                    item.sphere.splice(itemSphereToRemove, 1);
                    if (otherSpheres.indexOf(sphereToRemove) != -1){
                        otherSpheres.splice(otherSpheres.indexOf(sphereToRemove), 1);
                    }
                }

                item.save(function (err) {
                    if (err) {
                        res.json({success: false, message:err});
                    } else {
                        res.json({success: true, message:"Product Successfully deleted", data: item});
                    }
                })
            }
        });

    },

    deleteProducts: function(req, res) {

        var processedItems = 0;
        req.body.products.forEach(function(product, index, array){
            var i = 0;
            Product.findOne({_id:product}, function(err, result){
                if(result.item !== 'undefined'){
                    deleteItem(result, i);
                }else{
                    deleteProduct(result, i);
                }
            });

            processedItems++;
            if(processedItems == array.length){
                res.json({success: true, message: "Product Successfully deleted", data: product});
            }
        });


        function deleteProduct(product, index) {
            if (product.image.original != 'public/img/no_image.png'){
                deleteImage("../myApp/"+product.image.original);
            }
                Product.remove({_id: product._id}, function (err, product) {
                    if (err) {
                        console.log(err);
                        logger.log('error', err);
                        res.json({success: false, message: err});
                    }
                });
        }

        function deleteItem(product, i){
                if(i < product.item.length) {
                    delete product.item[i].__v;
                    Item.remove({_id: product.item[i]}, function(err,item){
                        if(err)
                        {
                            console.log(err);
                            logger.log('error', err);
                            res.json({success: false, message:err});
                        }
                        i++;
                        deleteItem(product, i);
                    });
                }else{
                    deleteProduct(product, i);
                }
        }

        function deleteImage(imagePath)
        {
            var imgType = ['-big', '-small', '-medium'];
            fs.access(imagePath, function(err){
               if(err && err.code === "ENOENT"){
                   logger.log(err);
               }else{
                   imgType.forEach(function(type)
                   {
                       fs.unlink(imagePath.slice(0, -4) + type + imagePath.slice(-4));
                   });

                   fs.unlink((imagePath));
               }
            });

        }
    },

    getOneProduct: function(req, res){
        Product.findOne({_id: req.params.id}, function(err, product){
            if(err)
            {
                console.log(err);
                logger.log('error', err);
                res.json({success: false, message:err});
            }
            var i = 0;
            getItem(product, i);

            function getItem(product, i){
                if(i < product.length){

                    Item.find({
                        '_id': { $in: product[i].item}
                    }, function(error, item){
                        if (error) {
                            console.log(error);
                            logger.log('error', error);
                            res.json({success: false, message:error});
                        }
                        delete product[i].item;
                        product[i].item = item;
                        i++;
                        getItem(product, i);
                    });

                }else{
                    res.json({success: true, message:"User List Find with success", data: product});
                }
            };
        })
    },

    getProductsById: function(req, res){
        Product.find({_id: {$in: req.body.productIds}}, function(err, products){
            if(err)
            {
                console.log(err);
                logger.log('error', err);
                res.json({success: false, message:err});
            }
            res.json({success: true, message:"Products List Find with success", data: products});

        })
    },

    changeProductStatus: function(req, res) {
        var id = req.body.id;
        var status = req.body.status;
        Product.findOne({_id: id}, function(err, product){
            if(err) {
                console.log(err);
                logger.log('error', err);
                res.json({success: false, message:err});
            } else {
                product.status = status;

                Product.findOneAndUpdate({_id: product._id}, product, { 'new': true }, function(err, product){
                    if(err) {
                        console.log(err);
                        logger.log('error', err);
                        res.json({success: false, message:err});
                    } else {
                        if(product){
                            res.json({success: true, message:"Product updated", data: product});
                        }else{
                            res.json({success: false, message:"Product not updated"});
                        }
                    }
                })
            }
        })
    },

    getProductsBySupplier: function(req, res){
        Product.find().sort({supplier: 1}, function(err, product){
            if(err)
            {
                console.log(err);
                logger.log('error', err);
                res.json({success: false, message:err});
            }
            var i = 0;
            getItem(product, i);
        });

        function getItem(product, i){
            if(i < product.length){

                Item.find({
                    '_id': { $in: product[i].item}
                }, function(error, item){
                    if (error) {
                        console.log(error);
                        logger.log('error', error);
                        res.json({success: false, message:error});
                    }

                    if(item){
                        delete product[i].item;
                        product[i].item = item;
                        i++;
                        getItem(product, i);
                    }else{
                        res.json({ success: false, message: "Item not Found Failed"});
                    }

                });

            }else{
                res.json({success: true, message:"Product List Find with success", data: product});
            }
        }
    },

    editItem: function(req, res){
        var item = req.body.item;

        Item.findOneAndUpdate({_id: item._id}, {$set: item }, { 'new': true },  function(error, item){
            if(error){
                console.log(error);
                logger.log('error', error);
                res.json({ success: false, message: "Subscribe Failed", data:error});
            }else{
                if(item){
                    res.json({success: true, message: "succesfully updated", data: item});
                }else{
                    res.json({ success: false, message: "Subscribe Failed"});
                }
            }
        });
    },

    duplicateProduct: function(req, res){
        var product = req.body.product;
        var newProduct = new Product(product);
        //removing the old id to create a new one
        newProduct._id = mongoose.Types.ObjectId();

        if(newProduct.image.original != 'public/uploads/no_image.png'){
            var generatedName = crypto.createHash('md5').update(newProduct.image.original.slice(0, -4)).digest('hex');

            //generating name for new image
            newProduct.image.original = "public/uploads/"+ generatedName + newProduct.image.original.slice(-4);
            newProduct.image.small = "public/uploads/"+generatedName + "-small" + newProduct.image.small.slice(-4);
            newProduct.image.medium = "public/uploads/"+generatedName + "-medium" + newProduct.image.medium.slice(-4);
            newProduct.image.big = "public/uploads/"+generatedName + "-big" + newProduct.image.big.slice(-4);

            //streaming data from old img to new img
            fs.createReadStream("../myApp/"+product.image.original).pipe(fs.createWriteStream("../myApp/"+newProduct.image.original));
            fs.createReadStream("../myApp/"+product.image.small).pipe(fs.createWriteStream("../myApp/"+newProduct.image.small));
            fs.createReadStream("../myApp/"+product.image.medium).pipe(fs.createWriteStream("../myApp/"+newProduct.image.medium));
            fs.createReadStream("../myApp/"+product.image.big).pipe(fs.createWriteStream("../myApp/"+newProduct.image.big));
        }

        Product.count({}, function(err, c) {
           if(err){
               console.log(err);
               logger.log('error', err);
                res.json({success: false, message: "error during getting Max Reference", data:err});
           }else{
                if(c){
                    //workaround to simply convert to integer
                    newProduct.reference = c + 1;
                    var i = 0;
                    duplicateItem(newProduct, i);
                }
           }
        });

        function duplicateProduct(newProduct){
            newProduct.save(function(err, newResult){
                if(err){
                    console.log(err);
                    logger.log('error', err);
                    res.json({ success: false, message: "Product not duplicated", data:err});
                }
                if(newResult){
                    res.json({success: true, message: "product duplicated", data: newResult})
                }else{
                    res.json({success: false, message: "Error product duplicated"})
                }
            });
        }

        function duplicateItem(newProduct, i){
            if(i < newProduct.item.length) {
                Item.findById(newProduct.item[i], function (err, item) {

                    if (err) {
                        console.log(err);
                        logger.log(err);
                    } else if(item){
                        var sphere = item.sphere.toObject();

                        for (var n in sphere) {
                            console.log(typeof item.sphere, i, n);
                            var reference = item.sphere[n].reference.split("-");
                            item.sphere[n].reference = newProduct.reference+"-"+reference[1]+"-"+reference[2]
                        }

                        item = item.toJSON();
                        delete item._id;
                        var newItem = new Item(item);

                        newItem.save(function (err, result) {
                            if (err) {
                                console.log(err);
                                logger.log('error', err);
                            } else {
                                if(result){
                                    delete newProduct.item[i];
                                    newProduct.item[i] = result._id;
                                    i++;
                                    duplicateItem(newProduct, i);
                                }else{
                                    res.json({success: false, message: "Error product duplicated"})
                                }
                            }
                        })
                    }
                });
            }else{
                duplicateProduct(newProduct);
            }
        };
    }
};
