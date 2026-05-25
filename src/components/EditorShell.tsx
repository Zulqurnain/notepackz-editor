"use client";

import { useEffect, useRef, useCallback } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import CharacterCount from "@tiptap/extension-character-count";
import { Save, Info } from "lucide-react";
import EditorToolbar from "./EditorToolbar";
import EditorArea from "./EditorArea";

const LS_KEY = "notepackz_content";

export default function EditorShell() {
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Start writing…" }),
      Color,
      TextStyle,
      Highlight.configure({ multicolor: true }),
      CharacterCount,
    ],
    content: "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        localStorage.setItem(LS_KEY, editor.getHTML());
      }, 1500);
    },
  });

  // Load saved content on mount
  useEffect(() => {
    if (!editor) return;
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      editor.commands.setContent(saved, { emitUpdate: false });
    }
  }, [editor]);

  const handleSave = useCallback(async () => {
    if (!editor) return;
    const html = editor.getHTML();
    const blob = new Blob([html], { type: "text/html" });

    if ("showSaveFilePicker" in window) {
      try {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: "note.html",
          types: [{ description: "HTML file", accept: { "text/html": [".html"] } }],
        });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return;
      } catch {
        // User cancelled or API not supported — fall through
      }
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "note.html";
    a.click();
    URL.revokeObjectURL(url);
  }, [editor]);

  const words = editor?.storage.characterCount?.words?.() ?? 0;
  const chars = editor?.storage.characterCount?.characters?.() ?? 0;

  return (
    <div className="h-full flex items-start justify-center">
      {/* Outer glow */}
      <div
        className="relative w-full h-full"
        style={{ maxWidth: 900 }}
      >
        {/* Glow behind card */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.18) 0%, transparent 65%)",
            filter: "blur(2px)",
            zIndex: 0,
          }}
        />

        {/* Gradient border wrapper */}
        <div
          className="relative w-full h-full rounded-2xl p-px"
          style={{
            background: "linear-gradient(160deg, rgba(124,58,237,0.35) 0%, rgba(37,99,235,0.2) 40%, rgba(249,115,22,0.12) 100%)",
            zIndex: 1,
          }}
        >
          {/* Card */}
          <div
            className="flex flex-col w-full h-full rounded-2xl overflow-hidden"
            style={{ background: "#0c0c1e" }}
          >
            {/* Top row: info + word count + Save */}
            <div
              className="flex items-center px-4 shrink-0"
              style={{
                height: 46,
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <button
                title="About NotePackz"
                className="flex items-center justify-center w-7 h-7 rounded-md transition-colors"
                style={{ color: "#475569" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#94a3b8")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#475569")}
              >
                <Info size={15} />
              </button>

              <div className="flex-1" />

              {/* Word / char count */}
              <span className="text-[11px] mr-4" style={{ color: "#334155" }}>
                {words} {words === 1 ? "word" : "words"} · {chars} {chars === 1 ? "char" : "chars"}
              </span>

              {/* Save button */}
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-3 h-[30px] rounded-md text-xs font-medium transition-all duration-150"
                style={{
                  background: "#fff",
                  color: "#0f0f23",
                  border: "none",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#e2e8f0")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#fff")}
              >
                <Save size={12} />
                Save
              </button>
            </div>

            {/* Toolbar */}
            <EditorToolbar editor={editor} />

            {/* Editor area */}
            <div className="flex-1 overflow-y-auto" style={{ background: "#0a0a18" }}>
              <EditorArea editor={editor} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
