// app/verification-failed/page.tsx
"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertTriangle, MailWarning } from "lucide-react";
import { toast } from "sonner"; // For notifications after dialog interaction
import { RequestVerificationEmailForm } from "@/components/auth/RequestVerificationEmailForm"; // Import reusable form

function VerificationFailedContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");
  const [isResendDialogOpen, setIsResendDialogOpen] = React.useState(false);

  const handleResendSuccess = (message: string, email: string) => {
    toast.success("Verification Email Sent!", { description: message });
    setIsResendDialogOpen(false); // Close dialog on success
  };

  // ... (logic for title, message, suggestion, icon remains the same) ...
  let title = "Verification Failed";
  let message = "An unexpected error occurred during email verification.";
  let suggestion =
    "Please try again later or contact support if the problem persists.";
  let icon = <AlertTriangle className="h-5 w-5 text-destructive" />;

  if (reason === "missing_token") {
    title = "Incomplete Verification Link";
    message =
      "The verification link seems to be incomplete or missing necessary information.";
    suggestion =
      "Please ensure you copied the full link from your email. If the issue continues, you might need to request a new verification link.";
    icon = <MailWarning className="h-5 w-5 text-destructive" />;
  } else if (reason === "invalid_or_expired_token") {
    title = "Invalid or Expired Link";
    message =
      "The verification link you used is either invalid or has expired.";
    suggestion =
      "Please request a new verification link to proceed with verifying your email address.";
    icon = <AlertTriangle className="h-5 w-5 text-destructive" />;
  } else if (reason === "server_error") {
    title = "Server Error";
    message =
      "We encountered a server error while trying to verify your email.";
    suggestion =
      "Please try again in a few moments. If the problem continues, our team has been notified.";
    icon = <AlertTriangle className="h-5 w-5 text-destructive" />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        {/* ... CardHeader and CardContent remain largely the same ... */}
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mb-4">
            {icon}
          </div>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <CardDescription className="text-muted-foreground">
            We couldn&apos;t verify your email address.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive" className="bg-destructive/5">
            <AlertTriangle className="h-4 w-4 !text-destructive" />
            <AlertTitle className="font-semibold">Error Details</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
          <div className="text-sm text-muted-foreground">
            <p className="font-medium">What to do next:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>{suggestion}</li>
              {(reason === "invalid_or_expired_token" ||
                reason === "missing_token") && (
                <li>You can request a new verification link.</li>
              )}
              <li>
                Ensure you are using the most recent email if multiple were
                sent.
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col justify-center sm:flex-row gap-2 pt-6">
          {(reason === "invalid_or_expired_token" ||
            reason === "missing_token") && (
            <Dialog
              open={isResendDialogOpen}
              onOpenChange={setIsResendDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  Resend Verification Link
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Resend Verification Email</DialogTitle>
                  <DialogDescription>
                    Enter your email address below. If an account exists and
                    needs verification, we&apos;ll send a new link.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <RequestVerificationEmailForm
                    onSuccess={handleResendSuccess}
                  />
                </div>
              </DialogContent>
            </Dialog>
          )}
          <Button variant="outline" className="w-full sm:w-auto" asChild>
            <Link href="/">Go to Homepage</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function VerificationFailedPage() {
  return (
    <React.Suspense fallback={
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted/10 mb-4">
              <AlertTriangle className="h-5 w-5 text-muted-foreground animate-pulse" />
            </div>
            <CardTitle className="text-2xl font-bold">Loading...</CardTitle>
            <CardDescription className="text-muted-foreground">
              Please wait while we load the page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    }>
      <VerificationFailedContent />
    </React.Suspense>
  );
}
