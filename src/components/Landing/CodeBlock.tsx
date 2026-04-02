import { useState } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language: 'bash' | 'javascript' | 'typescript' | 'json' | 'php';
  title?: string;
  showLineNumbers?: boolean;
}

export default function CodeBlock({
  code,
  language,
  title,
  showLineNumbers = true
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Use nightOwl theme which is dark and works well
  const theme = themes.nightOwl;

  return (
    <div className="glass-card overflow-hidden group">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          {title && (
            <span className="text-sm text-gray-400 ml-2 font-mono">{title}</span>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm text-gray-300"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Code */}
      <div className="overflow-x-auto p-4">
        <Highlight
          theme={theme}
          code={code.trim()}
          language={language}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={`${className} text-sm leading-relaxed font-mono`}
              style={{
                ...style,
                background: 'transparent',
                padding: 0,
                margin: 0,
              }}
            >
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })} className="table-row">
                  {showLineNumbers && (
                    <span className="table-cell text-right pr-4 text-gray-600 select-none w-12">
                      {i + 1}
                    </span>
                  )}
                  <span className="table-cell">
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </span>
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
}
