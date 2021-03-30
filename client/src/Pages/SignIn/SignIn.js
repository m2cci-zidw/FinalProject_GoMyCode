import React from 'react'
import './Signin.css'

const SignIn = () => {

    return (
            
        <div className="main">  	
        <div className="login">
          <form>
            <label htmlFor="chk" aria-hidden="true">Login</label>
            
            <input type="email" name="email" placeholder="Email" required />

            <input type="password" name="pswd" placeholder="Password" required />

            <button>Login</button>
          </form>
        </div>
      </div>
    );
  }

export default SignIn
