import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const loginInitial = {
  email: '',
  password: '',
};

const registerInitial = {
  firstname: '',
  lastname: '',
  email: '',
  contact: '',
  password: '',
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register } = useStore();
  const [mode, setMode] = useState('login');
  const [loginForm, setLoginForm] = useState(loginInitial);
  const [registerForm, setRegisterForm] = useState(registerInitial);
  const [status, setStatus] = useState({ loading: false, error: '' });

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ loading: true, error: '' });

    try {
      if (mode === 'login') {
        await login(loginForm);
      } else {
        await register(registerForm);
      }

      navigate('/');
    } catch (error) {
      setStatus({
        loading: false,
        error: error.message || 'Unable to complete authentication.',
      });
      return;
    }

    setStatus({ loading: false, error: '' });
  }

  const isLogin = mode === 'login';
  const fields = isLogin ? loginForm : registerForm;
  const setFields = isLogin ? setLoginForm : setRegisterForm;

  return (
    <div className="auth-shell">
      <section className="auth-panel content-section">
        <div className="section-header">
          <div>
            <span className="section-kicker">Account access</span>
            <h1>{isLogin ? 'Login page' : 'Create account'}</h1>
          </div>
        </div>

        <div className="chip-row">
          <button
            type="button"
            className={isLogin ? 'filter-chip active' : 'filter-chip'}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={!isLogin ? 'filter-chip active' : 'filter-chip'}
            onClick={() => setMode('register')}
          >
            Register
          </button>
        </div>

        <form className="form-card" onSubmit={handleSubmit}>
          <div className="form-grid">
            {Object.entries(fields).map(([key, value]) => (
              <label className="field" key={key}>
                <span>{key}</span>
                <input
                  className="text-input"
                  type={
                    key === 'password'
                      ? 'password'
                      : key === 'email'
                        ? 'email'
                        : 'text'
                  }
                  value={value}
                  onChange={(event) =>
                    setFields((current) => ({
                      ...current,
                      [key]: event.target.value,
                    }))
                  }
                  required
                />
              </label>
            ))}
          </div>

          {status.error ? <p className="error-text">{status.error}</p> : null}

          <button className="primary-button wide-button" type="submit" disabled={status.loading}>
            {status.loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>
      </section>
    </div>
  );
}
