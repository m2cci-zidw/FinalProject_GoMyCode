import React,{useState} from 'react'
import {useDispatch} from 'react-redux'

import { register } from "../../JS/actions/user";
import './SignUp.css'


const SignUp = () => {
  const [newUser, setNewUser] = useState({})
  const dispatch = useDispatch()


  const handleChange =(e)=>{
    setNewUser({...newUser,[e.target.name]:e.target.value})
  }
    return (
    
          <div className="main">
                    <input type="checkbox" id="chk" aria-hidden="true" />
                <div className="signup">
                  
                  <form>
                    <label htmlFor="chk" aria-hidden="true">Sign up</label>
        
                    <input type="text" name="txt" placeholder="User name" required 
                    onChange={handleChange}
                    />
        
        
                    <input type="email" name="email" placeholder="Email" required
                    onChange={handleChange}
                    />
        
        
                    <input type="password" name="pswd" placeholder="Password" required
                    onChange={handleChange}/>
        
        
                    <button onClick={()=>dispatch(register(newUser))} >Sign up</button>
                  </form>
                </div>
          </div>
 
    )
}

export default SignUp