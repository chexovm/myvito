import React, { useContext } from 'react';
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import UserContext from "../../context/userContext";


export default function Navbar() {
    const { userData, setUserData } = useContext(UserContext);
    const history = useHistory();
    const logout = async (e) => {
        e.preventDefault();
        setUserData({
            token: undefined,
            user: undefined,
        })
        localStorage.setItem('auth-token', '');
        history.push('/')
    }

    return (
        <nav>
            {userData.token === undefined ? <div>
                <Link to="/login">Log in!</Link>
                <Link to="/register">Create an account!</Link>
            </div> : <><span> {`Welcome, ${userData.user.username}`}</span> <button onClick={logout}>Log out!</button> </>
            }
        </nav >
    )
}
