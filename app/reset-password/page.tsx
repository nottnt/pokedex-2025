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
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { resetPasswordSchema, ResetPasswordInput } from "@/lib/validation/auth";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isResetSuccessful, setIsResetSuccessful] = React.useState(false);

  // Validate token on page load
  const { isLoading: isValidatingToken, error: tokenError } = useQuery({
    queryKey: ["validate-reset-token", token],
    queryFn: async () => {
      if (!token) throw new Error("No reset token provided");

      const res = await fetch(`/api/auth/reset-password?token=${token}`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "Invalid token" }));
        throw new Error(errorData.message);
      }
      return res.json();
    },
    enabled: !!token,
    retry: false,
  });

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      token: token || "",
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ResetPasswordInput) => {
      if (!token) throw new Error("No reset token provided");

      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, token }),
      });

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ message: "An unknown error occurred" }));
        throw new Error(errorData.message || `Request failed with status ${res.status}`);
      }

      return res.json();
    },
    onSuccess: () => {
      setIsResetSuccessful(true);
    },
    onError: (error: Error) => {
      form.setError("root.serverError", {
        type: "manual",
        message: error.message,
      });
    },
  });

  const onSubmit = (data: ResetPasswordInput) => {
    form.clearErrors("root.serverError");
    resetPasswordMutation.mutate(data);
  };

  // Loading state while validating token
  if (isValidatingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full space-y-4 p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Validating Reset Link...</h1>
            <p className="text-muted-foreground">Please wait while we verify your reset token.</p>
          </div>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (tokenError || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full space-y-4 p-6">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-destructive">Invalid Reset Link</h1>
            <p className="text-muted-foreground">
              {tokenError?.message || "The password reset link is invalid or has expired."}
            </p>
            <p className="text-sm text-muted-foreground">
              Please request a new password reset link if you still need to reset your password.
            </p>
            <Link href="/">
              <Button className="w-full">Back to Login</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (isResetSuccessful) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full space-y-4 p-6">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-green-600">Password Reset Successful!</h1>
            <p className="text-muted-foreground">
              Your password has been reset successfully. You can now sign in with your new password.
            </p>
            <Link href="/">
              <Button className="w-full">Go to Login</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-4 p-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Reset Your Password</h1>
          <p className="text-muted-foreground">
            Enter your new password below.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <PasswordVisibilityToggle
                      show={showPassword}
                      onToggle={() => setShowPassword((prev) => !prev)}
                      disabled={resetPasswordMutation.isPending}
                      ariaLabelBase="new password"
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <PasswordVisibilityToggle
                      show={showConfirmPassword}
                      onToggle={() => setShowConfirmPassword((prev) => !prev)}
                      disabled={resetPasswordMutation.isPending}
                      ariaLabelBase="confirm new password"
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
              <Button type="submit" disabled={resetPasswordMutation.isPending}>
                {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
              </Button>
              <Link href="/">
                <Button
                  type="button"
                  variant="outline"
                  disabled={resetPasswordMutation.isPending}
                  className="w-full"
                >
                  Back to Login
                </Button>
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}