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
import { useMutation } from "@tanstack/react-query";
import { forgotPasswordSchema, ForgotPasswordInput } from "@/lib/validation/auth";

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
  onResetEmailSent: (email: string) => void;
  initialEmail?: string;
}

export function ForgotPasswordForm({
  onBackToLogin,
  onResetEmailSent,
  initialEmail,
}: ForgotPasswordFormProps) {

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: initialEmail || "",
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: ForgotPasswordInput) => {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ message: "An unknown error occurred" }));
        throw new Error(errorData.message || `Request failed with status ${res.status}`);
      }

      return res.json();
    },
    onSuccess: (data, variables) => {
      onResetEmailSent(variables.email);
    },
    onError: (error: Error) => {
      form.setError("root.serverError", {
        type: "manual",
        message: error.message,
      });
    },
  });

  const onSubmit = (data: ForgotPasswordInput) => {
    form.clearErrors("root.serverError");
    forgotPasswordMutation.mutate(data);
  };

  return (
    <div className="space-y-4">
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

          {form.formState.errors.root?.serverError && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.root.serverError.message}
            </p>
          )}

          <div className="flex flex-col gap-2 pt-2">
            <Button type="submit" disabled={forgotPasswordMutation.isPending}>
              {forgotPasswordMutation.isPending ? "Sending..." : "Send Reset Link"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}