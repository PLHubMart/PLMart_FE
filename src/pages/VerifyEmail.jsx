import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { authApi } from '../services/authService';
import { Loader2, CheckCircle2, XCircle, Mail, ArrowRight } from 'lucide-react';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const verifiedRef = useRef(false);

  const userId = searchParams.get('userId');
  const token = searchParams.get('token');

  useEffect(() => {
    const verify = async () => {
      // If already verified or currently verifying, skip
      if (verifiedRef.current) return;
      
      if (!userId || !token) {
        console.error('Missing verification params:', { userId, token });
        setStatus('error');
        setMessage('Thông tin xác thực không hợp lệ.');
        return;
      }

      // Lock immediately to prevent double calls (especially in Strict Mode)
      verifiedRef.current = true;

      try {
        // Clean token: convert spaces (from browser URL parsing) back to '+'
        const cleanedToken = token.trim().replace(/\s/g, '+');
        console.log('Verifying email with cleaned data:', { userId, token: cleanedToken });
        
        await authApi.verifyEmail(userId, cleanedToken);
        setStatus('success');
        setMessage('Email của bạn đã được xác thực thành công!');
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage(error.message || 'Xác thực email thất bại. Token có thể đã hết hạn.');
        // Optional: Reset lock on error if you want to allow retry on mount
        // verifiedRef.current = false;
      }
    };

    verify();
  }, [userId, token]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-inter">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 md:p-10 border border-gray-100 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
            <Mail size={32} />
          </div>
        </div>

        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Xác thực Email</h2>
        
        {status === 'loading' && (
          <div className="flex flex-col items-center py-8">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
            <p className="text-gray-500 font-medium">Đang tiến hành xác thực...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="py-6">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="text-green-500" size={60} />
            </div>
            <p className="text-gray-600 font-medium mb-8 leading-relaxed">
              {message}
            </p>
            <Link
              to="/login"
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-blue-200"
            >
              Đăng nhập ngay
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="py-6">
            <div className="flex justify-center mb-4">
              <XCircle className="text-red-500" size={60} />
            </div>
            <p className="text-gray-600 font-medium mb-8 leading-relaxed">
              {message}
            </p>
            <Link
              to="/register"
              className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2 group"
            >
              Quay lại đăng ký
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
