import React, { useEffect } from "react";
import axios from "axios";

export default function BoardDelete({ id }) {

    useEffect(() => {
        if (!id) return;

        const connect = async () => {
            try {
                const response = await axios.delete("http://localhost:8080/cal/board/delete", {
                    params: { id }
                });
                console.log("삭제 성공");
            } catch (error) {
                console.log("실패", error);
            }
        };

        connect();

    }, [id]);

    return null;

}