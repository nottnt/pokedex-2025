// src/components/auth/RequestVerificationEmailForm.tsx
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, XCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  requestVerificationEmailSchema,
  RequestVerificationEmailInput,
} from "@/lib/validation/auth"; // Ensure this path is correct

interface ResendApiResponse {
  message: string;
}

interface RequestVerificationEmailFormProps {
  initialEmail?: string;
  onSuccess?: (message: string, email?: string) => void; // Callback for parent on success
  // Optional: if you want a dedicated cancel button handled by parent in dialog context
  // onCancel?: () => void;
  submitButtonText?: string;
  showCancelButton?: boolean;
  onCancelText?: string;
}

export function RequestVerificationEmailForm({
  initialEmail = "",
  onSuccess,
  submitButtonText = "Send Link",
}: RequestVerificationEmailFormProps) {
  const [apiMessage, setApiMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const form = useForm<RequestVerificationEmailInput>({
    resolver: zodResolver(requestVerificationEmailSchema),
    defaultValues: {
      email: initialEmail,
    },
  });

  // Effect to update form default value if initialEmail prop changes
  React.useEffect(() => {
    form.reset({ email: initialEmail });
  }, [initialEmail, form]);

  const mutation = useMutation<
    ResendApiResponse,
    Error,
    RequestVerificationEmailInput
  >({
    mutationFn: async (data: RequestVerificationEmailInput) => {
      setApiMessage(null);
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(
          responseData.message || "Failed to send verification email."
        );
      }
      return responseData;
    },
    onSuccess: (data, variables) => {
      const successText =
        data.message ||
        "If an account exists and needs verification, a new email has been sent.";
      setApiMessage({ type: "success", text: successText });
      form.reset({ email: variables.email }); // Keep email in form or clear: form.reset();
      if (onSuccess) {
        onSuccess(successText);
      }
    },
    onError: (error: Error) => {
      setApiMessage({
        type: "error",
        text: error.message || "An unexpected error occurred.",
      });
    },
  });

  const onSubmit = (data: RequestVerificationEmailInput) => {
    mutation.mutate(data);
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
                  placeholder="you@example.com"
                  {...field}
                  disabled={mutation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {apiMessage && (
          <Alert
            variant={apiMessage.type === "success" ? "default" : "destructive"}
            className={`p-3 ${
              apiMessage.type === "success"
                ? "bg-green-50 border-green-300 text-green-700 dark:bg-green-900/30 dark:border-green-700 dark:text-green-400"
                : "bg-red-50 border-red-300 text-red-700 dark:bg-red-900/30 dark:border-red-700 dark:text-red-400"
            }`}
          >
            {apiMessage.type === "success" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            <AlertDescription className="ml-2">
              {apiMessage.text}
            </AlertDescription>
          </Alert>
        )}
        <Button type="submit" disabled={mutation.isPending} className="w-full">
          {mutation.isPending ? "Sending..." : submitButtonText}
        </Button>
      </form>
    </Form>
  );
}
