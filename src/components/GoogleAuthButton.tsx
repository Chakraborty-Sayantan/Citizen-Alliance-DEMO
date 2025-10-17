import { Button } from "@/components/ui/button";
import GoogleIcon from '@mui/icons-material/Google';

interface GoogleAuthButtonProps {
  mode: "signin" | "signup";
}

const GoogleAuthButton = ({ mode }: GoogleAuthButtonProps) => {
  const handleGoogleAuth = () => {
    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    window.location.href = `${backendUrl}/api/auth/google`;
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={handleGoogleAuth}
    >
      <GoogleIcon className="mr-2 h-4 w-4" />
      {mode === "signin" ? "Sign in with Google" : "Sign up with Google"}
    </Button>
  );
};

export default GoogleAuthButton;