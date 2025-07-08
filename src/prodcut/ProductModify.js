import React, { useState, useEffect, use } from "react";
import axios from "axios";

export default function ProductModify({ id }) {
    const [product, setProduct] = useState({
        name: "",
        price: "",
        category: ""
    });

    useEffect(() => {
        const search = async () => {
            try {
                const response = await axios.get("http://localhost:8080/cal/product/product",
                    {
                        params: { id }
                    });
                setProduct({
                    id: response.data.id,
                    name: response.data.name,
                    price: response.data.price,
                    category: response.data.category
                });
                console.log("불러온 상품: ", response.data);
            } catch (error) {
                console.log("실패", error);
            }
        };

        if (id) {
            search();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log("보낼 값:", product);
            const response = await axios.post('http://localhost:8080/cal/product/modify', product);
            setProduct({ name: "", price: "", category: "" });
            console.log("등록 성공");
        } catch (error) {
            console.error('오류남: ', error);
            alert("수정 실패");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <h2>상품 등록</h2>
                <div>
                    <label>상품명: </label>
                    <input type="text" name="name" value={product.name} onChange={handleChange} required />
                </div>
                <div>
                    <label>가격: </label>
                    <input type="text" name="price" value={product.price} onChange={handleChange} required />
                </div>
                <div>
                    <label>카테고리: </label>
                    <input type="text" name="category" value={product.category} onChange={handleChange} required />
                </div>
                <div>
                    <button type="submit">
                        수정
                    </button>
                </div>
            </form>
        </>

    );
}



