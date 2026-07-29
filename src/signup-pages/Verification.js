import React from 'react'
import { useNavigate } from 'react-router-dom'

export const Verification = () => {
    const nav=useNavigate();
  return (
    <div className='form'> 
    <h2>Verify your account</h2>
    <div className='form-2'>
      
      <h4>Enter 6 digit otp sent to your email*</h4>
      <div className='otp'>
      <input   maxlength="1" id="field1" oninput="moveToNext(this, 'field2')" />
  <input type="text" maxLength="1" id="field2" oninput="moveToNext(this, 'field3')" />
  <input type="text" maxLength="1" id="field3" oninput="moveToNext(this, 'field4')" />
  <input type="text" maxlength="1" id="field4" oninput="moveToNext(this, 'field5')" />
  <input type="text" maxLength="1" id="field5" oninput="moveToNext(this, 'field6')" />
  <input type="text" maxLength="1" id="field6" />
     
      </div>
      
      
      
     
      <button style={{marginTop:'20px'}} onClick={()=>{nav('/signup/create-password')}} >Continue</button>

    </div>

    
  </div>
  )
}
