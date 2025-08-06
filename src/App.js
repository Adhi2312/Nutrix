import logo from './logo.svg';
import './App.css';
import DB from './screens/DB'
import {Food} from './screens/food'
import { Routes,Route, useNavigate, Navigate} from 'react-router-dom';
import { FaHome, FaUser, FaUtensils } from 'react-icons/fa';
import { FaBowlFood } from "react-icons/fa6";
// import { useState } from 'react-router-dom';
import { useEffect,useState } from 'react';
import ProfileForm from './screens/ProfileForm';
import {Signup, GDLB} from './screens/signup';
import { FirstPage } from './signup-pages/Main-Page';
import { useQuery } from "@tanstack/react-query";
import { Login } from './screens/login';
// import { useNavigate } from 'react-router-dom';

function App() {
  // console.log('well');
  const [data, setData] = useState();

  const { data: data1, refetch } = useQuery({
    queryKey: ["meals"],
    queryFn: () => {
      console.log("🔁 Fetching user-data...");
      return fetch("http://localhost:4000/user-data", {
        credentials: "include",
      }).then((res) => res.json()); // already JSON here
    },
    refetchInterval: 1000*60*5, // every second
  });
  
  useEffect(() => {
    if (data1) {
      setData(data1); // ✅ correct
      console.log("✅ Got user data:", data1.Calorie); // log fresh data
    }
  }, [data1]);
  

  return ( 
    <div className='main'>
                
        <div className='sub-main'>
          <Routes>
            {/* <Route path='/' element={Navigate to="/signup" />}/> */}
            {/* <Route path="/" element={<Navigate to="/signup/personal" />} /> */}
            <Route path="/" element={<DB data={data}/> } />
            <Route path="/plate" element={<Food/>}/>
            <Route path="/check" element={<ProfileForm />} />
            <Route path='/signup/*' element={<FirstPage/>}/>
            <Route path='/login' element={<Login/>}/>
          </Routes>
        </div>

                 <NavBar/>
        

   </div>
  );
}

export const NavBar=()=>{
  const nav=useNavigate();
  return (
    <div className='fixed bottom-0 left-1/2 -translate-x-1/2 mb-4 flex bg-white shadow-lg border border-gray-200  rounded-full p-4 px-8 justify-between gap-14'>
  <button className='nav-button' onClick={()=>{nav('/')}}>
           <FaHome size={32}/>
      </button>
      <button className='nav-button' onClick={()=>{nav('/plate')}}>
        <FaBowlFood size={32}/>
      </button>
      <button className='nav-button' onClick={()=>{nav('/check')}}>
        <FaUser size={32}/>
      </button>
    </div>
    
  )
}
export default App;