import axios from "axios";

export class ProductService {

    getProductsSmall() {
        return fetch('assets/demo/data/products-small.json').then(res => res.json()).then(d => d.data);
    }

    getProducts() {
        return fetch('assets/demo/data/products.json').then(res => res.json()).then(d => d.data);
    }

    getProductsWithOrdersSmall() {
        return fetch('assets/demo/data/products-orders-small.json').then(res => res.json()).then(d => d.data);
    }

    getMaterialInfo() {
        return fetch('/assets/demo/data/material_info.json').then(res => res.json()).then(d => d.data);
    }
    getInventoryInfo() {
        return fetch('/assets/demo/data/inventory_info.json').then(res => res.json()).then(d => d.data);
    }
}