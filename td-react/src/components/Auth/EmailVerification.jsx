// src/components/Auth/EmailVerification.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './EmailVerification.css';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState('verifying');
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`http://localhost:8010/auth/verify-email/${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setVerificationStatus('success');
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          setVerificationStatus('error');
        }
      } catch (error) {
        setVerificationStatus('error');
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setVerificationStatus('error');
    }
  }, [token, navigate]);

  return (
    <div className="verification-container">
      <div className="verification-card">
        {verificationStatus === 'verifying' && (
          <div className="verification-status">
            <div className="loader"></div>
            <p>Verifying your email address...</p>
          </div>
        )}

        {verificationStatus === 'success' && (
          <div className="verification-status success">
            <div className="icon success-icon">✓</div>
            <h2>Email Verified!</h2>
            <p>Your email has been successfully verified.</p>
            <p className="redirect-text">Redirecting to login page...</p>
          </div>
        )}

        {verificationStatus === 'error' && (
          <div className="verification-status error">
            <div className="icon error-icon">×</div>
            <h2>Verification Failed</h2>
            <p>Sorry, we couldn't verify your email address.</p>
            <button onClick={() => navigate('/login')} className="return-button">
              Return to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;