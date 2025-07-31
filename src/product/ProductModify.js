import React, { useState, useEffect, use } from "react";
import axios from "axios";

export default function ProductModify({ id }) {
    const [product, setProduct] = useState({
        name: "",
        price: "",
        category: "",
        imageUrl: ""
    });

    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");

    //id값이 변할 때마다 실행
    useEffect(() => {
        if (!id) return;

        const search = async () => {
            try {
                const response = await axios.get("http://localhost:8080/cal/product/product",
                    {
                        params: { id }
                    });
                setProduct(response.data);
                console.log("불러온 상품: ", response.data);
            } catch (error) {
                console.log("실패", error);
            }
        };

        search();

    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault(); //제출 시 페이지 새로고침 방지

        let fileName = null;

        if (file) {
            const formData = new FormData();
            formData.append("file", file);

            try {
                const fileUploadRespone = await axios.post("http://localhost:8080/cal/image/upload", formData);
                fileName = fileUploadRespone.data.fileName;
            } catch (error) {
                console.error("업로드 실패", error);
                return;
            }

        }


        try {
            const productWithImage = { ...product, imageUrl: fileName };
            console.log("보낼 값:", productWithImage);
            const response = await axios.post('http://localhost:8080/cal/product/modify', productWithImage);
            setProduct({ name: "", price: "", category: "" }); //입력창 초기화
            setFile(null);

            if (previewUrl) {
                URL.revokeObjectURL(previewUrl); // 이전 이미지 메모리 해제
            }
            setPreviewUrl("");
            console.log("등록 성공");
        } catch (error) {
            console.error('오류남: ', error);
            alert("등록 실패");
        }
    };

    //입력값 실시간 반영
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value })); //입력값만 덮어쓰기
    }

        const handleFileChange = (e) => {
        const newFile = e.target.files[0];
        if (!newFile) {
            setFile(null);

            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl("");
            }

            return;
        }
        setFile(newFile);

        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        const newUrl = URL.createObjectURL(newFile);

        setPreviewUrl(newUrl);

    };


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
                    <select id="categorySelect" name="category" value={product.category} onChange={handleChange}>
                        <option value="">카테고리를 선택하세요</option>
                        <option value="도시락/조리면">도시락/조리면</option>
                        <option value="삼각김밥/김밥">삼각김밥/김밥</option>
                        <option value="샌드위치/햄버거">샌드위치/햄버거</option>
                        <option value="음료수/아이스크림">음료수/아이스크림</option>
                        <option value="과자/디저트">과자/디저트</option>
                        <option value="기타">기타</option>
                    </select>
                </div>
            <div>
                <label>새 이미지 선택: </label>
                <input type="file" onChange={handleFileChange} />
            </div>

            <div>
                {/* 새로 선택한 이미지 미리보기 또는 기존 이미지 */}
                {previewUrl ? (
                    <img src={previewUrl} alt="미리보기" width="200" />
                ) : (
                    product.imageUrl && (
                        <img
                            src={`http://localhost:8080/cal/image/load/${product.imageUrl}`}
                            alt={product.name}
                            width="200"
                        />
                    )
                )}
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



