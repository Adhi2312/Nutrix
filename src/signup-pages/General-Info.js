import React from 'react'
import { useNavigate } from 'react-router-dom'

export const GeneralInfo = (props) => {
  const nav=useNavigate()
  return (
    <div className='form'> 
    <h2>General Info</h2>
    <div className='form-2'>
      
      <h4>Choose your Gender*</h4>
      <div style={{display:'flex'}}>
      <input onClick={(e)=>{props.setGender(0)}} style={{height:'20px',width:'20px'}} type='radio' name="gender"  />
      <label style={{marginLeft:"10px",marginTop:'0px',fontSize:'16px'}}>Male</label>
      <input onClick={(e)=>{props.setGender(1)}} style={{height:'20px',width:'20px', marginLeft:"50px"}} type='radio' name="gender"  />
      <label style={{marginLeft:"10px",fontSize:'16px'}}>Female</label>
      </div>
      <h4>Date Of Birth*</h4>
      <input onChange={(e)=>{props.setDob(e.target.value)}} type='datetime-local' placeholder='Enter your weight in lbs'/>
      <h4>Location*</h4>
      <input onChange={(e)=>{props.setLocation(e.target.value)}} placeholder='Enter your Location'/>
     
      <button onClick={()=>{nav('/signup/health-info')}} >Continue</button>

    </div>

    
  </div>
  )
}
