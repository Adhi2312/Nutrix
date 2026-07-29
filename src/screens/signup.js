import React from 'react'
import g from '../imges/image.png'
import './signup.css'

export const Signup = () => {
  return (
    <div className='c-i'>
        <h1>Contact Info</h1>
        <div>
        <p className='form-p'>Email</p>

        <input className='ini' type="email" placeholder='Ex: Prithiv916@gmail.com'/>
        <p className='form-p'>Phone No</p>

        <input className='ini' type="phone" placeholder='Ex: 9361648407'/>

        </div>
        <p>or</p>
        <div style={{display:'flex',padding:'10px 40px',backgroundColor:'white',textAlign:'center',borderRadius:'10px'}}>
            {/* <div style={{width:"",backgroundColor:"red"}}> */}
                <img width={20} style={{marginRight:"15px"}}  src={g} alt="Google logo"/>
            {/* </div> */}
            <p style={{margin:'0px'}}>Continue with Google</p>
        </div>
        <div style={{display:'flex',width:"100%",margin:'50px 0px',justifyContent:'flex-end'}}>
            <button style={{width:'120px',padding:"10px 30px",backgroundColor:"blue",color:"white",borderRadius:"8px",border:'0px',height:'45px'}}>Next</button>
        </div>

    </div>
  )
}
export const GDLB=()=>
{
    return (
        <div style={{display:'flex',justifyContent:'center'}}>
            <div style={{backgroundColor:'red'}}>
                <h1>
                    hello
                </h1>
            </div>
        </div>
    )
}