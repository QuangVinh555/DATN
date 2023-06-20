import React from 'react'
import { useEffect } from 'react';
import "./GoogleLogin.scss";
import { useDispatch } from 'react-redux';
import { updateTokenGG } from '../../redux/gooleLogin/GooleLoginSlice';


const GoogleLogin = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const handleCredentialResponse = async (response) => {
            // Xử lý id_token ở đây
            const newtokenGG = {
                token: response.credential
            }
            dispatch(updateTokenGG(newtokenGG));
        };
    
        const renderButton = () => {
          window.google.accounts.id.initialize({
            client_id: '366416574135-u9jjaa101ro4vqnnca1co75li2g3h9jv.apps.googleusercontent.com',
            callback: handleCredentialResponse,
          });
          window.google.accounts.id.renderButton(
            document.getElementById('google-signin-button'),
            { theme: 'outline', size: 'large', width: '100%'}
          );
        };
    
        if (window.google && window.google.accounts) {
          renderButton();
        } else {
          const interval = setInterval(() => {
            if (window.google && window.google.accounts) {
              renderButton();
              clearInterval(interval);
            }
          }, 300);
        }
    }, []);

   

  return (
    <div id="google-signin-button" className="centered-text"/>
  )
}

export default GoogleLogin