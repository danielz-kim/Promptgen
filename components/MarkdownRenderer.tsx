import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) return null;

  return (
    <div className="markdown-content text-stone-800 leading-loose font-serif text-[17px]">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-4xl font-serif font-bold tracking-tight text-stone-900 mt-10 mb-6 pb-4 border-b border-stone-200">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-serif font-semibold tracking-tight text-stone-900 mt-10 mb-4">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm font-sans font-bold uppercase tracking-widest text-stone-500 mt-8 mb-3">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-4 text-stone-700 leading-relaxed">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-outside ml-6 mb-6 space-y-2 text-stone-700">
              {children}
            </ul>
          ),
          li: ({ children }) => (
            <li className="pl-1">
              {children}
            </li>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-stone-900">
              {children}
            </strong>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};