import { Navigate } from 'react-router-dom';

import { useUserAuth } from './context/UserAuthContext';

function ProtectedRoute({ children }) {
  const user = useUserAuth;



 if (!user) {
    // Redirect to the login page if the user is not authenticated
    return <Navigate to="/" />;
  }

  return children;
 
}
 
export default ProtectedRoute;
