import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const { loginWithToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');

      if (token) {
        await loginWithToken(token);
        navigate('/home'); 
      } else {
        // Handle case where token is missing
        console.error("No token found in callback URL");
        navigate('/'); // Redirect to login page on error
      }
    };

    handleAuth();
  }, [loginWithToken, location.search, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="h-16 w-16 animate-spin" />
      <p className="ml-4 text-lg">Finalizing your login...</p>
    </div>
  );
};

export default AuthCallback;