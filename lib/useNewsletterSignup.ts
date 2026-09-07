"use client";

import { useState } from "react";

export type NewsletterSignupStatus = "idle" | "loading" | "success" | "error";

export function useNewsletterSignup() {
  const [status, setStatus] = useState<NewsletterSignupStatus>("idle");

  async function submit(email: string): Promise<boolean> {
    setStatus("loading");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error("Request failed");
      setStatus("success");
      return true;
    } catch {
      setStatus("error");
      return false;
    }
  }

  return { status, submit };
}
