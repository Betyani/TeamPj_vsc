import React, { useState } from "react";
import axios from "axios";


export default function ImageUpload() {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");


    //업로드 전 미리보기
    const handleFileChange = (e) => {
        const uploadFile = e.target.files[0];
        setFile(uploadFile);
        setPreviewUrl(URL.createObjectURL(uploadFile));
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append("file", file);

        try {
        const respone = await axios.post("http://localhost:8080/cal/image/upload", formData);
        alert("업로드 성공! 이미지 파일명: " + respone.data.fileName);

        } catch (error) {
            console.error("실패", error);
        }

    };

    return (
        <>
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>업로드</button>
            {previewUrl && <img src={previewUrl} width="200" />}
        </div>
        
        </>

    );




}