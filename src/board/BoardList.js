import React, { useEffect, useState } from "react";
import axios from "axios";

export default function BoardList({ productId }) {

    const [review, setReivew] = useState([]);

    useEffect(() => {
        const search = async () => {
            try {
                console.log("상품id: ", productId);
                const response = await axios.get("http://localhost:8080/cal/board/list", {params: {productId}});
                setReivew(response.data);
                console.log("불러온 리뷰: ", response.data);
            } catch (error) {
                console.log(error);
            }
        };

        search();

    }, [productId]);

    return (
        <>
            <h2>리뷰 목록</h2>
            {review.map((review, index) => (
                <div key={index}>
                    <p>제목: {review.title}</p>
                    <p>내용: {review.content}</p>
                    <p>작성자: {review.writer}</p>
                    <p>작성시간: {review.createTime} </p>
                    <hr />
                </div>
            ))}
        </>
    );





}