import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { useParams } from "react-router-dom";
import ProductDescription from "../components/ProductDescription";
import ProductHD from "../components/ProductHd";
import ProductMD from "../components/ProductMd";

const Product = () => {
    const {all_products} = useContext(ShopContext);
    const {productId} = useParams()
    console.log("productId: ", productId);
    const product = all_products.find((e) => e._id === productId);
    if(!product){
        return <div className="h1 pt-28">Product not Found</div>
    }

    return (
        <section className="max-padd-container py-20">
            <div>
                <ProductHD product = {product}/>
                <ProductMD product = {product}/>
                <ProductDescription product = {product}/>
            </div>

        </section>
    );
}

export default Product;