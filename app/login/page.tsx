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

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: login,
      password,
    });
    if (error) {
      toast.error(`Logic action failed. ${error.message}`);
    } else {
      router.push("/");
      router.refresh();
    }
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

        <Button type="submit">Log in</Button>
      </Form>
    </div>
  );
};

export default Login;
