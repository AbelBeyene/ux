import { useState } from "react";
import { AuthDivider, AuthLayout } from "../components/auth";
import { Button, Icon, TextField } from "../components/ui";

export interface SignUpPageProps {
  onNavigate?: (pageId: string) => void;
}

export function SignUpPage({ onNavigate }: SignUpPageProps) {
  const [agreed, setAgreed] = useState(false);

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start with a free ATS analysis of your resume."
      footer={
        <>
          Already have an account?{" "}
          <button
            type="button"
            className="font-bold text-secondary hover:text-accent-hover transition-colors"
            onClick={() => onNavigate?.("signin")}
          >
            Sign in
          </button>
        </>
      }
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          onNavigate?.("dashboard");
        }}
      >
        <TextField label="Full Name" placeholder="Alex Rivera" autoComplete="name" required />
        <TextField label="Email" type="email" placeholder="you@example.com" autoComplete="email" required />
        <TextField
          label="Password"
          type="password"
          placeholder="8+ characters"
          autoComplete="new-password"
          helper="Use at least 8 characters with a number and a symbol."
          required
        />
        <label className="flex items-start gap-2.5 cursor-pointer text-body-sm text-text-muted">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 rounded border-outline-variant text-secondary focus:ring-secondary/30"
            required
          />
          <span>
            I agree to the <span className="font-bold text-text-main">Terms of Service</span> and{" "}
            <span className="font-bold text-text-main">Privacy Policy</span>.
          </span>
        </label>
        <Button type="submit" fullWidth size="lg" disabled={!agreed}>
          Create Account
        </Button>
      </form>

      <AuthDivider label="or sign up with" />

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          disabled
          title="Not available in this demo"
          className="flex items-center justify-center gap-2 rounded"
        >
          <Icon name="mail" size={18} />
          Google
        </Button>
        <Button
          variant="outline"
          disabled
          title="Not available in this demo"
          className="flex items-center justify-center gap-2 rounded"
        >
          <Icon name="work" size={18} />
          LinkedIn
        </Button>
      </div>
    </AuthLayout>
  );
}
