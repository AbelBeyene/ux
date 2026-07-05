import { useState } from "react";
import { AppShell, HeaderUtilities, Sidebar, TopBar } from "../components/layout";
import { Avatar, Button, Card, SelectField, TextField, Toggle } from "../components/ui";
import { currentUser, navItems, notifications } from "../data/resume";

export interface SettingsPageProps {
  onNavigate?: (pageId: string) => void;
}

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card padding="lg">
      <h3 className="text-headline-md text-primary mb-1">{title}</h3>
      {description && <p className="text-body-sm text-text-muted mb-5">{description}</p>}
      {children}
    </Card>
  );
}

function PreferenceRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-6 py-3 border-b border-outline-variant last:border-b-0">
      <div>
        <p className="font-bold text-body-md text-text-main">{title}</p>
        <p className="text-body-sm text-text-muted">{description}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} label={title} />
    </div>
  );
}

/** Account settings: profile, notification preferences, AI behavior, danger zone. */
export function SettingsPage({ onNavigate }: SettingsPageProps) {
  const [prefs, setPrefs] = useState({
    scoreAlerts: true,
    jobMatches: true,
    weeklyDigest: false,
    autoRescan: true,
  });
  const setPref = (key: keyof typeof prefs) => (value: boolean) =>
    setPrefs((prev) => ({ ...prev, [key]: value }));

  return (
    <AppShell
      sidebar={
        <Sidebar
          brand="ResumeAI"
          brandSubtitle="Professional Plan"
          items={navItems}
          activeItemId="settings"
          user={currentUser}
          cta={{ label: "Upgrade Pro" }}
          onNavigate={(item) => onNavigate?.(item.id)}
        />
      }
      header={
        <TopBar
          title="Settings"
          status="Changes are saved to your account"
          actions={<Button size="md">Save Changes</Button>}
          utilities={
            <HeaderUtilities user={currentUser} notifications={notifications} onNavigate={onNavigate} />
          }
        />
      }
    >
      <main className="flex-1 overflow-y-auto custom-scrollbar bg-background">
        <div className="max-w-3xl mx-auto p-stack-lg space-y-stack-md">
          <SettingsSection title="Profile" description="How you appear across ResumeAI.">
            <div className="flex items-center gap-4 mb-5">
              <Avatar src={currentUser.avatarUrl} alt={currentUser.name} size="lg" className="border-outline-variant" />
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="rounded">
                  Change Photo
                </Button>
                <Button variant="ghost" size="sm">
                  Remove
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField label="Full Name" defaultValue="Alex Rivera" autoComplete="name" />
              <TextField label="Job Title" defaultValue="Senior Product Designer" />
              <TextField
                label="Email"
                type="email"
                defaultValue="alex.rivera@example.com"
                autoComplete="email"
                helper="Used for sign-in and notifications."
              />
              <TextField label="Location" defaultValue="San Francisco, CA" />
            </div>
          </SettingsSection>

          <SettingsSection
            title="Notifications"
            description="Choose what ResumeAI emails you about."
          >
            <PreferenceRow
              title="Score alerts"
              description="When an analysis changes your ATS score."
              checked={prefs.scoreAlerts}
              onChange={setPref("scoreAlerts")}
            />
            <PreferenceRow
              title="Job matches"
              description="New portal listings that fit your resume."
              checked={prefs.jobMatches}
              onChange={setPref("jobMatches")}
            />
            <PreferenceRow
              title="Weekly digest"
              description="A summary of your optimization progress."
              checked={prefs.weeklyDigest}
              onChange={setPref("weeklyDigest")}
            />
          </SettingsSection>

          <SettingsSection title="AI Preferences" description="Tune how suggestions are generated.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <SelectField
                label="Suggestion Tone"
                options={[
                  { value: "authoritative", label: "Authoritative" },
                  { value: "balanced", label: "Balanced" },
                  { value: "conversational", label: "Conversational" },
                ]}
                defaultValue="balanced"
              />
              <SelectField
                label="Target Seniority"
                options={[
                  { value: "mid", label: "Mid-level" },
                  { value: "senior", label: "Senior" },
                  { value: "lead", label: "Lead / Principal" },
                ]}
                defaultValue="senior"
                helper="Benchmarks and keywords adapt to this level."
              />
            </div>
            <PreferenceRow
              title="Auto re-scan"
              description="Re-run the ATS analysis after accepted suggestions."
              checked={prefs.autoRescan}
              onChange={setPref("autoRescan")}
            />
          </SettingsSection>

          <Card padding="lg" className="border-error/40">
            <h3 className="text-headline-md text-error mb-1">Danger Zone</h3>
            <p className="text-body-sm text-text-muted mb-4">
              Deleting your account removes all resumes, analyses and history. This cannot be undone.
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="border border-error/40 text-error hover:bg-error-container/40 rounded"
            >
              Delete Account
            </Button>
          </Card>
        </div>
      </main>
    </AppShell>
  );
}
