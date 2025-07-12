import React, { useState } from 'react';
import './login.css';
import { useContext } from 'react';
import { StoreContext } from '../../Context/store-context';
import axios from "axios"
const Login = ({ setShowLogin }) => {
  const {url,setToken} =useContext(StoreContext)
  const [isSigningUp, setIsSigningUp] = useState(false); // Toggle between login and signup
  const [data,setData] =useState({
      name:"",
      email:"",
      password:""
  })
  const handleFormSwitch = () => {
    setIsSigningUp(!isSigningUp);
  };

  const onChangeHandler = (event) =>{
    const name =event.target.name;
    const value=event.target.value;
    setData(data=>({...data,[name]:value}))
  }
  const onLogin = async (event) =>{
    event.preventDefault()
    let newUrl = url;
    if (!isSigningUp){
      newUrl +="/api/user/login"
    }else{
      newUrl+="/api/user/register"
    }
    const response = await axios.post(newUrl,data)

    if (response.data.success){
        setToken(response.data.token);
        localStorage.setItem("token",response.data.token)
        setShowLogin(false)
    }else{
      alert(response.data.message)
    }
  }
  
  return (
    <div className="login-overlay">
      <div className="login-popup">
        <button className="close-button" onClick={() => setShowLogin(false)}>✖</button>
        <h1>{isSigningUp ? 'Sign Up' : 'Sign In'}</h1>
        <form onSubmit={onLogin} className="login-form">
          {isSigningUp && (
            <>
              <input name='name' onChange={onChangeHandler} value={data.name} type="text" id="name" placeholder="Enter your name" required />
            </>
          )}
          <input name='email' onChange={onChangeHandler} value={data.email} type="email" id="email" placeholder="Enter your email" required />

          <input name='password' onChange={onChangeHandler} value={data.password} type="password" id="password" placeholder="Enter your password" required />

          {isSigningUp && (
            <>
              <input name='confirmPassword' onChange={onChangeHandler} value={data.confirmPassword}  
                type="password"
                id="confirm-password"
                placeholder="Confirm your password"
                required
              />
            </>
          )}

          <button type="submit" className="login-submit">
            {isSigningUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <p className="toggle-form-text">
          {isSigningUp ? "Already have an account?" : "Don't have an account?"}{' '}
          <span className="form-switch" onClick={handleFormSwitch}>
            {isSigningUp ? 'Sign In' : 'Sign Up'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
