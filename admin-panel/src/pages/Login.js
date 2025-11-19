import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(data.user);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-5">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md relative">
        <div className="text-center mb-8">
          <h2 className="text-blue-900 text-2xl font-semibold mb-2">Government Portal</h2>
          <p className="text-gray-600 text-sm">Secure Access System</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="mb-6">
            <label htmlFor="username" className="block mb-2 text-gray-700 font-medium text-sm">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
              placeholder="Enter your username"
              className="w-full p-3 border-2 border-gray-200 rounded-lg text-base transition-colors focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-gray-700 font-medium text-sm">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="w-full p-3 border-2 border-gray-200 rounded-lg text-base transition-colors focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm border border-red-200">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-3.5 border-none rounded-lg text-base font-semibold cursor-pointer transition-transform hover:transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="bg-gray-50 p-4 rounded-lg text-xs text-gray-600">
            <p className="m-0">
              <strong>Demo Credentials:</strong><br />
              Username: admin<br />
              Password: government123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;