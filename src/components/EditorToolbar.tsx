"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { Editor } from "@tiptap/react";
import {
  Undo2, Redo2, Bold, Italic, Underline, Link2, ChevronDown,
  List, ListOrdered, ListChecks, Table2, ImageIcon,
  Quote, Code2, Type, Paintbrush, Unlink,
} from "lucide-react";

interface Props {
  editor: Editor | null;
}

// ── Heading/paragraph selector ────────────────────────────
const HEADING_OPTIONS = [
  { label: "Normal Text", tag: "p" },
  { label: "Heading 1",   tag: "h1" },
  { label: "Heading 2",   tag: "h2" },
  { label: "Heading 3",   tag: "h3" },
] as const;

// ── Text colours ──────────────────────────────────────────
const TEXT_COLORS = [
  { label: "Default",  value: "inherit" },
  { label: "Red",      value: "#f87171" },
  { label: "Orange",   value: "#fb923c" },
  { label: "Yellow",   value: "#facc15" },
  { label: "Green",    value: "#4ade80" },
  { label: "Blue",     value: "#60a5fa" },
  { label: "Violet",   value: "#a78bfa" },
  { label: "Pink",     value: "#f472b6" },
  { label: "Gray",     value: "#94a3b8" },
];

// ── Highlight colours ─────────────────────────────────────
const HIGHLIGHT_COLORS = [
  { label: "None",    value: "" },
  { label: "Yellow",  value: "#854d0e" },
  { label: "Green",   value: "#14532d" },
  { label: "Blue",    value: "#1e3a5f" },
  { label: "Purple",  value: "#4c1d95" },
  { label: "Pink",    value: "#831843" },
  { label: "Orange",  value: "#7c2d12" },
];

// ── Small reusable pieces ─────────────────────────────────
function Sep() {
  return (
    <span
      className="shrink-0 self-stretch"
      style={{ width: 1, background: "rgba(255,255,255,0.08)", margin: "6px 2px" }}
    />
  );
}

