import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);

    useEffect(() => {
        const search = async () => {
            try {
                const response = await axios.get("http://localhost:8080/cal/product/list", 
                { 
                    params: { page } 
                });
                setProducts(response.data.products);
                setTotalPage(response.data.totalPage);
                
                console.log("불러온 상품: ", response.data);
            } catch (error) {
                console.log("실패", error);
            }
        };

        search();

    }, [page]);

    const goToPage = (pageNum) => {
        setPage(pageNum);
    } 

    return (
        <>
            <h2>상품 목록</h2>
            {products.map((product, index) => (
                <div key={index}>
                    {product.imageUrl && (
                        <img
                            src={`http://localhost:8080/cal/image/load/${product.imageUrl}`}
                            alt={product.name}
                            width="200"
                        />
                    )}
                    <p>이름: {product.name}</p>
                    <p>가격: {product.price}</p>
                    <p>카테고리: {product.category}</p>
                    <hr />
                </div>
            ))}

            <div>
            {Array.from({ length: totalPage }, (_, index) => (
                <button key={ index + 1} onClick={() => goToPage( index+1 )} >
                    [{ index + 1 }]
                </button>
            ))}    
                
            </div>

        </>
    );



}