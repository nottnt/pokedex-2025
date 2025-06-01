// components/AuthDialog.tsx
"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"; // Import Button if needed for mode switching
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { RequestVerificationEmailForm } from "@/components/auth/RequestVerificationEmailForm"; // Import the new form

type AuthMode = "login" | "signup" | "requestVerification"; // Updated type

export function AuthDialog() {
  const router = useRouter();
  // Updated state: from isSignUpMode (boolean) to authMode (string literal)
  const [authMode, setAuthMode] = React.useState<AuthMode>("login");
  const [initialEmail, setInitialEmail] = React.useState<string>(""); // Keep this for pre-filling

  const handleLoginSuccess = () => {
    toast.success("Login Successful!", { description: "Welcome back." });
    router.push("/");
    router.refresh();
    // Logic to close dialog (e.g., from parent via onOpenChange)
  };

  // This handler is called by SignUpForm when initial OR resent email is confirmed sent
  const handleSignUpSuccess = (messageFromForm: string, email: string) => {
    toast.success("Action Successful!", { description: messageFromForm });
    setInitialEmail(email); // Pre-fill for login
    setAuthMode("login"); // Switch to login mode
  };

  // This handler is called by RequestVerificationEmailForm *within AuthDialog*
  const handleRequestVerificationSuccessInDialog = (
    message: string,
    email: string
  ) => {
    toast.success("Verification Email Sent", { description: message });
    setInitialEmail(email); // Keep email for potential login pre-fill
    setAuthMode("login"); // Switch to login mode
  };

  const switchToSignUp = () => {
    setInitialEmail(""); // Clear email when switching to fresh signup
    setAuthMode("signup");
  };

  const switchToLogin = (emailToPreFill?: string) => {
    setInitialEmail(emailToPreFill || initialEmail || ""); // Use provided, existing, or empty
    setAuthMode("login");
  };

  const switchToRequestVerification = (emailToPreFill?: string) => {
    setInitialEmail(emailToPreFill || initialEmail || ""); // Use provided, existing, or empty
    setAuthMode("requestVerification");
  };

  // Memoize email for child form keys to ensure re-initialization
  const emailForChildForms = React.useMemo(() => initialEmail, [initialEmail]);

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>
          {authMode === "signup"
            ? "Create an Account"
            : authMode === "requestVerification"
            ? "Resend Verification Email"
            : "Sign In"}
        </DialogTitle>
        <DialogDescription>
          {authMode === "signup"
            ? "Enter your details below to create your account."
            : authMode === "requestVerification"
            ? "Enter your email address. If an account requires verification, we'll send a new link."
            : "Access your account or sign in with Google."}
        </DialogDescription>
      </DialogHeader>

      {authMode === "login" && (
        <LoginForm
          key={`login-${emailForChildForms}`} // Ensure re-render if initialEmail changes
          initialEmail={emailForChildForms}
          onLoginSuccess={handleLoginSuccess}
          onSwitchToSignUp={switchToSignUp}
          onRequestVerificationNeeded={(emailFromLoginAttempt) => {
            // Callback from LoginForm
            toast.error("Email Not Verified", {
              description: "Please verify your email or request a new link.",
            });
            switchToRequestVerification(emailFromLoginAttempt);
          }}
        />
      )}

      {authMode === "signup" && (
        <SignUpForm
          // Ensure SignUpForm's prop is named onSignUpAndEmailSent if that's what it expects
          onSignUpSuccess={handleSignUpSuccess}
          onSwitchToLogin={() => switchToLogin()}
        />
      )}

      {authMode === "requestVerification" && (
        <RequestVerificationEmailForm
          key={`req-verify-${emailForChildForms}`} // Ensure re-render if initialEmail changes
          initialEmail={emailForChildForms}
          onSuccess={handleRequestVerificationSuccessInDialog}
          submitButtonText="Send Verification Link"
          // No explicit cancel button needed here if dialog close handles it
        />
      )}

      {/* Footer Links for Mode Switching */}
      <div className="mt-4 text-center text-sm">
        {authMode === "login" && (
          <div className="space-y-1">
            <p>
              Don&apos;t have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={switchToSignUp}
              >
                Sign Up
              </Button>
            </p>
            <p>
              Email not verified?{" "}
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => switchToRequestVerification(emailForChildForms)}
              >
                {" "}
                {/* Assuming form is LoginForm's instance */}
                Resend verification
              </Button>
            </p>
          </div>
        )}
        {authMode === "signup" && (
          <p>
            Already have an account?{" "}
            <Button
              variant="link"
              className="p-0 h-auto"
              onClick={() => switchToLogin()}
            >
              Sign In
            </Button>
          </p>
        )}
        {authMode === "requestVerification" && (
          <p>
            Remembered your password or email is verified?{" "}
            <Button
              variant="link"
              className="p-0 h-auto"
              onClick={() => switchToLogin(emailForChildForms)}
            >
              Sign In
            </Button>
          </p>
        )}
      </div>
    </DialogContent>
  );
}