function TBtn({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="flex items-center justify-center shrink-0 rounded-md transition-all duration-100"
      style={{
        width: 30, height: 30,
        background: active ? "rgba(124,58,237,0.18)" : "transparent",
        color: active ? "#c4b5fd" : "#64748b",
        border: active ? "1px solid rgba(124,58,237,0.3)" : "1px solid transparent",
        opacity: disabled ? 0.35 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      onMouseEnter={(e) => {
        if (!disabled && !active) {
          (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
          (e.currentTarget as HTMLElement).style.color = "#e2e8f0";
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !active) {
          (e.currentTarget as HTMLElement).style.background = "transparent";
          (e.currentTarget as HTMLElement).style.color = "#64748b";
        }
      }}
    >
      {children}
    </button>
  );
}

// ── Dropdown wrapper ──────────────────────────────────────
function Dropdown({
  trigger,
  children,
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
      {open && (
        <div
          className="absolute top-full left-0 mt-1 z-50 animate-fade-in"
          style={{
            background: "#111128",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 10,
            boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
            minWidth: 160,
          }}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// ── Link dialog ───────────────────────────────────────────
function LinkDialog({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isActive = editor.isActive("link");

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const openDialog = () => {
    setUrl(editor.getAttributes("link").href ?? "");
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const apply = () => {
    if (!url.trim()) {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().setLink({ href: url.trim(), target: "_blank" }).run();
    }
    setOpen(false);
    setUrl("");
  };

  const remove = () => {
    editor.chain().focus().unsetLink().run();
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <TBtn onClick={openDialog} active={isActive} title="Link">
        <Link2 size={14} />
      </TBtn>
      {open && (
        <div
          className="absolute top-full left-1/2 mt-2 z-50 animate-fade-in"
          style={{
            transform: "translateX(-50%)",
            background: "#111128",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 10,
            boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
            padding: "10px 12px",
            minWidth: 280,
          }}
        >
          <p className="text-xs mb-2" style={{ color: "#64748b" }}>Insert link</p>
          <div className="flex gap-2">
            <input
              ref={inputRef}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && apply()}
              placeholder="https://example.com"
              className="flex-1 rounded-md px-2.5 py-1.5 text-xs outline-none"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#e2e8f0",
              }}
            />
            <button
              onClick={apply}
              className="px-3 py-1.5 rounded-md text-xs font-medium"
              style={{ background: "#7c3aed", color: "#fff" }}
            >
              Apply
            </button>
            {isActive && (
              <button onClick={remove} title="Remove link" className="flex items-center px-2 rounded-md" style={{ background: "rgba(239,68,68,0.15)", color: "#f87171" }}>
                <Unlink size={13} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main toolbar ──────────────────────────────────────────
export default function EditorToolbar({ editor }: Props) {
  if (!editor) return null;

  const currentHeading = HEADING_OPTIONS.find((opt) =>
    opt.tag === "p"
      ? editor.isActive("paragraph")
      : editor.isActive("heading", { level: Number(opt.tag[1]) })
  ) ?? HEADING_OPTIONS[0];

  const setHeading = (opt: (typeof HEADING_OPTIONS)[number]) => {
    if (opt.tag === "p") {
      editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().toggleHeading({ level: Number(opt.tag[1]) as 1 | 2 | 3 }).run();
    }
  };

  const insertImage = () => {
    const url = window.prompt("Image URL:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  return (
    <div
      className="flex items-center gap-0.5 px-3 flex-wrap"
      style={{
        height: 46,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "transparent",
        overflowX: "auto",
        overflowY: "hidden",
      }}
    >
      {/* Undo / Redo */}
      <TBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo (Ctrl+Z)">
        <Undo2 size={14} />
      </TBtn>
      <TBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo (Ctrl+Y)">
        <Redo2 size={14} />
      </TBtn>

      <Sep />

      {/* Heading dropdown */}
      <Dropdown
        trigger={
          <button
            className="flex items-center gap-1.5 px-2.5 h-[30px] rounded-md text-xs font-medium transition-all duration-100"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#94a3b8",
              minWidth: 108,
              cursor: "pointer",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#e2e8f0")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#94a3b8")}
          >
            <Type size={12} />
            <span className="flex-1 text-left">{currentHeading.label}</span>
            <ChevronDown size={11} />
          </button>
        }
      >
        <div className="py-1">
          {HEADING_OPTIONS.map((opt) => (
            <button
              key={opt.tag}
              onClick={() => setHeading(opt)}
              className="w-full text-left px-3 py-1.5 text-xs transition-colors"
              style={{
                color: currentHeading.tag === opt.tag ? "#c4b5fd" : "#94a3b8",
                background: currentHeading.tag === opt.tag ? "rgba(124,58,237,0.12)" : "transparent",
                fontSize: opt.tag === "h1" ? 15 : opt.tag === "h2" ? 13 : opt.tag === "h3" ? 12 : 12,
                fontWeight: opt.tag !== "p" ? 600 : 400,
              }}
              onMouseEnter={(e) => { if (currentHeading.tag !== opt.tag) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}
              onMouseLeave={(e) => { if (currentHeading.tag !== opt.tag) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Dropdown>

      {/* Formatting */}
      <TBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold (Ctrl+B)">
        <Bold size={14} />
      </TBtn>
      <TBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic (Ctrl+I)">
        <Italic size={14} />
      </TBtn>
      <TBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline (Ctrl+U)">
        <Underline size={14} />
      </TBtn>

      {/* Link */}
      <LinkDialog editor={editor} />

      {/* Text colour dropdown */}
      <Dropdown
        trigger={
          <TBtn title="Text color">
            <div className="flex flex-col items-center gap-[2px]">
              <span className="text-[10px] font-bold leading-none" style={{ color: "#94a3b8" }}>A</span>
              <span className="w-3 h-[3px] rounded-full" style={{ background: editor.getAttributes("textStyle").color ?? "#94a3b8" }} />
            </div>
            <ChevronDown size={10} style={{ position: "absolute", bottom: 3, right: 2, color: "#475569" }} />
          </TBtn>
        }
      >
        <div className="p-2">
          <p className="text-[10px] mb-2 px-1" style={{ color: "#475569" }}>Text Color</p>
          <div className="grid grid-cols-5 gap-1.5">
            {TEXT_COLORS.map((c) => (
              <button
                key={c.value}
                onClick={() =>
                  c.value === "inherit"
                    ? editor.chain().focus().unsetColor().run()
                    : editor.chain().focus().setColor(c.value).run()
                }
                title={c.label}
                className="w-6 h-6 rounded-md border transition-transform hover:scale-110"
                style={{
                  background: c.value === "inherit" ? "rgba(255,255,255,0.1)" : c.value,
                  border: c.value === "inherit" ? "1px dashed rgba(255,255,255,0.2)" : "1px solid rgba(255,255,255,0.12)",
                }}
              />
            ))}
          </div>
        </div>
      </Dropdown>

      {/* Highlight dropdown */}
      <Dropdown
        trigger={
          <TBtn title="Highlight">
            <Paintbrush size={13} />
            <ChevronDown size={10} style={{ position: "absolute", bottom: 3, right: 2, color: "#475569" }} />
          </TBtn>
        }
      >
        <div className="p-2">
          <p className="text-[10px] mb-2 px-1" style={{ color: "#475569" }}>Highlight</p>
          <div className="grid grid-cols-4 gap-1.5">
            {HIGHLIGHT_COLORS.map((c) => (
              <button
                key={c.label}
                onClick={() =>
                  c.value === ""
                    ? editor.chain().focus().unsetHighlight().run()
                    : editor.chain().focus().toggleHighlight({ color: c.value }).run()
                }
                title={c.label}
                className="w-6 h-6 rounded-md border transition-transform hover:scale-110"
                style={{
                  background: c.value === "" ? "rgba(255,255,255,0.06)" : c.value,
                  border: c.value === "" ? "1px dashed rgba(255,255,255,0.2)" : "1px solid rgba(255,255,255,0.15)",
                }}
              />
            ))}
          </div>
        </div>
      </Dropdown>

      <Sep />

      {/* Lists */}
      <TBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet list">
        <List size={14} />
      </TBtn>
      <TBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numbered list">
        <ListOrdered size={14} />
      </TBtn>
      <TBtn onClick={() => editor.chain().focus().toggleTaskList().run()} active={editor.isActive("taskList")} title="Checklist">
        <ListChecks size={14} />
      </TBtn>

      {/* Table */}
      <TBtn onClick={insertTable} title="Insert table">
        <Table2 size={14} />
      </TBtn>

      {/* Image */}
      <TBtn onClick={insertImage} title="Insert image">
        <ImageIcon size={14} />
      </TBtn>

      {/* Blockquote */}
      <TBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Blockquote">
        <Quote size={14} />
      </TBtn>

      {/* Code block */}
      <TBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="Code block">
        <Code2 size={14} />
      </TBtn>
    </div>
  );
}
