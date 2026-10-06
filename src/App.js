import './App.css';
import DB from './screens/DB'
import {Food} from './screens/food'
import { Navigate, Outlet, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { FaBowlFood } from "react-icons/fa6";
import { useEffect, useState } from 'react';
import ProfileForm from './screens/ProfileForm';
import { Signup } from './pages/Signup';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Login } from './screens/login';
import { apiUrl } from './api';

const localDate = () => {
  const now = new Date();
  return [now.getFullYear(), now.getMonth() + 1, now.getDate()]
    .map((value, index) => String(value).padStart(index === 0 ? 4 : 2, '0'))
    .join('-');
};

function App() {
  const {
    data: authorized,
    isLoading: sessionLoading,
    isError: sessionError,
    refetch: refetchSession,
  } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const response = await fetch(apiUrl('/authorize'), { credentials: 'include' });
      if (response.status === 401) return false;
      if (!response.ok) throw new Error('Unable to verify session');
      const result = await response.json();
      return result.authorized === true;
    },
    retry: false,
    staleTime: 4 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });

  const { data, refetch: refetchUserData } = useQuery({
    queryKey: ["user-data"],
    queryFn: () => {
      return fetch(apiUrl(`/user-data?date=${localDate()}`), {
        credentials: "include",
      }).then(async (res) => {
        if (!res.ok) throw new Error('Unable to load user data');
        return res.json();
      });
    },
    refetchInterval: 1000 * 60 * 5,
    retry: false,
    enabled: authorized === true,
  });
  
  useEffect(() => {
    const refreshNutrition = () => refetchUserData();
    window.addEventListener('nutrition-updated', refreshNutrition);
    return () => window.removeEventListener('nutrition-updated', refreshNutrition);
  }, [refetchUserData]);
  

  return ( 
    <div className='main'>
      <Routes>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route element={(
          <ProtectedLayout
            authorized={authorized}
            loading={sessionLoading}
            error={sessionError}
            onRetry={refetchSession}
          />
        )}>
            <Route path="/" element={<DB data={data}/> } />
            <Route path="/dashboard" element={<DB data={data}/> } />
            <Route path="/plate" element={<Food/>}/>
            <Route path="/check" element={<ProfileForm />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </div>
  );
}

const ProtectedLayout = ({ authorized, loading, error, onRetry }) => {
  const location = useLocation();

  if (loading) {
    return <div className="route-status">Checking your session...</div>;
  }
  if (error) {
    return (
      <div className="route-status">
        <p>We could not verify your session.</p>
        <button type="button" onClick={() => onRetry()}>Try again</button>
      </div>
    );
  }
  if (!authorized) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <>
      <div className="sub-main"><Outlet /></div>
      <NavBar />
    </>
  );
};

export const NavBar = () => {
  const nav = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState('');

  const logout = async () => {
    setLoggingOut(true);
    setLogoutError('');
    try {
      const response = await fetch(apiUrl('/logout'), {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Logout failed');
      queryClient.setQueryData(['session'], false);
      queryClient.removeQueries({ queryKey: ['user-data'] });
      nav('/login', { replace: true });
    } catch (error) {
      setLogoutError('Could not log out. Please try again.');
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
    {logoutError ? <p className="logout-error" role="alert">{logoutError}</p> : null}
    <nav className="app-nav" aria-label="Main navigation">
      <button aria-label="Dashboard" title="Dashboard" className={`nav-button ${['/', '/dashboard'].includes(location.pathname) ? 'active' : ''}`} onClick={() => nav("/")}>
        <FaHome size={23} />
        <span className="nav-label">Home</span>
      </button>

      <button aria-label="Food" title="Food" className={`nav-button ${location.pathname === '/plate' ? 'active' : ''}`} onClick={() => nav("/plate")}>
        <FaBowlFood size={23} />
        <span className="nav-label">Food</span>
      </button>

      <button aria-label="Profile" title="Profile" className={`nav-button ${location.pathname === '/check' ? 'active' : ''}`} onClick={() => nav("/check")}>
        <FaUser size={22} />
        <span className="nav-label">Profile</span>
      </button>

      <button
        aria-label="Log out"
        title={logoutError || 'Log out'}
        className="nav-button"
        disabled={loggingOut}
        onClick={logout}
      >
        <FaSignOutAlt size={22} />
        <span className="nav-label">Log out</span>
      </button>
    </nav>
    </>
  );
};
export default App;
