import React, { useState } from "react";
import axios from "axios";

export default function SignUp() {

    // 입력값 상태
    const [form, setForm] = useState({
        id: "",
        password: "",
        name: "",
        email: "",
        nickname: ""
    });

    // 중복 체크 결과 상태 (id/email/nickname만 사용)
    // null: 아직 검사 전, true: 사용 가능, false: 사용 불가
    const [avail, setAvail] = useState({
        id: null,
        email: null,
        nickname: null
    });

    // 각 필드의 오류 메시지 상태 (정규식/형식 오류)
    const [errors, setErrors] = useState({});

    const rules = {
        id: {
            regex: /^[a-zA-Z0-9_]{5,20}$/,
            message: "아이디는 영문자/숫자/밑줄(_) 5~20자"
        },
        password: {
            regex: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+=-]).{8,}$/,
            message: "비밀번호는 영문/숫자/특수문자 포함 8자 이상"
        },
        name: {
            regex: /^[가-힣]+$/,
            message: "이름은 한글만 입력"
        },
        email: {
            regex: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/,
            message: "유효한 이메일 형식이 아닙니다"
        },
        nickname: {
            regex: /^[가-힣a-zA-Z0-9]{2,10}$/,
            message: "닉네임은 한글/영문/숫자 2~10자"
        }
    };

    // 단일 필드 정규식 검사
    // - 매개변수 name/value를 받아 해당 규칙에 맞는지 검사
    // - 통과 시 ""(빈 문자열) 반환, 실패 시 메시지 반환
    const validateField = (name, value) => {
        if (!rules[name]) return ""; // 규칙 없는 필드(예: 없는 키) 방어
        return rules[name].regex.test(value) ? "" : rules[name].message;
    };

    // 전체 폼 정규식 검사 (제출 시 사용)
    const validateAll = () => {
        const nextErrors = {};
        // for...in: 객체의 key를 순회하는 문법
        for (const key in form) {
            const message = validateField(key, form[key]);
            if (message) nextErrors[key] = message;
        }

        // 에러 상태 반영
        setErrors(nextErrors);

        // 에러가 없을 경우만 true 반환
        return Object.keys(nextErrors).length === 0;


    };

    // 입력 변경 핸들러
    // - 비구조화 할당으로 e.target에서 name/value 추출
    // - 스프레드 문법(...prev)으로 기존 상태를 펼친 뒤 해당 name만 덮어쓰기
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        // 값이 바뀌면 즉시 정규식 에러 갱신 (실시간 에러 표시)
        const message = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: message }));

        // id/email/nickname은 값이 바뀌면 "중복 체크 결과" 무효화
        if (name === "id" || name === "email" || name === "nickname") {
            setAvail((prev) => ({ ...prev, [name]: null }));
        }

    }

    // onBlur 시: 1) 정규식 통과하면 2) 서버 중복 검사
    // - blur: 인풋 포커스가 빠져나갈 때 발생하는 이벤트
    const handleBlur = async (e) => {

        const { name, value } = e.target;

        // 1) 정규식 실패면 중복 체크까지 갈 필요 없음
        const message = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: message }));
        if (message) return;

        // 2) 중복 체크 대상만 서버 요청
        if (name === "id" || name === "email" || name === "nickname") {

            try {
                let url = "";
                let param = {};

                switch (name) {
                    case "id":
                        url = "http://localhost:8080/cal/member/check-id";
                        param = { id: value };
                        break;
                    case "email":
                        url = "http://localhost:8080/cal/member/check-email";
                        param = { email: value };
                        break;
                    case "nickname":
                        url = "http://localhost:8080/cal/member/check-nickname";
                        param = { nickname: value };
                        break;
                    default:
                        return;
                }

                const response = await axios.get(url, { params: param });

                if (response.data === true) {
                    setAvail((prev) => ({ ...prev, [name]: true }));

                } else {
                    setAvail((prev) => ({ ...prev, [name]: false }));
                    setErrors((prev) => ({
                        ...prev,
                        [name]: "이미 사용 중입니다.",
                    }));
                    setForm((prev) => ({ ...prev, [name]: "" }));
                }
            } catch (error) {
                console.error("중복 체크 오류:", error);
                setErrors((prev) => ({
                    ...prev,
                    [name]: "중복 체크 중 오류가 발생했습니다.",
                }));
                setAvail((prev) => ({ ...prev, [name]: null }));
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const ok = validateAll();
        if (!ok) {
            alert("입력값을 확인해주세요.");
            return;
        }

        // 2) 중복 검사 결과 확인 (세 항목 모두 true여야 제출 허용)
        // - 일부 항목이 아직 null(검사 전)이면 blur로 검사 유도
        const need = ["id", "email", "nickname"];
        const notChecked = need.filter((k) => avail[k] !== true);

        if (notChecked.length > 0) {
            alert("아이디/이메일/닉네임의 중복 확인을 완료해주세요.");
            return;
        }

        try {
            console.log("보낼 데이터: ", form);
            const response = await axios.post("http://localhost:8080/cal/member/signUp", form);
            alert("회원가입 성공");
        } catch (error) {
            alert("회원가입 실패");
            console.error("에러: ", error);
        }
    }

    // ✅ 보조: 중복 결과 텍스트 표시용 (초보자 친화)
    const renderAvailText = (name) => {
        if (avail[name] === true) return <p>✅ 사용 가능합니다.</p>;
        if (avail[name] === false) return <p>❌ 이미 사용 중입니다.</p>;
        return null; // null이면 아무것도 렌더링하지 않음
    };

    return (
        <div>
            <h2>회원가입</h2>

            {/* form onSubmit: 제출 시 handleSubmit 호출 */}
            <form onSubmit={handleSubmit}>
                {/* 아이디 */}
                <div>
                    <label>아이디</label>
                    <input
                        name="id"
                        value={form.id}
                        onChange={handleChange}
                        onBlur={handleBlur} // ✅ 포커스 아웃 시 정규식 + 중복
                        placeholder="영문/숫자/밑줄(_) 5~20자"
                        required
                    />
                    {/* 오류 메시지 표시 */}
                    {errors.id && <p>{errors.id}</p>}
                    {/* 중복 결과 표시 */}
                    {renderAvailText("id")}
                </div>

                {/* 비밀번호 (중복 체크 대상 아님) */}
                <div>
                    <label>비밀번호</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        onBlur={handleBlur} // 형식 검사만 수행
                        placeholder="영문/숫자/특수문자 포함 8자 이상"
                        required
                    />
                    {errors.password && <p>{errors.password}</p>}
                </div>

                {/* 이름 (중복 체크 대상 아님) */}
                <div>
                    <label>이름</label>
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        onBlur={handleBlur} // 형식 검사만 수행
                        placeholder="한글만 입력"
                        required
                    />
                    {errors.name && <p>{errors.name}</p>}
                </div>

                {/* 이메일 */}
                <div>
                    <label>이메일</label>
                    <input
                        name="email"
                        type="email" // HTML5 기본 이메일 유효성도 함께 적용
                        value={form.email}
                        onChange={handleChange}
                        onBlur={handleBlur} // ✅ 정규식 통과 시 서버 중복
                        placeholder="example@domain.com"
                        required
                    />
                    {errors.email && <p>{errors.email}</p>}
                    {renderAvailText("email")}
                </div>

                {/* 닉네임 */}
                <div>
                    <label>닉네임</label>
                    <input
                        name="nickname"
                        value={form.nickname}
                        onChange={handleChange}
                        onBlur={handleBlur} // ✅ 정규식 통과 시 서버 중복
                        placeholder="한글/영문/숫자 2~10자"
                        required
                    />
                    {errors.nickname && <p>{errors.nickname}</p>}
                    {renderAvailText("nickname")}
                </div>

                {/* 제출 버튼 (type="submit" 기본 동작: 폼 제출) */}
                <button type="submit">가입하기</button>
            </form>
        </div>
    );


}