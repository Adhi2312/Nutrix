import React from 'react'

export const HealthInfo = (props) => {
  return (
    <div className='form'> 
    <h2>Health Info</h2>
    <div className='form-2'>
      
      <h4>Height in cm*</h4>
      <input onChange={(e)=>{props.setHeight(e.target.value)}} placeholder='Enter your height in cm'/>
      <h4>Weight in lbs*</h4>
      <input onChange={(e)=>{props.setWeight(e.target.value)}} placeholder='Enter your weight in lbs'/>
      <h4>Blood group*</h4>
      <input onChange={(e)=>{props.setBloodGroup(e.target.value)}} placeholder='Enter your Blood group'/>
     
      <button onClick={props.handleSubmit} >Submit</button>
    </div>

    
  </div>
  )
}
