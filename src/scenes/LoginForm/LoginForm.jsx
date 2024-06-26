import React, { useState, useEffect } from 'react';
import './LoginForm.css';
import { useNavigate } from 'react-router-dom';

const LoginForm = () =>
{  useEffect(() => {
  document.body.classList.add('login-page');
  return () => {
    document.body.classList.remove('login-page');
  };
}, []);
    const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('https://noderole-1.onrender.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
  
      if (response.status === 200) {
        // Stockez le token dans localStorage ou un contexte de gestion d'état global si vous utilisez Redux ou Context API
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));
         // Redirect based on user role
         const userRole = data.user.role;
         if (userRole === 'admin' || userRole === 'technicienReseau') {
           navigate('/dashboard');
         } else if (userRole === 'adminSystem') {
           navigate('/user');
         }
         window.location.reload();
      } else if (response.status === 401) {
        // Code d'état HTTP 401 indique une authentification non réussie (mauvais identifiant ou mot de passe)
        alert('Login failed: Incorrect email or password.');
      } else {
        // Toute autre réponse non réussie du serveur
        alert(`Login failed: ${data.message || 'An unspecified error occurred.'}`);
      }
    } catch (error) {
      // Une erreur est survenue lors de la connexion au serveur ou de la réception de la réponse
      alert('Server connection error.');
    }
  };
  
  const handleForgotPassword = () => {
    console.log('Redirection to  forgotPassword');
    navigate('/password');
  };
    
    return (
        <div className='wrapper'> 
        <form  onSubmit={handleSubmit}>
            <h1>Login</h1>
            <div className="input-box">
            <input type="text" placeholder='Adresse e-mail' required  
            value={email} onChange={(e) => setEmail(e.target.value)} 
                       />
            
            </div>
            <div className="input-box">
            <input type="password" placeholder='Password' required  value={password} onChange={(e) => setPassword(e.target.value)}
             
              />
            
            </div>
            <div className="remember-forgot">
                <label ><input type="checkbox" />Remember me</label>
                <a href="#" onClick={handleForgotPassword}> Forgot password ? </a>
            </div>
            <button type="submit">Login</button>
            
        </form>
        </div>
        

    )
}
export default LoginForm  ;