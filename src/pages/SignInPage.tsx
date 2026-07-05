import { AuthDivider, AuthLayout } from "../components/auth";
import { Button, Icon, TextField } from "../components/ui";

export interface SignInPageProps {
  onNavigate?: (pageId: string) => void;
}

export function SignInPage({ onNavigate }: SignInPageProps) {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to keep improving your resume."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <button
            type="button"
            className="font-bold text-secondary hover:text-accent-hover transition-colors"
            onClick={() => onNavigate?.("signup")}
          >
            Sign up
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
        <TextField label="Email" type="email" placeholder="you@example.com" autoComplete="email" required />
        <div>
          <TextField
            label="Password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
          <div className="mt-2 text-right">
            <button type="button" className="text-label-sm font-bold text-text-muted hover:text-secondary transition-colors">
              Forgot password?
            </button>
          </div>
        </div>
        <Button type="submit" fullWidth size="lg">
          Sign In
        </Button>
      </form>

      <AuthDivider />

      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="flex items-center justify-center gap-2 rounded">
          <Icon name="mail" size={18} />
          Google
        </Button>
        <Button variant="outline" className="flex items-center justify-center gap-2 rounded">
          <Icon name="work" size={18} />
          LinkedIn
        </Button>
      </div>
    </AuthLayout>
  );
}
