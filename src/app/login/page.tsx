"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { siteConfig } from "@/config/site";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!isSupabaseConfigured()) {
        throw new Error("Supabase is not configured for this environment.");
      }
      const supabase = createClient();
      const { error: signError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signError) throw signError;

      const verify = await fetch("/api/admin/verify-staff", { method: "POST" });
      const json = await verify.json();
      if (!verify.ok || !json.ok) {
        await supabase.auth.signOut();
        throw new Error(
          json.error ||
            "This account is not provisioned for Weidner Lawnscape staff access.",
        );
      }
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-16">
      <Link href="/" className="text-sm text-muted hover:text-evergreen">
        ← Back to site
      </Link>
      <h1 className="mt-6 font-display text-3xl text-evergreen-deep">
        Staff Login
      </h1>
      <p className="mt-2 text-sm text-muted">
        {siteConfig.name} owner/admin access. A provisioned staff profile is required.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <label className="block text-sm font-medium">
          Email
          <input
            type="email"
            required
            className="mt-1.5 w-full rounded-md border border-border px-3 py-2.5"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </label>
        <label className="block text-sm font-medium">
          Password
          <div className="relative mt-1.5">
            <input
              type={showPassword ? "text" : "password"}
              required
              className="w-full rounded-md border border-border px-3 py-2.5 pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-muted"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </label>
        {error ? (
          <p className="text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-evergreen px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
