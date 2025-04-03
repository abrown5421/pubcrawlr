import React from 'react';
import AnimatedContainer from "../containers/AnimatedContainer";
import { useAppSelector } from "../store/hooks";

type AuthProps = {
  mode: 'login' | 'signup';
};

const Auth: React.FC<AuthProps> = ({ mode }) => {
  const enter = useAppSelector(state => state.activePage)
  return (
    <AnimatedContainer isEntering={enter.In && enter.Name === 'Auth'}>
      <div>
        <h1>{mode === 'login' ? 'Login Page' : 'Signup Page'}</h1>
      </div>
    </AnimatedContainer>
  );
};
 
export default Auth;

