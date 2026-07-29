import { useNavigate } from "react-router-dom"
export const PersonalInfo=(props)=>{
  // console.log("name"+props.setFirstname)
    const nav=useNavigate()
  return(
    <div className='form'> 
    <h2>Personal Info</h2>
    <div className='form-2'>
      
      <h4>First name*</h4>
      <input onChange={(e)=>{props.setFirstname(e.target.value)}} placeholder='Enter your first name'/>
      <h4>Last name*</h4>
      <input onChange={(e)=>{props.setLastname(e.target.value)}} placeholder='Enter your first name'/>
      <h4>Email*</h4>
      <input onChange={(e)=>{props.setEmail(e.target.value)}} placeholder='Enter your Email'/>
      <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
<hr style={{ flex: 1, border: 'none', borderTop: '1px solid #ccc', margin: '0 10px' }} />
<span style={{ padding: '0 10px', color: '#666' }}>OR</span>
<hr style={{ flex: 1, border: 'none', borderTop: '1px solid #ccc', margin: '0 10px' }} />
</div>
      <button onClick={()=>{nav('/signup/verify')}}>Continue</button>

    </div>

    
  </div>
  )
}