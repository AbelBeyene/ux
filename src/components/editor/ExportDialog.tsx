import { useState } from "react";
import { cn } from "../../lib/cn";
import { useCopyToClipboard } from "../../lib/useCopyToClipboard";
import { Button, Dialog, Icon } from "../ui";

export type ExportMethod = "link" | "pdf";

export interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
  /** Trackable share URL offered by the link option. */
  shareUrl: string;
  onDownloadPdf?: () => void;
  /** Called after the share link is copied. */
  onShareLink?: () => void;
}

interface OptionCardProps {
  selected: boolean;
  onSelect: () => void;
  icon: string;
  title: string;
  badge?: string;
  description: string;
  children?: React.ReactNode;
}

function OptionCard({ selected, onSelect, icon, title, badge, description, children }: OptionCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "w-full text-left p-4 rounded-lg border-2 transition-colors",
        selected ? "border-secondary bg-secondary/5" : "border-outline-variant hover:border-outline",
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
            selected ? "bg-secondary text-on-secondary" : "bg-primary/5 text-primary",
          )}
        >
          <Icon name={icon} size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-body-md text-text-main">{title}</p>
            {badge && (
              <span className="bg-secondary text-on-secondary text-label-xs px-1.5 py-0.5 rounded-full font-bold uppercase">
                {badge}
              </span>
            )}
          </div>
          <p className="text-body-sm text-text-muted mt-0.5">{description}</p>
          {children}
        </div>
        <Icon
          name={selected ? "radio_button_checked" : "radio_button_unchecked"}
          size={20}
          className={selected ? "text-secondary" : "text-outline"}
        />
      </div>
    </button>
  );
}

/** Export chooser: trackable share link (with analytics benefits) vs. static PDF. */
export function ExportDialog({ open, onClose, shareUrl, onDownloadPdf, onShareLink }: ExportDialogProps) {
  const [method, setMethod] = useState<ExportMethod>("link");
  const { copied, copy } = useCopyToClipboard(1200);

  const confirm = async () => {
    if (method === "pdf") {
      onDownloadPdf?.();
      onClose();
      return;
    }
    await copy(shareUrl);
    onShareLink?.();
    setTimeout(onClose, 1200);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Export Resume"
      subtitle="Choose how you want to share your finalized resume."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex items-center gap-2" onClick={confirm}>
            <Icon name={method === "link" ? (copied ? "check" : "link") : "download"} size={18} />
            {method === "link" ? (copied ? "Link Copied!" : "Copy Share Link") : "Download PDF"}
          </Button>
        </>
      }
    >
      <div role="radiogroup" aria-label="Export method" className="space-y-3">
        <OptionCard
          selected={method === "link"}
          onSelect={() => setMethod("link")}
          icon="link"
          title="Share via Link"
          badge="Recommended"
          description="Send a live link instead of a file — and see how your resume performs."
        >
          <ul className="mt-2.5 space-y-1.5">
            {[
              "Track views, downloads and link clicks in Analytics",
              "Recruiters always see your latest version",
              "See which countries and devices engage most",
              "Revoke access anytime",
            ].map((benefit) => (
              <li key={benefit} className="flex items-center gap-2 text-body-sm text-text-main">
                <Icon name="check_circle" size={16} className="text-secondary shrink-0" />
                {benefit}
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center gap-2 bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2">
            <Icon name="public" size={16} className="text-text-muted shrink-0" />
            <span className="text-label-sm text-text-muted truncate">{shareUrl}</span>
          </div>
        </OptionCard>

        <OptionCard
          selected={method === "pdf"}
          onSelect={() => setMethod("pdf")}
          icon="picture_as_pdf"
          title="Export as PDF"
          description="Download a static, ATS-safe file — best for job portals and email attachments. Note: file copies can't be tracked in Analytics."
        />
      </div>
    </Dialog>
  );
}
