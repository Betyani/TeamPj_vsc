import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [pageInfo, setPageInfo] = useState({});

    useEffect(() => {
        const search = async () => {
            try {
                const response = await axios.get("http://localhost:8080/cal/product/list",
                    {
                        params: { page }
                    });
                setProducts(response.data.products);
                setPageInfo(response.data.pageInfo);

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
                {pageInfo.hasPrev && (
                    <button onClick={() => goToPage(pageInfo.startPage - 1)}>
                        ◀ 이전
                    </button>
                )}

                {Array.from({ length: pageInfo.endPage - pageInfo.startPage + 1 }, (_, index) => {
                    const pageNum = pageInfo.startPage + index;
                    return (
                        <button key={ pageNum } onClick={() => goToPage(pageNum)} >
                            [{ pageNum }]
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