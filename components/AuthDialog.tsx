"use client";

import * as React from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm"; // Adjust path
import { SignUpForm } from "@/components/auth/SignUpForm"; // Adjust path

// You would typically control the dialog's open/closed state from a parent component
// and pass `onOpenChange` to Dialog or DialogContent if it supports it.
// For this example, we assume this AuthDialog is rendered when it's meant to be open.

export function AuthDialog() {
  const router = useRouter();
  const [isSignUpMode, setIsSignUpMode] = React.useState(false);
  const [initialEmail, setInitialEmail] = React.useState<string | undefined>(
    undefined
  );

  const handleLoginSuccess = () => {
    // Here you might want to close the dialog.
    // This depends on how your dialog is managed (e.g., zustand, context, props).
    // For now, we just redirect.
    console.log("Login successful, redirecting...");
    router.push("/"); // Or to a dashboard
    router.refresh(); // To ensure server components update if needed
  };

  const handleSignUpSuccess = (email: string) => {
    alert("Sign up successful! Please sign in."); // Replace with a toast notification
    setInitialEmail(email); // Save email to pre-fill in login form
    setIsSignUpMode(false); // Switch to login mode
  };

  const switchToSignUp = () => {
    setInitialEmail(undefined); // Clear any pre-filled email
    setIsSignUpMode(true);
  };
  const switchToLogin = () => setIsSignUpMode(false);

  // To use the pre-filled email, LoginForm would need to be modified
  // to accept an `initialEmail` prop and use it in `defaultValues`.
  // For simplicity, the current LoginForm doesn't have this, but it's a common pattern.
  // If `LoginForm` was updated:
  // const loginFormKey = initialEmail ? `login-${initialEmail}` : 'login';
  // <LoginForm key={loginFormKey} initialEmail={initialEmail} ... />

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>
          {isSignUpMode ? "Create an Account" : "Sign In"}
        </DialogTitle>
        <DialogDescription>
          {isSignUpMode
            ? "Enter your details below to create a new account."
            : "Access your account or sign in with Google."}
        </DialogDescription>
      </DialogHeader>

      {isSignUpMode ? (
        <SignUpForm
          onSignUpSuccess={handleSignUpSuccess}
          onSwitchToLogin={switchToLogin}
        />
      ) : (
        // To pass initialEmail to LoginForm, you'd modify LoginForm:
        // 1. Add `initialEmail?: string` to its props.
        // 2. Update `defaultValues` in LoginForm: `email: props.initialEmail || "", password: ""`.
        // 3. Add a `key` to `<LoginForm>` to ensure it re-initializes with new defaultValues if initialEmail changes.
        //    e.g. <LoginForm key={initialEmail} initialEmail={initialEmail} ... />
        // For this example, we keep LoginForm simpler and don't pre-fill.
        <LoginForm
          onLoginSuccess={handleLoginSuccess}
          onSwitchToSignUp={switchToSignUp}
        />
      )}
    </DialogContent>
  );
}
