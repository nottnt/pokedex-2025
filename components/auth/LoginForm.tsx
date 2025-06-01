// src/components/auth/LoginForm.tsx (or your preferred path)
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordVisibilityToggle } from "@/components/compositions/PasswordVisibilityToggle";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { loginSchema, LoginInput } from "@/lib/validation/auth";
import { useMutation } from "@tanstack/react-query";

interface LoginFormProps {
  onLoginSuccess: () => void;
  onSwitchToSignUp: () => void;
}

export function LoginForm({
  onLoginSuccess,
  onSwitchToSignUp,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginInput) => {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (!res?.ok) {
        form.setError("root.serverError", {
          type: "manual",
          message: "Invalid email or password. Please try again.",
        });
        throw new Error("Invalid credentials");
      }
      return res;
    },
    onSuccess: () => {
      onLoginSuccess();
    },
  });

  const onSubmit = (data: LoginInput) => {
    form.clearErrors("root.serverError");
    loginMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="example@email.com"
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
              <FormLabel>Password</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <PasswordVisibilityToggle
                  show={showPassword}
                  onToggle={() => setShowPassword((prev) => !prev)}
                  disabled={loginMutation.isPending}
                  ariaLabelBase="confirm password"
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root?.serverError && (
          <p className="text-sm font-medium text-destructive">
            {form.formState.errors.root.serverError.message}
          </p>
        )}

        <div className="flex flex-col gap-2 pt-2">
          <Button type="submit" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? "Signing In..." : "Sign In"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => signIn("google", { callbackUrl: "/" })} // Assuming redirect happens globally or handled by next-auth
            disabled={loginMutation.isPending}
          >
            Sign in with Google
          </Button>
        </div>
      </form>
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Button
          variant="link"
          className="p-0 h-auto font-semibold"
          onClick={onSwitchToSignUp}
          disabled={loginMutation.isPending}
        >
          Sign Up
        </Button>
      </div>
    </Form>
  );
}
