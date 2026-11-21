import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Copy, Check, FileCode, Maximize2, Minimize2 } from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';
import { toast } from 'sonner';

interface CodeViewerProps {
  code: string;
  filename: string;
  language?: string;
  lineCount?: number;
  height?: string;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  code,
  filename,
  language = 'python',
  lineCount,
  height = '480px',
}) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const theme = useAppStore((s) => s.theme);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Source code copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = lineCount || code.split('\n').length;

  return (
    <div
      className={`rounded-xl border border-white/10 dark:border-white/10 light:border-slate-200 overflow-hidden bg-[#0c101d] transition-all duration-300 ${
        isExpanded ? 'fixed inset-4 z-50 shadow-2xl flex flex-col' : 'relative'
      }`}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#090d18] border-b border-white/5 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-violet-400" />
          <span className="font-mono font-medium text-slate-200">{filename}</span>
          <span className="text-slate-500 font-mono">({lines} lines)</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
            title="Copy code"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 text-xs font-medium">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
            title={isExpanded ? 'Collapse' : 'Expand full screen'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className={`relative ${isExpanded ? 'flex-1' : ''}`}>
        <Editor
          height={isExpanded ? '100%' : height}
          language={language}
          value={code}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          options={{
            readOnly: true,
            domReadOnly: true,
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true,
            padding: { top: 12, bottom: 12 },
            renderLineHighlight: 'all',
          }}
          loading={
            <div className="p-4 font-mono text-xs text-slate-400 bg-[#0c101d] h-full overflow-auto">
              <pre>
                <code>{code}</code>
              </pre>
            </div>
          }
        />
      </div>
    </div>
  );
};
