import Image from 'next/image';
import NextLink from 'next/link';

import type { MDXComponents } from 'mdx/types';

import CodeTabs, { CodeTab } from '@/widgets/docs/ui/CodeTabs';
import { LoginButton } from '@/widgets/docs/ui/LoginButton';
import { LoginButtonInteractiveDemo } from '@/widgets/docs/ui/LoginButtonInteractiveDemo';

import { CodeBlock, Mermaid } from './shared/ui';

const pixelStyle = { fontFamily: '"Press Start 2P", monospace' };
const monoStyle = { fontFamily: '"JetBrains Mono", monospace' };

export function useMDXComponents(components: MDXComponents = {}): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1
        className="mb-6 mt-12 border-b-2 border-foreground pb-4 text-foreground"
        style={{ ...pixelStyle, fontSize: '20px', lineHeight: '1.8' }}
      >
        {children}
      </h1>
    ),

    h2: ({ children }) => (
      <h2
        className="mb-4 mt-10 text-2xl font-bold text-foreground"
      >
        {children}
      </h2>
    ),

    h3: ({ children }) => (
      <h3 className="mb-2 mt-8 text-xl font-bold text-foreground">{children}</h3>
    ),

    h4: ({ children }) => (
      <h4 className="mb-2 mt-6 text-lg font-semibold text-foreground">{children}</h4>
    ),

    ul: ({ children }) => <ul className="my-4 list-disc pl-6">{children}</ul>,

    li: ({ children }) => <li className="mb-2 leading-relaxed">{children}</li>,

    pre: ({ children }) => <div className="my-6">{children}</div>,

    code: ({ children, className }: { children: React.ReactNode; className?: string }) => {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';

      if (language === 'mermaid') {
        return <Mermaid chart={String(children).replace(/\n$/, '')} />;
      }

      if (language) {
        return (
          <div className="border-2 border-foreground" style={{ boxShadow: '3px 3px 0 0 oklch(0.04 0 0)' }}>
            <CodeBlock language={language}>{String(children).replace(/\n$/, '')}</CodeBlock>
          </div>
        );
      }

      return (
        <code
          className="border border-foreground/30 bg-muted px-1.5 py-0.5 text-sm text-foreground"
          style={monoStyle}
        >
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
        className="my-6 h-auto w-full border-2 border-foreground"
      />
    ),

    table: ({ children }) => (
      <div className="my-4 overflow-x-auto border-2 border-foreground" style={{ boxShadow: '3px 3px 0 0 oklch(0.04 0 0)' }}>
        <table className="w-full table-auto border-collapse">
          {children}
        </table>
      </div>
    ),

    thead: ({ children }) => <thead className="bg-foreground text-background">{children}</thead>,

    tbody: ({ children }) => <tbody>{children}</tbody>,

    tr: ({ children }) => <tr className="border-b border-foreground/15 transition-colors hover:bg-muted/40">{children}</tr>,

    th: ({ children }) => (
      <th
        className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-background"
        style={monoStyle}
      >
        {children}
      </th>
    ),

    td: ({ children }) => (
      <td className="whitespace-nowrap px-4 py-3 text-sm">{children}</td>
    ),

    a: ({ href = '', children }) => {
      const isExternal = href.startsWith('http');

      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline underline-offset-4 hover:opacity-70"
          >
            {children} ↗
          </a>
        );
      }

      return (
        <NextLink
          href={href}
          className="font-medium text-foreground underline underline-offset-4 hover:opacity-70"
        >
          {children}
        </NextLink>
      );
    },

    CodeTabs,
    CodeTab,
    LoginButton,
    LoginButtonInteractiveDemo,

    ...components,
  };
}
