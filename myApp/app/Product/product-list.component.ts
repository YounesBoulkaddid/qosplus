import {Component} from 'angular2/core';
import {ProductFactory} from "./product.factory";
import {MODAL_DIRECTIVES} from "ng2-bs3-modal";
import {ProductAddComponent} from "./product-add.component";
import {ProductAddCartComponent} from "./product-add-cart.component";

@Component({
    providers: [],
    templateUrl: "app/Product/product-list.html",
    directives: [ MODAL_DIRECTIVES, ProductAddComponent, ProductAddCartComponent]

})

export class ProductListComponent {
    products: Object ;
    productCart: String;
    isOpen = [];
    selectedProduct = [];
    
    
    
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
                        for(var i in this.products){
                            this.isOpen.push(false);
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