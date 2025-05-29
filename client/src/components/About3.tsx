import React from 'react'
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

// Define the type for the component's props
interface MyComponentProps {
  children: ReactNode; // This makes sure children are expected
}



const About3: React.FC<MyComponentProps> = ({children}) => {

  const isAuthenticated = true; 

  if (!isAuthenticated) {
    
    return <Navigate to="/login" />;
  }

  return children; 
};


export default About3
