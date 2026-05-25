"use client";

import { EditorContent } from "@tiptap/react";
import type { Editor } from "@tiptap/react";

export default function EditorArea({ editor }: { editor: Editor | null }) {
  return <EditorContent editor={editor} className="h-full" />;
}
