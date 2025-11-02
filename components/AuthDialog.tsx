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
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { ResetPasswordSentForm } from "@/components/auth/ResetPasswordSentForm";
import { AuthMode } from "@/types/common";

export function AuthDialog() {
  const router = useRouter();
  // Updated state: from isSignUpMode (boolean) to authMode (string literal)
  const [authMode, setAuthMode] = React.useState<AuthMode>(AuthMode.LOGIN);
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
    setAuthMode(AuthMode.LOGIN); // Switch to login mode
  };

  // This handler is called by RequestVerificationEmailForm *within AuthDialog*
  const handleRequestVerificationSuccessInDialog = (
    message: string,
    email: string
  ) => {
    toast.success("Verification Email Sent", { description: message });
    setInitialEmail(email); // Keep email for potential login pre-fill
    setAuthMode(AuthMode.LOGIN); // Switch to login mode
  };

  const switchToSignUp = () => {
    setInitialEmail(""); // Clear email when switching to fresh signup
    setAuthMode(AuthMode.SIGNUP);
  };

  const switchToLogin = (emailToPreFill?: string) => {
    setInitialEmail(emailToPreFill || initialEmail || ""); // Use provided, existing, or empty
    setAuthMode(AuthMode.LOGIN);
  };

  const switchToRequestVerification = (emailToPreFill?: string) => {
    setInitialEmail(emailToPreFill || initialEmail || ""); // Use provided, existing, or empty
    setAuthMode(AuthMode.REQUEST_VERIFICATION);
  };

  const switchToForgotPassword = (emailToPreFill?: string) => {
    setInitialEmail(emailToPreFill || initialEmail || ""); // Use provided, existing, or empty
    setAuthMode(AuthMode.FORGOT_PASSWORD);
  };

  const switchToResetPasswordSent = (email: string) => {
    setInitialEmail(email);
    setAuthMode(AuthMode.RESET_PASSWORD_SENT);
  };

  // Memoize email for child form keys to ensure re-initialization
  const emailForChildForms = React.useMemo(() => initialEmail, [initialEmail]);

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>
          {authMode === AuthMode.SIGNUP
            ? "Create an Account"
            : authMode === AuthMode.REQUEST_VERIFICATION
            ? "Resend Verification Email"
            : authMode === AuthMode.FORGOT_PASSWORD
            ? "Reset Password"
            : authMode === AuthMode.RESET_PASSWORD_SENT
            ? "Check Your Email"
            : "Sign In"}
        </DialogTitle>
        <DialogDescription>
          {authMode === AuthMode.SIGNUP
            ? "Enter your details below to create your account."
            : authMode === AuthMode.REQUEST_VERIFICATION
            ? "Enter your email address. If an account requires verification, we'll send a new link."
            : authMode === AuthMode.FORGOT_PASSWORD
            ? "Enter your email address and we'll send you a password reset link."
            : authMode === AuthMode.RESET_PASSWORD_SENT
            ? "We've sent you a password reset link if an account exists with that email."
            : "Access your account or sign in with Google."}
        </DialogDescription>
      </DialogHeader>

      {authMode === AuthMode.LOGIN && (
        <LoginForm
          key={`login-${emailForChildForms}`} // Ensure re-render if initialEmail changes
          initialEmail={emailForChildForms}
          onLoginSuccess={handleLoginSuccess}
          onRequestVerificationNeeded={(emailFromLoginAttempt) => {
            // Callback from LoginForm
            toast.error("Email Not Verified", {
              description: "Please verify your email or request a new link.",
            });
            switchToRequestVerification(emailFromLoginAttempt);
          }}
          onSwitchToForgotPassword={switchToForgotPassword}
        />
      )}

      {authMode === AuthMode.SIGNUP && (
        <SignUpForm
          // Ensure SignUpForm's prop is named onSignUpAndEmailSent if that's what it expects
          onSignUpSuccess={handleSignUpSuccess}
          onSwitchToLogin={() => switchToLogin()}
        />
      )}

      {authMode === AuthMode.REQUEST_VERIFICATION && (
        <RequestVerificationEmailForm
          key={`req-verify-${emailForChildForms}`} // Ensure re-render if initialEmail changes
          initialEmail={emailForChildForms}
          onSuccess={handleRequestVerificationSuccessInDialog}
          submitButtonText="Send Verification Link"
          // No explicit cancel button needed here if dialog close handles it
        />
      )}

      {authMode === AuthMode.FORGOT_PASSWORD && (
        <ForgotPasswordForm
          key={`forgot-password-${emailForChildForms}`} // Ensure re-render if initialEmail changes
          initialEmail={emailForChildForms}
          onBackToLogin={() => switchToLogin(emailForChildForms)}
          onResetEmailSent={switchToResetPasswordSent}
        />
      )}

      {authMode === AuthMode.RESET_PASSWORD_SENT && (
        <ResetPasswordSentForm
          email={emailForChildForms}
          onBackToLogin={() => switchToLogin(emailForChildForms)}
          onTryDifferentEmail={() => switchToForgotPassword(emailForChildForms)}
        />
      )}

      {/* Footer Links for Mode Switching */}
      <div className="mt-4 text-center text-sm">
        {authMode === AuthMode.LOGIN && (
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
        {authMode === AuthMode.SIGNUP && (
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
        {authMode === AuthMode.REQUEST_VERIFICATION && (
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
        {authMode === AuthMode.FORGOT_PASSWORD && (
          <p>
            Remembered your password?{" "}
            <Button
              variant="link"
              className="p-0 h-auto"
              onClick={() => switchToLogin(emailForChildForms)}
            >
              Sign In
            </Button>
          </p>
        )}
        {authMode === AuthMode.RESET_PASSWORD_SENT && (
          <p>
            Need help?{" "}
            <Button
              variant="link"
              className="p-0 h-auto"
              onClick={() => switchToLogin(emailForChildForms)}
            >
              Back to Login
            </Button>
          </p>
        )}
      </div>
    </DialogContent>
  );
}
