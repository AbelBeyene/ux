import { useRef, useState } from "react";
import { AppShell, HeaderUtilities, Sidebar, TopBar } from "../components/layout";
import { Avatar, Button, Card, Dialog, SelectField, TextField, Toggle } from "../components/ui";
import { usePersistentState } from "../lib/usePersistentState";
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

const DEFAULT_PROFILE = {
  name: "Alex Rivera",
  title: "Senior Product Designer",
  email: "alex.rivera@example.com",
  location: "San Francisco, CA",
};

/** Account settings: profile, notification preferences, AI behavior, danger zone. */
export function SettingsPage({ onNavigate }: SettingsPageProps) {
  const [profile, setProfile] = usePersistentState("resumeai:profile", DEFAULT_PROFILE);
  const [avatarDataUrl, setAvatarDataUrl] = usePersistentState<string | null>(
    "resumeai:avatarDataUrl",
    null,
  );
  const [prefs, setPrefs] = usePersistentState("resumeai:notificationPrefs", {
    scoreAlerts: true,
    jobMatches: true,
    weeklyDigest: false,
    autoRescan: true,
  });
  const [aiPrefs, setAiPrefs] = usePersistentState("resumeai:aiPrefs", {
    tone: "balanced",
    seniority: "senior",
  });
  const setPref = (key: keyof typeof prefs) => (value: boolean) =>
    setPrefs((prev) => ({ ...prev, [key]: value }));

  const [saved, setSaved] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarDataUrl(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
  };

  const handleDeleteAccount = () => {
    Object.keys(localStorage)
      .filter((key) => key.startsWith("resumeai:"))
      .forEach((key) => localStorage.removeItem(key));
    setDeleteOpen(false);
    onNavigate?.("signin");
  };

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
          actions={
            <Button size="md" onClick={handleSave}>
              {saved ? "Saved" : "Save Changes"}
            </Button>
          }
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
              <Avatar
                src={avatarDataUrl ?? currentUser.avatarUrl}
                alt={profile.name}
                size="lg"
                className="border-outline-variant"
              />
              <div className="flex gap-2">
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded"
                  onClick={() => avatarInputRef.current?.click()}
                >
                  Change Photo
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setAvatarDataUrl(null)}>
                  Remove
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Full Name"
                autoComplete="name"
                value={profile.name}
                onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
              />
              <TextField
                label="Job Title"
                value={profile.title}
                onChange={(e) => setProfile((prev) => ({ ...prev, title: e.target.value }))}
              />
              <TextField
                label="Email"
                type="email"
                autoComplete="email"
                helper="Used for sign-in and notifications."
                value={profile.email}
                onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
              />
              <TextField
                label="Location"
                value={profile.location}
                onChange={(e) => setProfile((prev) => ({ ...prev, location: e.target.value }))}
              />
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
                value={aiPrefs.tone}
                onChange={(e) => setAiPrefs((prev) => ({ ...prev, tone: e.target.value }))}
              />
              <SelectField
                label="Target Seniority"
                options={[
                  { value: "mid", label: "Mid-level" },
                  { value: "senior", label: "Senior" },
                  { value: "lead", label: "Lead / Principal" },
                ]}
                helper="Benchmarks and keywords adapt to this level."
                value={aiPrefs.seniority}
                onChange={(e) => setAiPrefs((prev) => ({ ...prev, seniority: e.target.value }))}
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
              onClick={() => setDeleteOpen(true)}
            >
              Delete Account
            </Button>
          </Card>
        </div>
      </main>

      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete your account?"
        subtitle="This removes all locally saved resumes, analyses and preferences. This cannot be undone."
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-error text-on-error hover:bg-error/90"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </Button>
          </>
        }
      >
        <p className="text-body-sm text-text-muted">
          You'll be signed out and returned to the sign-in screen.
        </p>
      </Dialog>
    </AppShell>
  );
}
