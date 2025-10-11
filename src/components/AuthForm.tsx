import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import bcrypt from "bcryptjs";

// Define a type for the user data stored in localStorage
type StoredUser = {
  name: string;
  email: string;
  hashedPassword: string;
};

// Schema for sign-up, including the name field
const signUpSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character",
    }),
});

// Schema for sign-in, which doesn't require the name
const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

// Create inferred types from the schemas
type SignUpValues = z.infer<typeof signUpSchema>;
type SignInValues = z.infer<typeof signInSchema>;

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<SignUpValues | SignInValues>({
    resolver: zodResolver(isSignUp ? signUpSchema : signInSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignUpValues | SignInValues) => {
    const users: StoredUser[] = JSON.parse(
      localStorage.getItem("linkledge_users") || "[]"
    );

    if (isSignUp) {
      // Sign Up Logic
      const signUpValues = values as SignUpValues;
      const existingUser = users.find(
        (user) => user.email === signUpValues.email
      );
      if (existingUser) {
        toast({
          title: "Error",
          description: "An account with this email already exists.",
          variant: "destructive",
        });
        return;
      }

      const hashedPassword = await bcrypt.hash(signUpValues.password, 10);
      const newUser: StoredUser = {
        name: signUpValues.name,
        email: signUpValues.email,
        hashedPassword,
      };
      users.push(newUser);
      localStorage.setItem("linkledge_users", JSON.stringify(users));

      login({ name: newUser.name, email: newUser.email });
      toast({
        title: "Account created",
        description: "You have been successfully signed up.",
      });
      navigate("/home");
    } else {
      // Sign In Logic
      const signInValues = values as SignInValues;
      const user = users.find((user) => user.email === signInValues.email);
      if (!user) {
        toast({
          title: "Error",
          description: "Invalid email or password.",
          variant: "destructive",
        });
        return;
      }

      const isPasswordValid = await bcrypt.compare(
        signInValues.password,
        user.hashedPassword
      );
      if (!isPasswordValid) {
        toast({
          title: "Error",
          description: "Invalid email or password.",
          variant: "destructive",
        });
        return;
      }

      login({ name: user.name, email: user.email });
      toast({
        title: "Signed in",
        description: "You have been successfully signed in.",
      });
      navigate("/home");
    }
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-3xl font-bold mb-4">
        {isSignUp ? "Join LinkLedge" : "Sign in"}
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {isSignUp && (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john.doe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder={
                        isSignUp
                          ? "8+ characters, 1 uppercase, 1 number, 1 special"
                          : "Password"
                      }
                      {...field}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-1/2 right-2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            {isSignUp ? "Join now" : "Sign in"}
          </Button>
        </form>
      </Form>
      <p className="text-center text-sm text-muted-foreground mt-4">
        {isSignUp ? "Already on LinkLedge?" : "New to LinkLedge?"}{" "}
        <Button
          variant="link"
          className="p-0 h-auto"
          onClick={() => {
            setIsSignUp(!isSignUp);
            form.reset();
          }}
        >
          {isSignUp ? "Sign in" : "Join now"}
        </Button>
      </p>
    </div>
  );
};

export default AuthForm;