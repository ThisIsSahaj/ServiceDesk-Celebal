
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Ticket, Loader2, GalleryVerticalEnd } from 'lucide-react';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { loginWithGoogle, loading: authLoading, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const success = await loginWithGoogle();
    if (success) {
      // Navigation will be handled by the useEffect above
      console.log('Login successful, user will be redirected to dashboard');
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        {/* <LoginForm /> */}
        <div className="flex flex-col gap-6">
          <form>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2">

                <div className="flex h-8 w-8 items-center justify-center rounded-md">
                  <GalleryVerticalEnd className="size-6" />
                </div>
                <span className="sr-only">ServiceDesk</span>
                <h1 className="text-xl font-bold">Welcome back to ServiceDesk</h1>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <a href="/register" className="underline underline-offset-4">
                    Sign up
                  </a>

                </div>
              </div>

              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              </div>
              <div className="grid gap-4 sm:grid-cols-1">
                <Button
                  onClick={handleGoogleLogin}
                  disabled={isLoading || authLoading}
                  variant="outline"
                  className="w-full">

                  {isLoading || authLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path
                          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                          fill="currentColor"
                        />
                      </svg>
                      <p>Continue with Google</p>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary  ">
            By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
            and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div >
    </div >
  );
};

export default Login;