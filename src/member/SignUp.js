import React, { useState } from "react";
import axios from "axios";

export default function SignUp() {
    const [form, setForm] = useState({
        id: "",
        password: "",
        name: "",
        email: "",
        nickname: ""
    });

    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};

        if (!/^[a-zA-Z0-9]{5,20}$/.test(form.id)) {
            newErrors.id = "아이디는 영문자와 숫자 5~20자로 입력하세요.";
        }

        if (!/^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#$%^&*()_+=-]).{8,}$/.test(form.password)) {
            newErrors.password = "비밀번호는 영문, 숫자, 특수문자 포함 8자 이상이어야 합니다.";
        }

        if (!/^[가-힣]+$/.test(form.name)) {
            newErrors.name = "이름은 한글만 입력 가능합니다.";
        }

        if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$/.test(form.email)) {
            newErrors.email = "유효한 이메일 주소를 입력하세요.";
        }

        if (!/^[가-힣a-zA-Z0-9]{2,10}$/.test(form.nickname)) {
            newErrors.nickname = "닉네임은 한글, 영문, 숫자 2~10자로 입력하세요.";
        }

        // 에러 상태 반영
        setErrors(newErrors);

        // 에러가 없을 경우만 true 반환
        return Object.keys(newErrors).length === 0;


    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log("보낼 데이터: ", form);
            const response = await axios.post("http://localhost:8080/cal/member/signUp", form);
            alert("회원가입 성공");
        } catch (error) {
            alert("회원가입 실패");
            console.error("에러: ", error);
        }
    }

    return (
        <div>
            <h2>회원가입</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>아이디</label>
                    <input
                        name="userId"
                        value={form.id}
                        onChange={handleChange}
                        placeholder="영문/숫자 5~20자"
                        required
                    />
                </div>

                <div>
                    <label>비밀번호</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="영문/숫자/특수문자 포함 8자 이상"
                        required
                    />
                </div>

                <div>
                    <label>이름</label>
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="한글만 입력"
                        required
                    />
                </div>

                <div>
                    <label>이메일</label>
                    <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="example@domain.com"
                        required
                    />
                </div>

                <div>
                    <label>닉네임</label>
                    <input
                        name="nickName"
                        value={form.nickname}
                        onChange={handleChange}
                        placeholder="한글/영문/숫자 2~10자"
                        required
                    />
                </div>

                <button type="submit">가입하기</button>
            </form>
        </div>
    )


}