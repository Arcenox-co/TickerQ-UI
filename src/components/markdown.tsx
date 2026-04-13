'use client';
import ReactMarkdown from 'react-markdown';

export function Markdown({ text }: { text: string }) {
  return (
    <ReactMarkdown
      components={{
        pre: ({ children }) => (
          <pre className="overflow-x-auto rounded-lg bg-fd-secondary p-3 text-sm">{children}</pre>
        ),
        code: ({ className, children, ...props }) => (
          <code className={className ?? 'rounded bg-fd-secondary px-1 py-0.5 text-sm'} {...props}>
            {children}
          </code>
        ),
        a: ({ href, children }) => (
          <a href={href} className="text-fd-primary underline" target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        ),
      }}
    >
      {text}
    </ReactMarkdown>
  );
}
