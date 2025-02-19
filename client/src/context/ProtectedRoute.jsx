import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const currentUser = useSelector((state) => state.user.currentUser);

  console.log("ProtectedRoute: currentUser =", currentUser);

  if (!currentUser) {
    // User is not authenticated
    return <Navigate to="/sign-in" />;
  }

  // User is authenticated
  return children;
};

export default ProtectedRoute;
