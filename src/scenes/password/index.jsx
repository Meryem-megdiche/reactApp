
import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import '../LoginForm/LoginForm.css'

const ForgotPasswordForm = () => {
  
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    document.body.classList.add('login-page');
    return () => {
      document.body.classList.remove('login-page');
    };
  }, [])
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Ici, remplacez l'URL par votre API de réinitialisation de mot de passe
      const response = await fetch('https://nodeapp-0ome.onrender.com/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.status === 200) {
        alert('Email sent with password reset instructions');
        navigate('/forgot');
      } else {
        alert('Error: ' + (data.message || 'Unable to send email'));
      }
    } catch (error) {
      alert('Error sending reset email');
    }
  };

  return (
    <div className='wrapper'>
      <form onSubmit={handleSubmit}>
        <h1>Forgot Password</h1>
        <div className="input-box">
          <input 
            type="email" 
            placeholder='Enter your email' 
            required 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
         
        </div>
        <button type="submit">Send Reset Email</button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
