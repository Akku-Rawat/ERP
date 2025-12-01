import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ERPImage from '../assets/ERP_Image.jpg';
import ERPLogo from '../assets/ERP_Logo.png';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');              
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

return (
  <div className="min-h-screen flex items-stretch bg-gray-200">
    <div className="flex w-full h-screen overflow-hidden">
      {/* Right Side: Banner (larger portion) */}
      <div className="w-3/5 bg-gray-300 flex items-center justify-center">
        <img
          src={ERPImage}
          alt="ERP Banner"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-2/5 bg-white flex flex-col items-center justify-center">
        <div className="mb-8">
          <img
            src={ERPLogo}
            alt="ERP Logo"
            className="h-16 w-auto object-contain" 
            /> 
        </div>
        <div className="p-8 max-w-md w-full">  
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">Welcome Back!</h2>
          </div>

          {error && <p className="text-red-300 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-2xl font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-2xl font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-black"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c5.523 0 10 4.477 10 10a10.01 10.01 0 01-1.588 5.41l3.589 3.59"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#006182] text-white py-2 px-4 rounded-md hover:bg-[#006182] transition duration-200"
            >
              LOGIN
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-black">
            Forgot password?{' '}
            <a href="#" className="text-[#006182] hover:underline">
              Reset it
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
);
};

export default Login;