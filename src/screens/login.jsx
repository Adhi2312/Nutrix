import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const Login = () => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:4000/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (res.status === 200) nav('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='min-h-screen bg-[radial-gradient(circle_at_top,_#ebf5ff,_#ffffff)] flex items-center justify-center px-4 py-10'>
      <div className='w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_24px_70px_rgba(17,68,133,0.14)]'>
        <div className='mb-8 text-center'>
          <div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-xl font-semibold text-white'>N</div>
          <h1 className='text-2xl font-semibold text-slate-800'>Welcome back</h1>
          <p className='mt-2 text-sm text-slate-500'>Log in to continue your wellness journey.</p>
        </div>

        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <label className='flex flex-col gap-2 text-sm font-medium text-slate-700'>
            <span>Username</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder='Enter username'
              className='rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white'
            />
          </label>

          <label className='flex flex-col gap-2 text-sm font-medium text-slate-700'>
            <span>Password</span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type='password'
              placeholder='Enter password'
              className='rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white'
            />
          </label>

          <button type='submit' className='mt-2 rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700'>Login</button>
        </form>

        <div className='mt-6 text-center text-sm text-slate-600'>
          <span>Don&apos;t have an account?</span>{' '}
          <Link to='/signup' className='font-semibold text-blue-600 hover:underline'>Sign up</Link>
        </div>
      </div>
    </div>
  );
};
