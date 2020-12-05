import React, { useState, useContext } from 'react'
import { useHistory } from "react-router-dom";
import UserContext from "../../context/userContext";
import axios from 'axios';


export default function Register() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState();
    const [username, setUsername] = useState();
    const [passwordCheck, setPasswordCheck] = useState();
    const { setUserData } = useContext(UserContext);
    const history = useHistory();

    const submit = async (e) => {
        e.preventDefault();
        try {
            const result = await axios.post('http://localhost:5000/api/user/register', { username, password, passwordCheck, email });
            setUserData({
                token: result.data.token,
                user: result.data.user,
            })
            localStorage.setItem('auth-token', result.data.token);
            history.push('/')
        } catch (result) {
            setError(result.response.data.msg);
        }
    }


    return (
        <>
            <div> Register!</div>
            {error && <span>{`Error: ${error}`}</span>}
            <form onSubmit={submit}>
                <input onChange={(e) => setUsername(e.target.value)} placeholder="your username"></input>
                <input onChange={(e) => setEmail(e.target.value)} placeholder="your email"></input>
                <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="your password"></input>
                <input onChange={(e) => setPasswordCheck(e.target.value)} type="password" placeholder="password check"></input>
                <button>Submit!</button>
            </form>
        </>
    )
}
