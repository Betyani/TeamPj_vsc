import React, { useState, useEffect } from "react";
import axios from "axios";
import { filterParams } from "../utils/ParamUtils";

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [pageInfo, setPageInfo] = useState({});
    const [category, setCategory] = useState("");
    const [inputKeyword, setInputKeyWord] = useState("");
    const [keyword, setKeyword] = useState("");
    const [desc, setDesc] = useState(true);

    useEffect(() => {
        const search = async () => {
            try {

                const rawParams = {
                    page,
                    category,
                    keyword: keyword.trim(),
                    desc
                };

                const filterd = filterParams(rawParams);
                console.log("보낸 파라미터: ", filterd);

                const response = await axios.get("http://localhost:8080/cal/product/list",
                    {
                        params: filterd
                    });
                setProducts(response.data.products);
                setPageInfo(response.data.pageInfo);

                console.log("불러온 상품: ", response.data);
            } catch (error) {
                console.log("실패", error);
            }
        };

        search();

    }, [page, category, keyword, desc]);

    const goToPage = (pageNum) => {
        setPage(pageNum);
    }

    const handleSearch = (e) => {
        e.preventDefault();
        setKeyword(inputKeyword);
        setPage(1);
    }

    return (
        <>
            <form onSubmit={handleSearch}>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">전체</option>
                    <option value="도시락/조리면">도시락/조리면</option>
                    <option value="삼각김밥/김밥">삼각김밥/김밥</option>
                    <option value="샌드위치/햄버거">샌드위치/햄버거</option>
                    <option value="음료수/아이스크림">음료수/아이스크림</option>
                    <option value="과자/디저트">과자/디저트</option>
                    <option value="기타">기타</option>
                </select>

                <input type="text" placeholder="검색어 입력" value={inputKeyword} onChange={(e) => setInputKeyWord(e.target.value)} />

                <label>
                    <input type="radio" checked={desc === true} onChange={() => setDesc(true)} />
                    최신순
                </label>
                <label>
                    <input type="radio" checked={desc === false} onChange={() => setDesc(false)} />
                    오래된순
                </label>

                <button type="submit">검색</button>

            </form>

            <hr />

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
                {pageInfo.hasPrev && (
                    <button onClick={() => goToPage(pageInfo.startPage - 1)}>
                        ◀ 이전
                    </button>
                )}

                {Array.from({ length: pageInfo.endPage - pageInfo.startPage + 1 }, (_, index) => {
                    const pageNum = pageInfo.startPage + index;
                    return (
                        <button key={pageNum} onClick={() => goToPage(pageNum)} >
                            [{pageNum}]
                        </button>);
                })}

                {pageInfo.hasNext && (
                    <button onClick={() => goToPage(pageInfo.endPage + 1)}>
                        다음▶
                    </button>
                )}

            </div>

        </>
    );



}