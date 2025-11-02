"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

interface ResetPasswordSentFormProps {
  onBackToLogin: () => void;
  onTryDifferentEmail: () => void;
  email: string;
}

export function ResetPasswordSentForm({
  onBackToLogin,
  onTryDifferentEmail,
  email,
}: ResetPasswordSentFormProps) {
  return (
    <div className="space-y-4 text-center">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          If an account with <strong>{email}</strong> exists, you will receive a password reset link.
        </p>
        <p className="text-sm text-muted-foreground">
          Please check your inbox and follow the instructions to reset your password.
        </p>
      </div>
      <div className="space-y-2">
        <Button onClick={onBackToLogin} className="w-full">
          Back to Login
        </Button>
        <Button
          variant="outline"
          onClick={onTryDifferentEmail}
          className="w-full"
        >
          Try Different Email
        </Button>
      </div>
    </div>
  );
}