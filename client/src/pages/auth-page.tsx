import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth, loginSchema, registerSchema } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { z } from "zod";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();
  
  // Redirect if already logged in
  if (user) {
    setLocation("/");
    return null;
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl transform translate-x-1/3 translate-y-1/3"></div>
      </div>
      
      <div className="container flex flex-col lg:flex-row max-w-6xl items-center justify-center z-10">
        {/* Hero section */}
        <div className="flex-1 text-center lg:text-left mb-8 lg:mb-0 lg:pr-12">
          <h1 className="text-5xl font-bold font-['Orbitron'] bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-700 mb-4">
            GameMode
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Transform your productivity into an epic adventure
          </p>
          <div className="space-y-4 text-gray-400">
            <div className="flex items-center justify-center lg:justify-start">
              <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center mr-3">
                <span className="text-red-500">✓</span>
              </div>
              <p>Complete tasks to earn XP and level up</p>
            </div>
            <div className="flex items-center justify-center lg:justify-start">
              <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center mr-3">
                <span className="text-red-500">✓</span>
              </div>
              <p>Maintain daily streaks for bonus rewards</p>
            </div>
            <div className="flex items-center justify-center lg:justify-start">
              <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center mr-3">
                <span className="text-red-500">✓</span>
              </div>
              <p>Focus mode to maximize productivity</p>
            </div>
          </div>
        </div>

        {/* Auth forms */}
        <div className="w-full max-w-md">
          <Card className="border-red-900/50 bg-black shadow-xl">
            <CardHeader>
              <Tabs value={tab} onValueChange={(value) => setTab(value as "login" | "register")}>
                <TabsList className="w-full grid grid-cols-2 bg-gray-950/80">
                  <TabsTrigger value="login" className="data-[state=active]:bg-red-950/50 data-[state=active]:text-white">Login</TabsTrigger>
                  <TabsTrigger value="register" className="data-[state=active]:bg-red-950/50 data-[state=active]:text-white">Register</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="pt-4">
                  <CardTitle className="text-xl text-white">Welcome back</CardTitle>
                  <CardDescription>Enter your credentials to access your account</CardDescription>
                </TabsContent>
                
                <TabsContent value="register" className="pt-4">
                  <CardTitle className="text-xl text-white">Create an account</CardTitle>
                  <CardDescription>Join GameMode and start your productivity journey</CardDescription>
                </TabsContent>
              </Tabs>
            </CardHeader>
            
            <CardContent>
              {tab === "login" ? (
                <LoginForm onSubmit={(data) => loginMutation.mutate(data)} isLoading={loginMutation.isPending} />
              ) : (
                <RegisterForm onSubmit={(data) => registerMutation.mutate(data)} isLoading={registerMutation.isPending} />
              )}
            </CardContent>
            
            <CardFooter className="justify-center">
              <Button
                variant="link"
                onClick={() => setTab(tab === "login" ? "register" : "login")}
                className="text-gray-400 hover:text-red-400"
              >
                {tab === "login" 
                  ? "Don't have an account? Register" 
                  : "Already have an account? Login"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

type LoginFormProps = {
  onSubmit: (data: z.infer<typeof loginSchema>) => void;
  isLoading: boolean;
};

function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-200">Username</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter your username" 
                  className="bg-gray-950 border-gray-800" 
                  {...field} 
                />
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
              <FormLabel className="text-gray-200">Password</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="Enter your password" 
                  className="bg-gray-950 border-gray-800" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-red-800 to-red-600 text-white" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </Form>
  );
}

type RegisterFormProps = {
  onSubmit: (data: z.infer<typeof registerSchema>) => void;
  isLoading: boolean;
};

function RegisterForm({ onSubmit, isLoading }: RegisterFormProps) {
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-200">Username</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Choose a username" 
                  className="bg-gray-950 border-gray-800" 
                  {...field} 
                />
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
              <FormLabel className="text-gray-200">Password</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="Choose a password" 
                  className="bg-gray-950 border-gray-800" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-200">Confirm Password</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="Confirm your password" 
                  className="bg-gray-950 border-gray-800" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-red-800 to-red-600 text-white" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Register"
          )}
        </Button>
      </form>
    </Form>
  );
}