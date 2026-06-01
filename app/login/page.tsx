"use client";
import { Button, Form, Input, useToast } from "blunt-ui";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

const Login = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [login, setLogin] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (email: string, pass: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    setIsLoading(false);
    if (error) {
      toast.error(`Login action failed. ${error.message}`);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  const handleLogin = () => signIn(login, password);

  const handleDemoLogin = () => {
    const email = process.env.NEXT_PUBLIC_DEMO_EMAIL;
    const pass = process.env.NEXT_PUBLIC_DEMO_PASSWORD;
    if (!email || !pass) {
      toast.error("Demo account not configured.");
      return;
    }
    signIn(email, pass);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Form onSubmit={handleLogin} style={{ width: "50%" }}>
        <h1>Login to your account</h1>

        <Input
          name="login"
          label="Login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />

        <Input
          name="password"
          label="Password"
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" isLoading={isLoading}>Log in</Button>
        <Button type="button" variant="secondary" onClick={handleDemoLogin} isLoading={isLoading}>
          Try demo
        </Button>
      </Form>
    </div>
  );
};

export default Login;
