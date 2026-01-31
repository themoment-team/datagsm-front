import Image from 'next/image';
import NextLink from 'next/link';

import type { MDXComponents } from 'mdx/types';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import http from 'react-syntax-highlighter/dist/esm/languages/prism/http';
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import kotlin from 'react-syntax-highlighter/dist/esm/languages/prism/kotlin';
import powershell from 'react-syntax-highlighter/dist/esm/languages/prism/powershell';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

import CodeTabs, { CodeTab } from '@/widgets/docs/ui/CodeTabs';

SyntaxHighlighter.registerLanguage('http', http);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('kotlin', kotlin);
SyntaxHighlighter.registerLanguage('powershell', powershell);

export function useMDXComponents(components: MDXComponents = {}): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="text-primary-linear mb-4 mt-10 text-[2.5rem] font-bold">{children}</h1>
    ),

    h2: ({ children }) => (
      <h2 className="text-primary-400 mb-4 mt-10 text-[2rem] font-bold">{children}</h2>
    ),

    h3: ({ children }) => (
      <h3 className="text-primary-400 mb-2 mt-8 text-[1.5rem] font-bold">{children}</h3>
    ),

    h4: ({ children }) => (
      <h4 className="text-primary-400 mb-2 mt-6 text-[1.25rem] font-bold">{children}</h4>
    ),

    ul: ({ children }) => <ul className="my-4 list-disc pl-6">{children}</ul>,

    li: ({ children }) => <li className="mb-2 leading-relaxed">{children}</li>,

    pre: ({ children }) => <div className="my-6">{children}</div>,

    code: ({ children, className }) => {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';

      if (language) {
        return (
          <SyntaxHighlighter
            language={language}
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
            }}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        );
      }

      return (
        <code className="text-primary-700 rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm">
          {children}
        </code>
      );
    },

    u: ({ children }) => <span className="underline">{children}</span>,

    em: ({ children }) => <span className="italic">{children}</span>,

    img: ({ src = '', alt = '' }) => (
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={700}
        sizes="100vw"
        className="my-6 h-auto w-full rounded-lg"
      />
    ),

    table: ({ children }) => (
      <div className="my-4 overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-300">
          {children}
        </table>
      </div>
    ),

    thead: ({ children }) => <thead className="bg-gray-100">{children}</thead>,

    tbody: ({ children }) => <tbody>{children}</tbody>,

    tr: ({ children }) => <tr className="border-b border-gray-300">{children}</tr>,

    th: ({ children }) => (
      <th className="whitespace-nowrap border border-gray-300 px-4 py-2 text-left font-bold">
        {children}
      </th>
    ),

    td: ({ children }) => (
      <td className="whitespace-nowrap border border-gray-300 px-4 py-2">{children}</td>
    ),

    a: ({ href = '', children }) => {
      const isExternal = href.startsWith('http');

      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 underline underline-offset-4 hover:text-slate-800"
          >
            {children} ↗
          </a>
        );
      }

      return (
        <NextLink
          href={href}
          className="text-primary-600 hover:text-primary-800 underline underline-offset-4"
        >
          {children}
        </NextLink>
      );
    },

    CodeTabs,
    CodeTab,

    ...components,
  };
}
