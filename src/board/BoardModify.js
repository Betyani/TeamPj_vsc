import React, { useState, useEffect, use } from "react";
import axios from "axios";

export default function BoardModify({ id }) {
    const [review, setReview] = useState({
        title: "",
        content: "",
    });

    //id값이 변할 때마다 실행
    useEffect(() => {
        if (!id) return;

        const search = async () => {
            try {
                const response = await axios.get("http://localhost:8080/cal/board/review",
                    {
                        params: { id }
                    });
                setReview({
                    id: response.data.id,
                    title: response.data.title,
                    content: response.data.content
                }); // id값을 추가하고 review에 저장
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
            console.log("보낼 값:", review);
            const response = await axios.post('http://localhost:8080/cal/board/modify', review);
            setReview({ title: "", content: ""});
            console.log("등록 성공");
        } catch (error) {
            console.error('오류남: ', error);
            alert("수정 실패");
        }
    };

    //입력값 실시간 반영
    const handleChange = (e) => {
        const { name, value } = e.target;
        setReview({ ...review, [name]: value }); //입력값만 덮어쓰기
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <h2>리뷰 수정</h2>
                <div>
                    <label>제목: </label>
                    <input type="text" name="title" value={review.title} onChange={handleChange} required />
                </div>
                <div>
                    <label>내용: </label>
                    <input type="text" name="content" value={review.content} onChange={handleChange} required />
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



