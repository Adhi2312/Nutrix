import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { apiUrl } from '../api';

export const Login = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const nav = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(apiUrl('/login'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const message = await res.text();
        setError(message || 'Invalid username or password.');
        return;
      }
      queryClient.setQueryData(['session'], true);
      await queryClient.invalidateQueries({ queryKey: ['user-data'] });
      const destination = location.state?.from?.pathname || '/dashboard';
      nav(destination, { replace: true });
    } catch (error) {
      console.error('Login request failed.');
      setError('Login is unavailable right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className='login-page'>
      <section className='login-story' aria-label="About Nutrix">
        <div className="login-brand-lockup"><span className="login-brand-mark">N</span><span>nutrix</span></div>
        <div className="login-story-copy">
          <p className="login-kicker">Eat with intention.</p>
          <h1>A clearer view of your everyday health.</h1>
          <p>Keep your meals, movement, and progress in one calm place.</p>
        </div>
        <div className="login-insight" aria-hidden="true">
          <div className="insight-top"><span>Your daily rhythm</span><strong>steady</strong></div>
          <div className="insight-bar"><span /></div>
          <div className="insight-meta"><span>Nutrition</span><span>Movement</span><span>Recovery</span></div>
        </div>
        <p className="login-story-footer">A small daily check-in goes a long way.</p>
      </section>

      <section className='login-content'>
        <div className='login-panel'>
          <div className='auth-header'>
            <span className="sr-only">Welcome back</span>
            <p className="login-panel-kicker">Member sign in</p>
            <h2>Good to see you.</h2>
            <p>Pick up where you left off.</p>
          </div>

          <form className='auth-form' onSubmit={handleSubmit}>
          {error ? <p role="alert" className="form-error">{error}</p> : null}
          <label className='form-field'>
            <span>Email</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type='email'
              autoComplete='email'
              placeholder='Enter your email'
              className='form-control'
            />
          </label>

          <label className='form-field'>
            <span>Password</span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type='password'
              autoComplete='current-password'
              placeholder='Enter password'
              className='form-control'
            />
          </label>

          <button disabled={submitting} type='submit' className='button-primary auth-submit'>
            {submitting ? 'Logging in...' : 'Login'}
          </button>
          </form>

          <div className='auth-switch-copy'>
            <span>New to Nutrix?</span>{' '}
            <Link to='/signup'>Create an account</Link>
          </div>
        </div>
      </section>
    </main>
  );
};
