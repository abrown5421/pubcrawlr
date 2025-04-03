import React from 'react';
import AnimatedContainer from "../containers/AnimatedContainer";

type AuthProps = {
  mode: 'login' | 'signup';
};

const Auth: React.FC<AuthProps> = ({ mode }) => {
  return (
    <AnimatedContainer isEntering={true}>
      <div>
        <h1>{mode === 'login' ? 'Login Page' : 'Signup Page'}</h1>
      </div>
    </AnimatedContainer>
  );
};
 
export default Auth;

