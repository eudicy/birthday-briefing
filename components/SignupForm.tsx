"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { subscribe, type SubscribeState } from "@/app/actions/subscribe";

const initialState: SubscribeState = { success: false, message: "" };

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(subscribe, initialState);

  return (
    <form id="signup" action={formAction} className="max-w-md mx-auto px-4 flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1 text-left">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          className="mt-1"
        />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Joining..." : "Join waitlist"}
      </Button>
      {state.message && (
        <p
          role="status"
          className={`sm:basis-full text-sm mt-1 ${state.success ? "text-primary" : "text-destructive"}`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
