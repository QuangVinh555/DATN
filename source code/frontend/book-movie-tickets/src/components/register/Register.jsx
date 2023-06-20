import React, { useState } from 'react';
import "./Register.scss";
import Logo from "../../assets/image/logo.png";
import { useDispatch } from 'react-redux';
import { updateAuth } from '../../redux/auth/AuthSlice';
import { ToastContainer, toast } from 'react-toastify';
import { registerApi } from '../../redux/auth/AuthApi';

const Register = () => {
    const dispatch = useDispatch();
    const handleBackLogin = () => {
        dispatch(updateAuth(1));
    }
    const handlePropagation = (e) => {
        e.stopPropagation();
    }

    // register
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [address, setAddress] = useState("");
    const [date, setDate] = useState("");
    const [phone, setPhone] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        if(fullName === "" || email === "" || date === "" || phone === "" || address === "" ||
            password === "" || confirmPassword === ""
        ){
            toast.info(
                "Vui lòng nhập đầy đủ thông tin!",
                {
                  position: toast.POSITION.TOP_RIGHT,
                  autoClose: 2000,
                }      
            );  
        }else if(password.localeCompare(confirmPassword)){
            toast.info(
                "Mật khẩu không trùng khớp!",
                {
                  position: toast.POSITION.TOP_RIGHT,
                  autoClose: 2000,
                }      
            );  
        }
        else{
            const newUser = {
                Fullname: fullName,
                Email: email,
                Address: address,
                Date: date,
                PhoneNumber: phone,
                Password: password
            }
            await registerApi(newUser, dispatch);
            toast.success(
                "Đăng ký thành công!",
                {
                  position: toast.POSITION.TOP_RIGHT,
                  autoClose: 2000,
                }      
            );  
            dispatch(updateAuth(1));
        }
    }

  return (
    <div className="login" onClick={() => dispatch(updateAuth(0))}>
        <div className="login-2"onClick={(e) => handlePropagation(e)}>
            <div style={{marginTop: '20px'}} className="login-logo">
                <img src={Logo} alt="" />
            </div>
            <h1 style={{marginTop: '20px'}}>Register</h1>
            <div className="login-form">
                <form onSubmit={(e) => handleRegister(e)}>
                    <div className="login-item">
                        <label>FullName: </label>
                        <input 
                            type="text" 
                            placeholder="Full Name"
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>
                    <div className="login-item">
                        <label>Email: </label>
                        <input 
                            type="email" 
                            placeholder="admin@gmail.com"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    
                    <div className="login-item">
                        <label>Address: </label>
                        <input 
                            type="text" 
                            placeholder="Tp. Hồ Chí Minh"
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    <div className="login-item">
                        <label>Date: </label>
                        <input 
                            type="date" 
                            placeholder="25-05-2001"
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <div className="login-item">
                        <label>SĐT: </label>
                        <input 
                            type="text" 
                            placeholder="+84"
                            onChange={(e) => setPhone(e.target.value)}
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
                    <div className="login-item">
                        <label>Confirm Password: </label>
                        <input 
                            type="password" 
                            placeholder="Mật khẩu từ 6 kí tự trở lên"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <div className="login-button">
                        <button type='submit' className='login-success'>Đăng ký</button>
                        <p onClick={() => handleBackLogin()}>Quay lại</p>
                    </div>
                </form>
            </div>
        </div>
        <ToastContainer />
    </div>
  )
}

export default Register