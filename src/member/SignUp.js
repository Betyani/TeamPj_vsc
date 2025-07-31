import React, { useState } from "react";
import axios from "axios";

export default function SignUp() {
    const [form, setForm] = useState({
        userId: "",
        password: "",
        name: "",
        email: "",
        nickName: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    }















}