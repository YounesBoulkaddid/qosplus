import {Component} from 'angular2/core';
import {ProductFactory} from "./product.factory";
import {MODAL_DIRECTIVES} from "ng2-bs3-modal";
import {ProductAddComponent} from "./product-add.component";
import {ProductAddCartComponent} from "./product-add-cart.component";
import {ProductEditComponent} from "./product-edit.component";

@Component({
    providers: [],
    templateUrl: "app/Product/product-list.html",
    directives: [ MODAL_DIRECTIVES, ProductAddComponent, ProductAddCartComponent, ProductEditComponent]

})

export class ProductListComponent {
    products: Object ;
    productCart: String;
    isOpen = [];
    selectedProduct = [];
    spheres = {};
    sphereIndexes = [];
    
    constructor(public service: ProductFactory){
        this.getProducts();
    }

    loadModalProduct(product, modal) {
        modal.open();
        this.productCart = JSON.stringify(product);
    }

    getProducts(){
        this.service.getProduct()
            .subscribe(
                response => {
                    if(response.success){
                        this.products = response.data;
                        console.log(this.products);
                        for(var i in this.products){
                            this.isOpen.push(false);
                        }
                        for (var i in this.products) {
                            this.spheres[i] = [];
                            this.sphereIndexes[i] = [];
                            for (var j in this.products[i].item) {
                                for (var k in this.products[i].item[j].sphere) {
                                    var isNegative = false;
                                    var sphere = this.products[i].item[j].sphere[k].sphere;
                                    if (sphere < 0) {
                                        isNegative = true;
                                        sphere *= -1;
                                    }
                                    var floor = Math.floor(sphere);
                                    var index = floor.toString();
                                    if (isNegative) {
                                        index = "-"+index;
                                        sphere *= -1;
                                    }
                                    if (this.spheres[i][index] == null) this.spheres[i][index] = [];
                                    if (this.spheres[i][index].indexOf(sphere) == -1) {
                                        this.spheres[i][index].push(sphere);
                                        this.sphereIndexes[i] = Object.keys(this.spheres[i]);
                                    }
                                }
                            }
                            this.sphereIndexes[i].sort();
                        }
                    }else{
                        console.log(response);
                    }
                },
                err =>  console.log(err),
                () => console.log('get product list Complete')
            );
    }

    deleteProducts(){
        for(var i in this.selectedProduct){
            this.selectedProduct[i] = this.products[i]._id;
        }

        this.service.deleteProducts( this.selectedProduct)
            .subscribe(
                response => {
                    if(response.success){
                        this.getProducts();
                    }else{
                        console.log(response);
                    }
                },
                err =>  console.log(err),
                () => console.log('get product list Complete')
            );
    }
    selectProduct(index){
        var n = this.selectedProduct.indexOf(index);
        if( n != -1){
            this.selectedProduct.splice(n, 1);
        }else{
            this.selectedProduct.push(index);
        }
    }

    /*
     * 0 => paid
     * 1 => unvalidate
     * 2 => waiting for payment
     * */

    changeStatus(i) {

        var products = this.products;
        var service = this.service;

        setTimeout(function() {
            var product = products[i];
            product = service.changeProductStatus(product._id, product.status).subscribe(
                res => {
                    if(res.success){
                        //nothing
                    } else {
                        console.log(res);
                    }
                },
                err =>  console.log(err),
                () => console.log('product updated')
            );
        }, 100);
    }

    close(){
        this.getProducts();
    }
    
    //Edit and Delete should only take one product as argument
    /*editProduct(product){
        this.service.editProduct(product)
            .subscribe(
                response => {
                    if(response.success){
                        console.log("Product successfully updated");
                    }else{
                        console.log(response);
                    }
                },
                err =>  console.log(err),
                () => console.log('Product successfully updated')
            )
    }

    deleteProduct(product){
        this.service.deleteProduct(product)
            .subscribe(
                response => {
                    if(response.success){
                        console.log("Product successfully deleted");
                    }else{
                        console.log(response);
                    }
                },
                err =>  console.log(err),
                () => console.log('Product successfully deleted')
            )
    }*/
}