import React, { useState } from 'react'
import './signup.css'
import { CgShapeCircle } from "react-icons/cg";
import { FaRegCircleCheck } from "react-icons/fa6";
import { PersonalInfo } from './personal-info';
import { Routes,Route,useNavigate } from 'react-router-dom';
import { HealthInfo } from './Health-Info';
import { GeneralInfo } from './General-Info';
import { Password } from './Password';
import { Verification } from './Verification';
export const FirstPage = () => {
  const nav=useNavigate();
  const[firstname, setFirstname]=useState('ad');
  const[lastname, setLastname]=useState('');
  const[email, setEmail]=useState('');
  const[password, setPassword]=useState('');
  const[gender, setGender]=useState(1);
  const[location, setLocation]=useState('');
  const[dob, setDob]=useState('');
  const[height, setHeight]=useState(0);
  const[weight, setWeight]=useState(0);
  const [bloodgroup, setBloodgroup]=useState('');
  const handleSubmit=async()=>{
    const body={username:firstname+' '+lastname,
    
    email:email,
    password:password,
    gender:gender,
    country:location,
    dob:dob,
  height:height,
    weight:weight,
    bloodGroup:bloodgroup}
    try{const res=await fetch('http://localhost:4000/signup',{
method: 'POST',
credentials: 'include',
headers: {'Content-Type': 'application/json',
    },
  body:JSON.stringify(body)}
  );
if (res.status===200)nav('/dashboard')}

  catch(error){console.error(error)}


  }
  return (
    <div className='signup-css'>
        <div className='con-1'>
            <div className='con-1-1'>
                <div style={{ display:'flex'}}>
                <CgShapeCircle size={40} color='blue' />
                <h2 style={{margin:'2px 0px 0px 5px'}}>Signup</h2>
                </div>
                <div className='con-1-2'>
                    <div className='con-sub'>
                    <FaRegCircleCheck size={24} />
                    <h3>Personal Info</h3>
                      

                    </div>
                    <div className='con-sub'>
                    <FaRegCircleCheck size={24} />
                    <h3>Account Verification</h3>
                      

                    </div>
                    <div className='con-sub'>
                    <FaRegCircleCheck size={24} />
                    <h3>Choose a password</h3>
                      

                    </div>
                    <div className='con-sub'>
                    <FaRegCircleCheck size={24} />
                    <h3>General Info</h3>
                      

                    </div>
                    <div className='con-sub'>
                    <FaRegCircleCheck size={24} />
                    <h3>Health Info</h3>
                      

                    </div>
                    
                    
                </div>

            </div>
            
        </div>
        <div className='con-2'>
          <Routes>
            <Route path='personal' element={<PersonalInfo setFirstname={setFirstname} setLastname={setLastname} setEmail={setEmail}/>}/>
            <Route path='health-info' element={<HealthInfo setHeight={setHeight} setWeight={setWeight} setBloodGroup={setBloodgroup} handleSubmit={handleSubmit}/>}/>
            <Route path='verify' element={<Verification/>}/>
            <Route path='create-password' element={<Password setPassword={setPassword}/>}/>
            <Route path='general-info' element={<GeneralInfo setDob={setDob} setGender={setGender}  setLocation={setLocation}/>}/>
          </Routes>
          
          {/* <PersonalInfo/> */}
       
        </div>
        
        
        
    </div>
  )
}

