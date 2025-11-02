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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";
import { PasswordVisibilityToggle } from "@/components/compositions/PasswordVisibilityToggle";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, SignUpInput } from "@/lib/validation/auth";
import { useMutation } from "@tanstack/react-query";

// API response structure from /api/auth/signup
export interface SignUpApiResponse {
  message: string;
  userCreated: boolean;
  emailSent: boolean;
  email?: string;
}

interface ResendApiResponse {
  message: string;
}

interface SignUpFormProps {
  // Called only when an email (initial or resent) is successfully dispatched
  onSignUpSuccess: (message: string, email: string) => void;
  onSwitchToLogin: (emailToPreFill?: string) => void;
}

interface SignUpErrorResponse {
  message: string;
  errors?: { email?: string[]; password?: string[] /* ... */ };
}

type UIState =
  | "idle"
  | "awaitingResend"
  | "resendLoading"
  | "resendSuccess"
  | "resendError"
  | "signupLoading";

export function SignUpForm({
  onSignUpSuccess,
  onSwitchToLogin,
}: SignUpFormProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [uiState, setUiState] = React.useState<UIState>("idle");
  const [feedbackMessage, setFeedbackMessage] = React.useState<string | null>(
    null
  );
  const [userEmailForResend, setUserEmailForResend] = React.useState<
    string | null
  >(null);

  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  // Mutation for the initial signup
  const signUpMutation = useMutation<
    SignUpApiResponse,
    Error & { data?: SignUpErrorResponse },
    SignUpInput
  >({
    mutationFn: async (data: SignUpInput) => {
      setUiState("signupLoading");
      setFeedbackMessage(null);
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const responseData: SignUpApiResponse | SignUpErrorResponse =
        await response.json();
      if (!response.ok) {
        const error = new Error(
          (responseData as SignUpErrorResponse).message || "Sign up failed"
        ) as Error & { data?: SignUpErrorResponse };
        error.data = responseData as SignUpErrorResponse;
        throw error;
      }
      return responseData as SignUpApiResponse;
    },
    onSuccess: (data, variables) => {
      // variables is SignUpInput
      if (data.userCreated && data.emailSent) {
        setUiState("idle"); // Or a specific success state before parent handles it
        onSignUpSuccess(data.message, variables.email); // Notify parent to switch
        form.reset();
      } else if (data.userCreated && !data.emailSent) {
        setUiState("awaitingResend");
        setFeedbackMessage(data.message); // "Account created, but issue sending email..."
        setUserEmailForResend(variables.email); // Store email for resend
      } else {
        // Should not happen if userCreated is true based on API response
        setUiState("idle");
        setFeedbackMessage(data.message || "An unexpected issue occurred.");
      }
    },
    onError: (error: Error & { data?: SignUpErrorResponse }) => {
      setUiState("idle");
      form.clearErrors();
      const apiErrorData = error.data;
      if (
        apiErrorData?.message?.toLowerCase().includes("email already exists")
      ) {
        form.setError("email", {
          type: "manual",
          message: apiErrorData.message,
        });
      } else {
        form.setError("root.serverError", {
          type: "manual",
          message: apiErrorData?.message || error.message || "Sign up failed.",
        });
      }
    },
  });

  const resendVerificationMutation = useMutation<
    ResendApiResponse,
    Error,
    { email: string }
  >({
    mutationFn: async (data: { email: string }) => {
      setUiState("resendLoading");
      setFeedbackMessage(null);
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || "Failed to resend email.");
      }
      return responseData;
    },
    onSuccess: (data) => {
      setUiState("resendSuccess");
      setFeedbackMessage(data.message + " You can now try signing in."); // "New verification email sent..."
      // Now that an email is presumably sent, notify parent
      if (userEmailForResend) {
        // Pass a slightly different message perhaps, or just the API's
        onSignUpSuccess(data.message, userEmailForResend);
      }
    },
    onError: (error: Error) => {
      setUiState("resendError");
      setFeedbackMessage(
        error.message || "An unexpected error occurred while resending."
      );
    },
  });

  const onSubmit = (data: SignUpInput) => {
    setFeedbackMessage(null);
    signUpMutation.mutate(data);
  };

  const handleResendVerification = () => {
    if (userEmailForResend) {
      resendVerificationMutation.mutate({ email: userEmailForResend });
    }
  };

  const isLoading =
    signUpMutation.isPending || resendVerificationMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {feedbackMessage && (
          <Alert
            variant={
              uiState === "awaitingResend" || uiState === "resendError"
                ? "destructive" // Or "warning" for awaitingResend
                : uiState === "resendSuccess"
                ? "default" // Shadcn default is often blueish/neutral, green might be better
                : "default"
            }
            className={`mb-4 ${
              uiState === "resendSuccess"
                ? "bg-green-50 border-green-400 text-green-700"
                : ""
            }`}
          >
            {uiState === "awaitingResend" || uiState === "resendError" ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            <AlertTitle>
              {uiState === "awaitingResend"
                ? "Action Required"
                : uiState === "resendSuccess"
                ? "Email Sent"
                : uiState === "resendError"
                ? "Error"
                : "Notification"}
            </AlertTitle>
            <AlertDescription>{feedbackMessage}</AlertDescription>
          </Alert>
        )}

        {uiState !== "awaitingResend" &&
          uiState !== "resendSuccess" &&
          uiState !== "resendLoading" && (
            <>
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
                        disabled={isLoading}
                      />
                    </FormControl>{" "}
                    <FormMessage />{" "}
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
                      {" "}
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                          disabled={isLoading}
                          className="pr-10"
                        />
                      </FormControl>{" "}
                      <PasswordVisibilityToggle
                        show={showPassword}
                        onToggle={() => setShowPassword((p) => !p)}
                        disabled={isLoading}
                        ariaLabelBase="password"
                      />
                    </div>{" "}
                    <FormMessage />{" "}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <div className="relative">
                      {" "}
                      <FormControl>
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                          disabled={isLoading}
                          className="pr-10"
                        />
                      </FormControl>{" "}
                      <PasswordVisibilityToggle
                        show={showConfirmPassword}
                        onToggle={() => setShowConfirmPassword((p) => !p)}
                        disabled={isLoading}
                        ariaLabelBase="confirm password"
                      />
                    </div>{" "}
                    <FormMessage />{" "}
                  </FormItem>
                )}
              />
            </>
          )}

        {form.formState.errors.root?.serverError && (
          <p className="text-sm font-medium text-destructive">
            {form.formState.errors.root.serverError.message}
          </p>
        )}

        <div className="flex flex-col gap-2 pt-2">
          {uiState === "idle" || uiState === "signupLoading" ? (
            <Button type="submit" disabled={isLoading}>
              {signUpMutation.isPending
                ? "Creating Account..."
                : "Create Account"}
            </Button>
          ) : null}

          {uiState === "awaitingResend" || uiState === "resendError" ? (
            <Button
              type="button"
              onClick={handleResendVerification}
              disabled={isLoading}
            >
              {resendVerificationMutation.isPending
                ? "Resending..."
                : "Resend Verification Email"}
            </Button>
          ) : null}
          {uiState === "resendSuccess" && (
            <Button
              type="button"
              onClick={() => {
                if (userEmailForResend) {
                  onSwitchToLogin(userEmailForResend);
                }
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              Proceed to Sign In
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
