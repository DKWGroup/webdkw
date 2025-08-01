import {
  Bold,
  Code,
  Eye,
  EyeOff,
  Heading1,
  Heading2,
  Heading3,
  HelpCircle,
  Image,
  Italic,
  Link,
  List,
  ListOrdered,
  Quote,
  Save,
  Table,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

interface MarkdownEditorProps {
  initialValue: string;
  onChange: (value: string) => void;
  onSave?: () => void;
  height?: string;
  placeholder?: string;
  autoFocus?: boolean;
}

interface ToolbarButton {
  icon: React.ReactNode;
  title: string;
  action: () => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  initialValue = "",
  onChange,
  onSave,
  height = "500px",
  placeholder = "Napisz coś...",
  autoFocus = false,
}) => {
  const [markdown, setMarkdown] = useState(initialValue);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [showPreview, setShowPreview] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<
    "idle" | "saving" | "saved"
  >("idle");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoad = useRef(true);

  // Initialize editor with initial value
  useEffect(() => {
    if (initialValue !== markdown) {
      setMarkdown(initialValue);
      isInitialLoad.current = true;
    }
  }, [initialValue, markdown]);

  // Auto-save functionality
  useEffect(() => {
    if (markdown !== initialValue && !isInitialLoad.current) {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      setAutoSaveStatus("saving");

      autoSaveTimerRef.current = setTimeout(() => {
        // In a real app, you would save to localStorage or backend here
        localStorage.setItem("markdown-draft", markdown);
        setAutoSaveStatus("saved");

        // Reset status after 2 seconds
        setTimeout(() => {
          setAutoSaveStatus("idle");
        }, 2000);
      }, 2000); // Increased delay to 2 seconds to reduce frequent saving
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [markdown, initialValue]);

  // Update parent component when markdown changes (but not on initial load)
  useEffect(() => {
    if (!isInitialLoad.current && markdown !== initialValue) {
      onChange(markdown);
    } else if (isInitialLoad.current) {
      isInitialLoad.current = false;
    }
  }, [markdown, onChange, initialValue]);

  // Auto-focus on mount if specified
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  // Track selection changes
  const handleSelectionChange = () => {
    if (textareaRef.current) {
      setSelection({
        start: textareaRef.current.selectionStart,
        end: textareaRef.current.selectionEnd,
      });
    }
  };

  // Insert text at cursor position or replace selection
  const insertText = (before: string, after: string = "") => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const { start, end } = selection;
    const selectedText = markdown.substring(start, end);

    const newText =
      markdown.substring(0, start) +
      before +
      selectedText +
      after +
      markdown.substring(end);

    setMarkdown(newText);

    // Focus back on textarea and set cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos =
        start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      handleSelectionChange();
    }, 0);
  };

  // Format selected text with markdown syntax
  const formatText = (type: string) => {
    if (!textareaRef.current) return;

    const { start, end } = selection;
    const selectedText = markdown.substring(start, end);

    switch (type) {
      case "bold":
        insertText("**", "**");
        break;
      case "italic":
        insertText("*", "*");
        break;
      case "heading1":
        insertText("# ");
        break;
      case "heading2":
        insertText("## ");
        break;
      case "heading3":
        insertText("### ");
        break;
      case "quote":
        insertText("> ");
        break;
      case "code":
        if (selectedText.includes("\n")) {
          insertText("```\n", "\n```");
        } else {
          insertText("`", "`");
        }
        break;
      case "link":
        insertText("[", "](https://)");
        break;
      case "image":
        insertText("![alt text](", ")");
        break;
      case "list":
        insertText("- ");
        break;
      case "ordered-list":
        insertText("1. ");
        break;
      case "table":
        insertText(
          "| Header 1 | Header 2 | Header 3 |\n| --- | --- | --- |\n| Row 1, Col 1 | Row 1, Col 2 | Row 1, Col 3 |\n| Row 2, Col 1 | Row 2, Col 2 | Row 2, Col 3 |"
        );
        break;
      case "cta":
        insertText(
          "[CTA:title=Kliknij tutaj,url=https://example.com,color=orange]"
        );
        break;
      case "tldr":
        insertText("\n\n## TL;DR\n\n");
        break;
      case "faq":
        insertText(
          "\n\n## FAQ\n\n**Pytanie 1?**\n\nOdpowiedź 1\n\n**Pytanie 2?**\n\nOdpowiedź 2\n\n"
        );
        break;
      default:
        break;
    }
  };

  // Toolbar buttons configuration
  const toolbarButtons: ToolbarButton[] = [
    {
      icon: <Heading1 size={18} />,
      title: "Nagłówek 1",
      action: () => formatText("heading1"),
    },
    {
      icon: <Heading2 size={18} />,
      title: "Nagłówek 2",
      action: () => formatText("heading2"),
    },
    {
      icon: <Heading3 size={18} />,
      title: "Nagłówek 3",
      action: () => formatText("heading3"),
    },
    {
      icon: <Bold size={18} />,
      title: "Pogrubienie",
      action: () => formatText("bold"),
    },
    {
      icon: <Italic size={18} />,
      title: "Kursywa",
      action: () => formatText("italic"),
    },
    {
      icon: <List size={18} />,
      title: "Lista",
      action: () => formatText("list"),
    },
    {
      icon: <ListOrdered size={18} />,
      title: "Lista numerowana",
      action: () => formatText("ordered-list"),
    },
    {
      icon: <Quote size={18} />,
      title: "Cytat",
      action: () => formatText("quote"),
    },
    {
      icon: <Code size={18} />,
      title: "Kod",
      action: () => formatText("code"),
    },
    {
      icon: <Link size={18} />,
      title: "Link",
      action: () => formatText("link"),
    },
    {
      icon: <Image size={18} />,
      title: "Obraz",
      action: () => formatText("image"),
    },
    {
      icon: <Table size={18} />,
      title: "Tabela",
      action: () => formatText("table"),
    },
  ];

  // Special buttons for TL;DR and FAQ
  const specialButtons: ToolbarButton[] = [
    {
      icon: <span className="text-xs font-bold">TL;DR</span>,
      title: "Dodaj sekcję TL;DR",
      action: () => formatText("tldr"),
    },
    {
      icon: <span className="text-xs font-bold">FAQ</span>,
      title: "Dodaj sekcję FAQ",
      action: () => formatText("faq"),
    },
    {
      icon: <span className="text-xs font-bold">CTA</span>,
      title: "Dodaj przycisk CTA",
      action: () => formatText("cta"),
    },
  ];

  // Handle save action
  const handleSave = async () => {
    if (onSave) {
      setIsSaving(true);
      try {
        await onSave();
      } catch (error) {
        console.error("Error saving:", error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  // Custom components for markdown rendering
  const components = {
    // Custom code block with syntax highlighting
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          style={tomorrow}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    // Custom CTA button renderer
    p({ node, children, ...props }: any) {
      const child = children?.[0];

      if (
        typeof child === "string" &&
        child.startsWith("[CTA:") &&
        child.endsWith("]")
      ) {
        try {
          const ctaContent = child.slice(5, -1);
          const params = new Map();

          ctaContent.split(",").forEach((param) => {
            const [key, value] = param.split("=");
            if (key && value) {
              params.set(key.trim(), value.trim());
            }
          });

          const title = params.get("title") || "Click Here";
          const url = params.get("url") || "#";
          const color = params.get("color") || "orange";

          const colorClasses: Record<string, string> = {
            orange: "bg-orange-500 hover:bg-orange-600 text-white",
            blue: "bg-blue-500 hover:bg-blue-600 text-white",
            green: "bg-green-500 hover:bg-green-600 text-white",
            red: "bg-red-500 hover:bg-red-600 text-white",
            gray: "bg-gray-500 hover:bg-gray-600 text-white",
          };

          const buttonClass = colorClasses[color] || colorClasses.orange;

          return (
            <div className="my-6 text-center">
              <a
                href={url}
                className={`inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-colors ${buttonClass}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {title}
              </a>
            </div>
          );
        } catch (error) {
          console.error("Error parsing CTA:", error);
          return <p {...props}>{children}</p>;
        }
      }

      return <p {...props}>{children}</p>;
    },
    // Add table of contents based on headings
    h2({ node, children, ...props }: any) {
      const id = children
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");

      return (
        <h2 id={id} {...props}>
          {children}
        </h2>
      );
    },
  };

  return (
    <div className="flex flex-col border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap items-center gap-1">
        {toolbarButtons.map((button, index) => (
          <button
            key={index}
            type="button"
            onClick={button.action}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
            title={button.title}
          >
            {button.icon}
          </button>
        ))}

        <div className="h-6 w-px bg-gray-300 mx-1"></div>

        {specialButtons.map((button, index) => (
          <button
            key={index}
            type="button"
            onClick={button.action}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
            title={button.title}
          >
            {button.icon}
          </button>
        ))}

        <div className="flex-grow"></div>

        <button
          type="button"
          onClick={() => setShowHelp(!showHelp)}
          className={`p-2 rounded transition-colors ${
            showHelp
              ? "text-blue-600 bg-blue-100"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
          }`}
          title="Pomoc"
        >
          <HelpCircle size={18} />
        </button>

        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className={`p-2 rounded transition-colors ${
            showPreview
              ? "text-green-600 bg-green-100"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
          }`}
          title={showPreview ? "Edytuj" : "Podgląd"}
        >
          {showPreview ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>

        {onSave && (
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="p-2 text-orange-600 hover:text-orange-700 hover:bg-orange-100 rounded transition-colors"
            title="Zapisz"
          >
            <Save size={18} />
          </button>
        )}

        {autoSaveStatus !== "idle" && (
          <span
            className={`text-xs ${
              autoSaveStatus === "saving" ? "text-gray-500" : "text-green-600"
            }`}
          >
            {autoSaveStatus === "saving" ? "Zapisywanie..." : "Zapisano"}
          </span>
        )}
      </div>

      {/* Help Panel */}
      {showHelp && (
        <div className="bg-blue-50 p-4 text-sm border-b border-blue-200">
          <h3 className="font-bold text-blue-800 mb-2">Skróty Markdown</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <div>
              <code># Tekst</code> - Nagłówek 1
            </div>
            <div>
              <code>## Tekst</code> - Nagłówek 2
            </div>
            <div>
              <code>### Tekst</code> - Nagłówek 3
            </div>
            <div>
              <code>**Tekst**</code> - Pogrubienie
            </div>
            <div>
              <code>*Tekst*</code> - Kursywa
            </div>
            <div>
              <code>[Tekst](url)</code> - Link
            </div>
            <div>
              <code>![alt](url)</code> - Obraz
            </div>
            <div>
              <code>- Tekst</code> - Lista
            </div>
            <div>
              <code>1. Tekst</code> - Lista numerowana
            </div>
            <div>
              <code>```kod```</code> - Blok kodu
            </div>
            <div>
              <code>{">"} Tekst</code> - Cytat
            </div>
            <div>
              <code>|a|b|</code> - Tabela
            </div>
          </div>
          <p className="mt-2 text-blue-700">
            <strong>Specjalne znaczniki:</strong>{" "}
            [CTA:title=Tekst,url=URL,color=kolor] - przycisk CTA
          </p>
        </div>
      )}

      <div className="flex flex-col md:flex-row flex-grow">
        {/* Editor */}
        {!showPreview && (
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={markdown}
              onChange={(e) => {
                if (autoSaveStatus !== "saving") {
                  setMarkdown(e.target.value);
                }
              }}
              onSelect={handleSelectionChange}
              onClick={handleSelectionChange}
              onKeyUp={handleSelectionChange}
              className="w-full h-full p-4 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              style={{ height, minHeight: "200px" }}
              placeholder={placeholder}
              readOnly={autoSaveStatus === "saving"}
            />
          </div>
        )}

        {/* Preview */}
        {showPreview && (
          <div
            className="flex-1 p-4 overflow-auto bg-white"
            style={{ height, minHeight: "200px" }}
          >
            <div className="prose max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
                components={components}
              >
                {markdown}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-gray-50 border-t border-gray-300 px-3 py-1 text-xs text-gray-500 flex justify-between">
        <div>
          {markdown.length} znaków |{" "}
          {markdown.split(/\s+/).filter(Boolean).length} słów
        </div>
        <div>
          Linia: {markdown.substring(0, selection.start).split("\n").length}
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;
