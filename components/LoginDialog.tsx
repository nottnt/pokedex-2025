"use client";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { loginSchema, LoginInput } from "@/lib/validation/auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function LoginDialog() {
  const router = useRouter();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: LoginInput) => {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (!res?.ok) {
        // Set form error for a general message if API returns a generic error
        // Or handle specific field errors if your API provides them
        form.setError("root.serverError", {
          type: "manual",
          message: "Invalid email or password. Please try again.",
        });
        // Or you could set errors for specific fields:
        // form.setError("email", { type: "manual", message: "Incorrect email" });
        throw new Error("Invalid credentials");
      }
      return res;
    },
    onSuccess: () => {
      router.push("/");
      // Optionally, you might want to close the dialog here
      // e.g., if you have an onOpenChange prop for the Dialog
    },
  });

  // 2. Define the submit handler
  const onSubmit = (data: LoginInput) => {
    mutation.mutate(data);
  };

  return (
    <DialogContent className="sm:max-w-[400px]">
      <DialogHeader>
        <DialogTitle>Sign In</DialogTitle>
        <DialogDescription>
          Login with your email and password or use Google.
        </DialogDescription>
      </DialogHeader>

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
                {/* FormDescription can be used here if needed */}
                {/* <FormDescription>Your public display name.</FormDescription> */}
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

          {/* Display general server-side error from mutation */}
          {form.formState.errors.root?.serverError && (
            <p className="text-sm text-red-600">
              {form.formState.errors.root.serverError.message}
            </p>
          )}

          <div className="flex flex-col gap-2 pt-2">
            <Button
              type="submit"
              disabled={form.formState.isSubmitting || mutation.isPending}
            >
              {mutation.isPending ? "Signing in..." : "Sign In"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => signIn("google", { callbackUrl: "/" })}
              disabled={mutation.isPending} // Also disable while submitting credentials
            >
              Sign in with Google
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}
