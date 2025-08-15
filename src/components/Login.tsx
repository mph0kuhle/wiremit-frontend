
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface LoginProps {
  onLogin: (user: { name: string; email: string }) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    // Mock login - check localStorage for existing user
    setTimeout(() => {
      const existingUsers = JSON.parse(localStorage.getItem('wiremit_users') || '[]');
      const user = existingUsers.find((u: any) => u.email === email && u.password === password);
      
      if (user) {
        onLogin({ name: user.name, email: user.email });
      } else {
        setErrors({ email: 'Invalid email or password' });
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl p-8"
      >
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-white text-center mb-8"
        >
          Welcome to Wiremit
        </motion.h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-white text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-300 text-sm mt-1">{errors.email}</p>}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-white text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-red-300 text-sm mt-1">{errors.password}</p>}
          </motion.div>
          
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 transition-all duration-200"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </motion.button>
        </form>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-white text-sm mt-6"
        >
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-300 hover:text-blue-200 font-medium">
            Sign up
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
