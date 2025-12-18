import { Link } from 'lucide-react';
import type { MDXComponents } from 'mdx/types';

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

    ul: ({ children }) => <ul className="my-4 list-disc pl-6">{children}</ul>,

    li: ({ children }) => <li className="mb-2 leading-relaxed">{children}</li>,

    pre: ({ children }) => (
      <pre className="my-6 overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
        {children}
      </pre>
    ),

    code: ({ children, className }) => {
      const isBlock = className?.includes('language-');

      if (isBlock) {
        return <code className={className}>{children}</code>;
      }

      return (
        <code className="text-primary-700 rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm">
          {children}
        </code>
      );
    },

    u: ({ children }) => <span className="underline">{children}</span>,

    em: ({ children }) => <span className="italic">{children}</span>,

    img: ({ src, alt }) => (
      <img src={src} alt={alt} className="my-6 w-full rounded-lg" loading="lazy" />
    ),

    table: ({ children }) => (
      <table className="my-4 w-full table-auto border-collapse border border-gray-300">
        {children}
      </table>
    ),

    thead: ({ children }) => <thead className="bg-gray-100">{children}</thead>,

    tbody: ({ children }) => <tbody>{children}</tbody>,

    tr: ({ children }) => <tr className="border-b border-gray-300">{children}</tr>,

    th: ({ children }) => (
      <th className="border border-gray-300 px-4 py-2 text-left font-bold">{children}</th>
    ),

    td: ({ children }) => <td className="border border-gray-300 px-4 py-2">{children}</td>,

    a: ({ href = '', children }) => {
      const isExternal = href.startsWith('http');

      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-800 underline underline-offset-4"
          >
            {children}
          </a>
        );
      }

      return (
        <Link
          href={href}
          className="text-primary-600 hover:text-primary-800 underline underline-offset-4"
        >
          {children}
        </Link>
      );
    },

    ...components,
  };
}
