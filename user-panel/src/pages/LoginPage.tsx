import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const LoginPage = () => {
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormState(prevState => ({ ...prevState, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isLogin) {
        await login(formState.email, formState.password);
        toast.success("Logged in successfully!");
      } else {
        await signup(formState.email, formState.password);
        toast.success("Account created successfully!");
      }
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Authentication failed.", { description: "Please check your credentials or try again later." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted">
      <Card className="w-full max-w-md bg-gradient-card shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">
            {isLogin ? "Welcome Back" : "Join Us"}
          </CardTitle>
          <CardDescription>
            {isLogin 
              ? "Sign in to access the full dashboard."
              : "Create an account to start reporting potholes."
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formState.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={formState.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-primary" disabled={isLoading}>
              {isLoading ? (isLogin ? "Logging in..." : "Signing up...") : (isLogin ? "Login" : "Sign Up")}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              disabled={isLoading}
            >
              {isLogin ? "Sign Up" : "Login"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
