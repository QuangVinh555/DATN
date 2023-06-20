import React from 'react';
import "./Login.scss";
import Logo from "../../assets/image/logo.png";
import { useDispatch, useSelector } from 'react-redux';
import { getToken, updateAuth } from '../../redux/auth/AuthSlice';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { loginApi } from '../../redux/auth/AuthApi';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleLogin from '../google/GoogleLogin';
import { loginGoogleSuccess } from '../../redux/gooleLogin/GooleLoginSlice';
import { LOCAL_STORAGE_TOKEN_NAME } from '../../localStorage/localStorage';
import { loginGooleApi } from '../../redux/gooleLogin/GoogleLoginApi';

const Login = () => {
    const dispatch = useDispatch();
    const pending = useSelector(state => state.auth.pending)
    const token = useSelector(state => state.auth.token);
    const tokenGG = useSelector(state => state.googleLogin.tokenGG);
    const googleLogin = useSelector(state => state.googleLogin.googleLogin);
    const pendingGG = useSelector(state => state.googleLogin.pending);
    // open form register
    const hanldeIsOpenFormRegister = () => {
        dispatch(updateAuth(2))
    }

    // tránh nỗi bọt
    const handlePropagation = (e) => {
        e.stopPropagation();
    }

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // login success
    const handleLogin = async (e) => {
        e.preventDefault();
        if(email === "" || password === "" ){
            toast.info(
                "Vui lòng nhập đầy đủ thông tin!",
                {
                  position: toast.POSITION.TOP_RIGHT,
                  autoClose: 2000,
                }      
            );  
        }else{
            const newUser = {
                email: email,
                password: password
            }
            await loginApi(newUser, dispatch);
            toast.success(
                "Đăng nhập thành công !",
                {
                  position: toast.POSITION.TOP_RIGHT,
                  autoClose: 2000,
                }      
            );  
       
            dispatch(updateAuth(0));
        }
    }
    const navigate = useNavigate();
    useEffect(() => {
        if(token?.RoleId === "2"){
            navigate("/dashboard");
        }
    }, [token])

    // đăng nhập bằng google

    useEffect(() => {
        if(tokenGG){
            const loginGoogle = async () => {
                await loginGooleApi(tokenGG, dispatch);          
                localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME, tokenGG.token);     
                dispatch(updateAuth(0));
            }
            loginGoogle();
        }
        
    }, [tokenGG,googleLogin]);

    useEffect(() => {
        if(googleLogin){
            dispatch(getToken(googleLogin)) 
        }
    }, [googleLogin]);

  return (
    <div className="login" onClick={() => dispatch(updateAuth(0))}>
        {
        pending && (
          <div className = "userinfo-loading">
            <div className="lds-dual-ring"></div>
          </div>
        )
      }{
        pendingGG && (
            <div className = "userinfo-loading">
              <div className="lds-dual-ring"></div>
            </div>
          )
      }
        <div className="login-2" onClick={(e) => handlePropagation(e)}>
            <div className="login-logo">
                <img src={Logo} alt="" />
            </div>
            <h1>LOGIN</h1>
            <div className="login-form">
                <form onSubmit={(e) => handleLogin(e)}>
                  
                    <div className="login-item">
                        <label>Email: </label>
                        <input 
                            type="text" 
                            placeholder="admin@gmail.com"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="login-item">
                        <label>Password: </label>
                        <input 
                            type="password" 
                            placeholder="Mật khẩu từ 6 kí tự trở lên"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    
                    <div className="login-button">
                        <button type='submit' className='login-success'>Đăng nhập</button>
                        <p>hoặc</p>
                        {/* <button className='login-google'>Đăng nhập bằng Google</button> */}
                        <GoogleLogin />
                        <p>Chưa có tài khoản? <b onClick={() => hanldeIsOpenFormRegister()}>Đăng ký ngay!</b></p>
                    </div>
                </form>
            </div>
        </div>
        <ToastContainer />
    </div>
  )
}

export default Login