import React from 'react'
import { useNavigate } from 'react-router-dom'

export const Password = (props) => {
    const nav=useNavigate();
  return (
    <div className='form'> 
    <h2>Create your Password</h2>
    <div className='form-2'>
      
      <h4>Choose your Password*</h4>
      <input onChange={(e)=>{props.setPassword(e.target.value)}} placeholder='Enter Password'/>
      <h4>Confirm Password*</h4>
      <input placeholder='Confirm password'/>
      
     
      <button style={{marginTop:'20px'}} onClick={()=>{nav('/signup/general-info')}} >Continue</button>

    </div>

    
  </div>
  )
}
