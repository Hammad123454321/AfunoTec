"use client";

import { type ForwardedRef, useState, useEffect, forwardRef } from "react";
import {
  MDXEditor,
  toolbarPlugin,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  linkPlugin,
  imagePlugin,
  tablePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  linkDialogPlugin,
  frontmatterPlugin,
  diffSourcePlugin,
  type MDXEditorMethods,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  CreateLink,
  InsertImage,
  // InsertTable,
  ListsToggle,
  InsertThematicBreak,
  CodeToggle,
  Separator,
  // InsertCodeBlock,
  // DiffSourceToggleWrapper,
  // ConditionalContents,
  // ChangeCodeMirrorLanguage,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

interface AdaptiveMDXEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
  editorRef?: ForwardedRef<MDXEditorMethods> | null;
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
  showToolbar?: boolean;
  minHeight?: string;
  fontSize?: "small" | "medium" | "large";
  fontFamily?: "sans" | "serif" | "mono";
}

const AdaptiveMDXEditor = forwardRef<MDXEditorMethods, AdaptiveMDXEditorProps>(
  (
    {
      value,
      onChange,
      defaultValue = "",
      readOnly = false,
      placeholder = "Start writing...",
      className = "",
      showToolbar = true,
      minHeight = "200px",
      fontSize = "medium",
      fontFamily = "sans",
    },
    ref,
  ) => {
    const [isClient, setIsClient] = useState(false);
    const [selectedFontSize, setSelectedFontSize] = useState(fontSize);
    const [selectedFontFamily, setSelectedFontFamily] = useState(fontFamily);

    useEffect(() => {
      setIsClient(true);
    }, []);

    if (!isClient) {
      return (
        <div
          className={`w-full border rounded-md bg-gray-50 animate-pulse ${className}`}
          style={{ minHeight }}
        />
      );
    }

    const markdown = value !== undefined ? value : defaultValue;

    // Font size classes
    const fontSizeClasses = {
      small: "prose-sm",
      medium: "prose-base",
      large: "prose-lg",
    };

    // Font family classes
    const fontFamilyClasses = {
      sans: "font-sans",
      serif: "font-serif",
      mono: "font-mono",
    };

    const FontSizeSelector = () => (
      <select
        value={selectedFontSize}
        onChange={(e) =>
          setSelectedFontSize(e.target.value as "small" | "medium" | "large")
        }
        className="border rounded px-2 py-1 text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        title="Font Size"
      >
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
      </select>
    );

    const FontFamilySelector = () => (
      <select
        value={selectedFontFamily}
        onChange={(e) =>
          setSelectedFontFamily(e.target.value as "sans" | "serif" | "mono")
        }
        className="border rounded px-2 py-1 text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        title="Font Family"
      >
        <option value="sans">Sans Serif</option>
        <option value="serif">Serif</option>
        <option value="mono">Monospace</option>
      </select>
    );

    return (
      <div
        className={`w-full overflow-x-auto overflow-y-hidden border border-gray-300 rounded-md bg-white ${className}`}
        style={{ minHeight }}
        translate="no"
      >
        <div className="w-full min-w-[300px] max-w-full overflow-hidden">
          <style jsx global>{`
            .mdxeditor-toolbar {
              flex-wrap: wrap !important;
              overflow-x: auto !important;
              overflow-y: hidden !important;
              max-width: 100% !important;
              padding: 0.5rem !important;
              gap: 0.25rem !important;
            }

            .mdxeditor-toolbar::-webkit-scrollbar {
              height: 4px;
            }

            .mdxeditor-toolbar::-webkit-scrollbar-track {
              background: #f1f1f1;
            }

            .mdxeditor-toolbar::-webkit-scrollbar-thumb {
              background: #888;
              border-radius: 2px;
            }

            .mdxeditor-toolbar::-webkit-scrollbar-thumb:hover {
              background: #555;
            }

            /* Make toolbar items not shrink */
            .mdxeditor-toolbar > * {
              flex-shrink: 0 !important;
            }

            /* Separator responsive */
            .mdxeditor-separator {
              margin: 0 0.25rem !important;
            }
          `}</style>

          <MDXEditor
            ref={ref}
            markdown={markdown}
            onChange={onChange}
            readOnly={readOnly}
            placeholder={placeholder}
            className="w-full"
            contentEditableClassName={`prose prose-slate max-w-full break-words px-4 py-3 min-h-[300px] focus:outline-none ${fontSizeClasses[selectedFontSize]} ${fontFamilyClasses[selectedFontFamily]}`}
            plugins={[
              headingsPlugin({ allowedHeadingLevels: [1, 2, 3, 4, 5, 6] }),
              listsPlugin(),
              quotePlugin(),
              thematicBreakPlugin(),
              linkPlugin(),
              linkDialogPlugin(),
              imagePlugin({
                imageUploadHandler: async () => {
                  return "https://via.placeholder.com/400";
                },
              }),
              tablePlugin(),
              codeBlockPlugin({ defaultCodeBlockLanguage: "txt" }),
              codeMirrorPlugin({
                codeBlockLanguages: {
                  js: "JavaScript",
                  ts: "TypeScript",
                  tsx: "TypeScript (React)",
                  jsx: "JavaScript (React)",
                  css: "CSS",
                  html: "HTML",
                  json: "JSON",
                  python: "Python",
                  bash: "Bash",
                  sql: "SQL",
                  txt: "Plain Text",
                },
              }),
              frontmatterPlugin(),
              diffSourcePlugin({ viewMode: "rich-text" }),
              markdownShortcutPlugin(),
              ...(showToolbar
                ? [
                    toolbarPlugin({
                      toolbarContents: () => (
                        <>
                          <UndoRedo />
                          <Separator />
                          <FontSizeSelector />
                          <FontFamilySelector />
                          <Separator />
                          <BoldItalicUnderlineToggles />
                          <CodeToggle />
                          <Separator />
                          <BlockTypeSelect />
                          <Separator />
                          <ListsToggle />
                          <Separator />
                          <CreateLink />
                          <InsertImage />
                          <Separator />
                          <InsertThematicBreak />
                        </>
                      ),
                    }),
                  ]
                : []),
            ]}
          />
        </div>
      </div>
    );
  },
);

