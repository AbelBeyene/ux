import { useEffect, useState } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../ui";

export interface EditorToolbarProps {
  /** Whether edit mode is on; formatting buttons are disabled otherwise. */
  editing: boolean;
  onToggleEditing: (editing: boolean) => void;
  className?: string;
}

const FORMAT_COMMANDS = [
  { command: "bold", icon: "format_bold", label: "Bold" },
  { command: "italic", icon: "format_italic", label: "Italic" },
  { command: "underline", icon: "format_underlined", label: "Underline" },
] as const;

const BLOCK_COMMANDS = [
  { command: "insertUnorderedList", icon: "format_list_bulleted", label: "Bullet list" },
  { command: "insertOrderedList", icon: "format_list_numbered", label: "Numbered list" },
  { command: "removeFormat", icon: "format_clear", label: "Clear formatting" },
] as const;

const HISTORY_COMMANDS = [
  { command: "undo", icon: "undo", label: "Undo" },
  { command: "redo", icon: "redo", label: "Redo" },
] as const;

function ToolbarButton({
  icon,
  label,
  active = false,
  disabled = false,
  onExec,
}: {
  icon: string;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onExec: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      disabled={disabled}
      // preventDefault keeps the document selection alive while clicking
      onMouseDown={(e) => {
        e.preventDefault();
        if (!disabled) onExec();
      }}
      className={cn(
        "p-1.5 rounded-lg transition-colors",
        active ? "bg-secondary/15 text-secondary" : "text-text-main hover:bg-surface-container-low",
        disabled && "opacity-40 pointer-events-none",
      )}
    >
      <Icon name={icon} size={18} />
    </button>
  );
}

function ToolbarDivider() {
  return <div className="w-px h-5 bg-outline-variant mx-1" aria-hidden="true" />;
}

/**
 * Inline rich-text toolbar for the editable resume document.
 * Uses document.execCommand — legacy but dependency-free and fine for
 * contentEditable formatting; swap for a real editor engine if needs grow.
 */
export function EditorToolbar({ editing, onToggleEditing, className }: EditorToolbarProps) {
  const [active, setActive] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!editing) {
      setActive({});
      return;
    }
    const update = () => {
      const next: Record<string, boolean> = {};
      for (const { command } of [...FORMAT_COMMANDS, ...BLOCK_COMMANDS]) {
        try {
          next[command] = document.queryCommandState(command);
        } catch {
          next[command] = false;
        }
      }
      setActive(next);
    };
    document.addEventListener("selectionchange", update);
    return () => document.removeEventListener("selectionchange", update);
  }, [editing]);

  const exec = (command: string) => document.execCommand(command);

  return (
    <div
      role="toolbar"
      aria-label="Resume formatting"
      className={cn(
        "flex items-center gap-0.5 bg-surface-white/90 backdrop-blur border border-outline-variant rounded-xl shadow-sm px-2 py-1.5",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onToggleEditing(!editing)}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-label-md font-bold transition-colors mr-1",
          editing
            ? "bg-secondary text-on-secondary hover:bg-accent-hover"
            : "text-primary hover:bg-surface-container-low",
        )}
      >
        <Icon name={editing ? "check" : "edit"} size={16} />
        {editing ? "Done" : "Edit Resume"}
      </button>
      <ToolbarDivider />
      {FORMAT_COMMANDS.map((cmd) => (
        <ToolbarButton
          key={cmd.command}
          icon={cmd.icon}
          label={cmd.label}
          active={active[cmd.command]}
          disabled={!editing}
          onExec={() => exec(cmd.command)}
        />
      ))}
      <ToolbarDivider />
      {BLOCK_COMMANDS.map((cmd) => (
        <ToolbarButton
          key={cmd.command}
          icon={cmd.icon}
          label={cmd.label}
          active={active[cmd.command]}
          disabled={!editing}
          onExec={() => exec(cmd.command)}
        />
      ))}
      <ToolbarDivider />
      {HISTORY_COMMANDS.map((cmd) => (
        <ToolbarButton
          key={cmd.command}
          icon={cmd.icon}
          label={cmd.label}
          disabled={!editing}
          onExec={() => exec(cmd.command)}
        />
      ))}
      {editing && (
        <span className="hidden xl:inline text-label-sm text-text-muted ml-2 mr-1">
          Click anywhere in the document to edit
        </span>
      )}
    </div>
  );
}
