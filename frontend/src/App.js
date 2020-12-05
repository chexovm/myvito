import React, { useEffect, useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import UserContext from './context/userContext';
import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Home from './components/layout/Home';


export default function App() {
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
  })

  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem('auth-token');
      if (token === null) {
        localStorage.setItem('auth-token', '')
        token = '';
      }
      const tokenRes = await axios.post('http://localhost:5000/api/user/tokenIsValid',
        null,
        { headers: { 'x-auth-token': token }, });
      if (tokenRes.data) {
        const userRes = await axios.get('http://localhost:5000/api/user', {
          headers: { 'x-auth-token': token },
        });
        setUserData({
          token,
          user: userRes.data,
        });
      }
    }
    checkLoggedIn()
  }, [])

  return (
    <>
      <BrowserRouter>
        <UserContext.Provider value={{ userData, setUserData }}>

          <Navbar />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
          </Switch>

        </UserContext.Provider>
      </BrowserRouter>
    </>
  )
}
