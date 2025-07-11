import React, { useState, useEffect, use } from "react";
import axios from "axios";

export default function ProductModify({ id }) {
    const [product, setProduct] = useState({
        name: "",
        price: "",
        category: ""
    });

    //id값이 변할 때마다 실행
    useEffect(() => {
        if (!id) return;

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
                }); // id값을 추가하고 product에 저장
                console.log("불러온 상품: ", response.data);
            } catch (error) {
                console.log("실패", error);
            }
        };

        search();

    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault(); //제출시 페이지 새로고침 방지

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

    //입력값 실시간 반영
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value }); //입력값만 덮어쓰기
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <h2>상품 수정</h2>
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



