"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";
import MenuBar from "./menu-bar";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";

interface RichTextEditorProps {
  content: string;
  onChange?: (content: string) => void;
  isEditable?: boolean;
}
export default function RichTextEditor({
  content,
  onChange,
  isEditable = true,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-3",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-3",
          },
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
    ],
    content: content,
    editorProps: {
      attributes: {
        class: isEditable
          ? "min-h-[156px] border-border  rounded-md bg-slate-50 py-2 px-3 font-[family-name:var(--font-lora)] dark:bg-slate-800 dark:text-slate-200 text-slate-900 focus-within:border-border focus-within:ring-1 focus-within:ring-border focus-within:outline-none"
          : "outline-none font-[family-name:var(--font-lora)]",
      },
    },
    onUpdate: ({ editor }) => {
      // console.log(editor.getHTML());
      if (onChange) onChange(editor.getHTML());
    },
    immediatelyRender: false, // Prevents immediate rendering to avoid performance issues
  });

  return (
    <div>
      {isEditable && <MenuBar editor={editor} />}

      <EditorContent editor={editor} />
    </div>
  );
}
