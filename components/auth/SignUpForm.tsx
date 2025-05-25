// src/components/auth/SignUpForm.tsx (or your preferred path)
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

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, SignUpInput } from "@/lib/validation/auth";
import { useMutation } from "@tanstack/react-query";

interface SignUpFormProps {
  onSignUpSuccess: (email: string) => void;
  onSwitchToLogin: () => void;
}

export function SignUpForm({
  onSignUpSuccess,
  onSwitchToLogin,
}: SignUpFormProps) {
  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const signUpMutation = useMutation({
    mutationFn: async (data: SignUpInput) => {
      // Replace with your actual API call for sign up
      console.log("Signing up with:", data);
      // Example:
      // const response = await fetch('/api/auth/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
      // });
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   if (response.status === 409) { // Example: Conflict for existing email
      //      form.setError("email", { type: "manual", message: errorData.message || "Email already exists." });
      //   } else {
      //      form.setError("root.serverError", { type: "manual", message: errorData.message || "Sign up failed." });
      //   }
      //   throw new Error(errorData.message || "Sign up failed");
      // }
      // return response.json();

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (data.email === "exists@example.com") {
        form.setError("email", {
          type: "manual",
          message: "This email is already registered.",
        });
        throw new Error("User already exists");
      }
      return { message: "Sign up successful!", email: data.email };
    },
    onSuccess: (data) => {
      onSignUpSuccess(data.email);
    },
    onError: (error: any) => {
      // Generic error if not handled by field-specific errors in mutationFn
      if (
        error.message &&
        !form.formState.errors.email &&
        !form.formState.errors.root?.serverError
      ) {
        form.setError("root.serverError", {
          type: "manual",
          message: error.message || "Sign up failed. Please try again.",
        });
      }
    },
  });

  const onSubmit = (data: SignUpInput) => {
    form.clearErrors("root.serverError");
    form.clearErrors("email"); // Clear previous email error if any
    signUpMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
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
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
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
          <Button type="submit" disabled={signUpMutation.isPending}>
            {signUpMutation.isPending
              ? "Creating Account..."
              : "Create Account"}
          </Button>
        </div>
      </form>
      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Button
          variant="link"
          className="p-0 h-auto font-semibold"
          onClick={onSwitchToLogin}
          disabled={signUpMutation.isPending}
        >
          Sign In
        </Button>
      </div>
    </Form>
  );
}
