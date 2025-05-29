import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const Login = () => {
  const { signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      toast({
        title: 'Success',
        description: 'You have successfully signed in',
      });
    } catch (error) {
      // toast({
      //   title: 'Error',
      //   description: 'Failed to sign in with Google',
      //   variant: 'destructive',
      // });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <Card className="w-[350px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Animal Feeding Calculator</CardTitle>
          <CardDescription className="text-center">Sign in to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <img 
              src="/placeholder.svg" 
              alt="Farm logo" 
              className="w-32 h-32 mb-4" 
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full bg-green-600 hover:bg-green-700" 
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in with Google'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
