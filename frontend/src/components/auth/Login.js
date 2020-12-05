import React, { useState, useContext } from 'react'
import { useHistory } from "react-router-dom";
import UserContext from "../../context/userContext";
import axios from 'axios';


export default function Login() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState();
    const { setUserData } = useContext(UserContext);
    const history = useHistory();

    const submit = async (e) => {
        e.preventDefault();
        try {
            const result = await axios.post('http://localhost:5000/api/user/login', { email, password, });
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
            <div> Log in!</div>
            {error && <span>{`Error: ${error}`}</span>}
            <form onSubmit={submit}>
                <input onChange={(e) => setEmail(e.target.value)} placeholder="enter your email here"></input>
                <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="enter your password here"></input>
                <button>Submit!</button>
            </form>
        </>
    )
}
