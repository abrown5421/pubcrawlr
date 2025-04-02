import React from 'react';

type AuthProps = {
  mode: 'login' | 'signup';
};

const Auth: React.FC<AuthProps> = ({ mode }) => {
  return (
    <div>
      <h1>{mode === 'login' ? 'Login Page' : 'Signup Page'}</h1>
    </div>
  );
};
 
export default Auth;
