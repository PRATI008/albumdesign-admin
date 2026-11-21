import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import '../Pages/CSS/Login.css'
const Login = () => {
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
      const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading,setLoading] = useState(false)
const navigate = useNavigate()

    const handleSubmit = async (e)=>{
        e.preventDefault();
        setError('');
setLoading(true);

try {
    const response = await fetch('http://localhost:4000/api/auth/login',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({email, password})
    });
    const data = await response.json();

    if(!response.ok || !data.success){
        setError(data.message || 'Invalid Email or Password');
        setLoading(false)
        return;
    }

    localStorage.setItem('adminToken', data.token);
    localStorage.setItem('adminInfo', JSON.stringify(data.admin));

    navigate('/dashboard');
} catch (error) {
    setError('server not connected')
}finally{
    setLoading(false)
}
    //     if(!email || !password){
    //         setError('please fill the email and password');
    //         return;
    //     }
    //     setError('')
    //     localStorage.setItem('isAdminLoggedIn','true')
    //     navigate('/dashboard')
    }
  return (
    <>
     <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <h1>
            <em>Singh</em> Album Design
          </h1>
          <span>Admin Control Panel</span>
        </div>

        <h2>Admin Login</h2>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label>Email ID</label>
            <input
              type="email"
              placeholder="singhalbumdesign@gmail.com"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="pass-box">
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Enter Your Password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-pass"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button type="submit" className="login-btn">
            Login to Dashboard
          </button>
        </form>

        <div className="login-footer">
          © {new Date().getFullYear()} Singh Album Design • Rae Bareli
        </div>
      </div>
    </div>
    </>
  )
}

export default Login