AdaptiveMDXEditor.displayName = "AdaptiveMDXEditor";

export default AdaptiveMDXEditor;

// // Example Usage Component
// function ExampleUsage() {
//   const [content, setContent] = useState(
//     "# Welcome to Rich Editor\n\nTry changing the **font size** and *font family* using the dropdowns in the toolbar!\n\n## Features\n- Multiple font sizes\n- Different font families\n- Full markdown support\n- Code blocks\n- And much more!"
//   );

//   return (
//     <div className="max-w-4xl mx-auto p-6 space-y-8">
//       <h1 className="text-3xl font-semibold">Adaptive MDX Rich Editor</h1>

//       {/* Example 1: Full Featured */}
//       <div className="space-y-2">
//         <h2 className="text-xl font-semibold">Full Featured Editor</h2>
//         <AdaptiveMDXEditor
//           value={content}
//           onChange={setContent}
//           fontSize="medium"
//           fontFamily="sans"
//         />
//         <button
//           onClick={() => alert(content)}
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//         >
//           Show Content
//         </button>
//       </div>

//       {/* Example 2: Large Serif */}
//       <div className="space-y-2">
//         <h2 className="text-xl font-semibold">Large Serif Style</h2>
//         <AdaptiveMDXEditor
//           defaultValue="# Classic Look\n\nThis editor uses large serif font for a classic, elegant appearance."
//           fontSize="large"
//           fontFamily="serif"
//         />
//       </div>

//       {/* Example 3: Monospace for Code */}
//       <div className="space-y-2">
//         <h2 className="text-xl font-semibold">Monospace for Developers</h2>
//         <AdaptiveMDXEditor
//           defaultValue="# Code Style\n\n```javascript\nconst hello = 'world';\n```\n\nPerfect for technical documentation."
//           fontSize="small"
//           fontFamily="mono"
//           minHeight="300px"
//         />
//       </div>
//     </div>
//   );
// }

// export { ExampleUsage };
