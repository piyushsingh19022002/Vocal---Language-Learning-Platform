import React from 'react';
import Header from '../components/Header';
import Login from '../components/Login';

const SignUpPage = () => {
  return (
    <div>
      <Header />
      <Login isLogin={false} />
    </div>
  );
};

export default SignUpPage;

