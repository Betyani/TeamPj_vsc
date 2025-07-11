import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ProductList() {
    const [product, setProduct] = useState([]);

    useEffect(() => {
        const search = async () => {
            try {
                const response = await axios.get("http://localhost:8080/cal/product/list");
                setProduct(response.data);
                console.log("불러온 상품: ", response.data);
            } catch (error) {
                console.log("실패", error);
            }
        };

        search();

    }, []);

    return (
        <>
            <h2>상품 목록</h2>
            {product.map((product, index) => (
                <div key={index}>
                    <p>이름: {product.name}</p>
                    <p>가격: {product.price}</p>
                    <p>카테고리: {product.category}</p>
                    <hr />
                </div>
            ))}
        </>
    );



}