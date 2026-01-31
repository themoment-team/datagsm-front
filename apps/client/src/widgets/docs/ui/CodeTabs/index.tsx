'use client';

import { Children, type ReactNode, isValidElement, useState } from 'react';

import { useCopyToClipboard } from '@repo/shared/hooks';

import { CodeBlock } from '@/shared/ui';

interface CodeTabProps {
  label: string;
  language: string;
  code: string;
}

interface CodeTabsProps {
  children: ReactNode;
}

export const CodeTab = () => null;

const CodeTabs = ({ children }: CodeTabsProps) => {
  const tabs = Children.toArray(children).filter(
    (child): child is React.ReactElement<CodeTabProps> => isValidElement(child),
  );

  const [activeTab, setActiveTab] = useState(0);
  const { copied, copy } = useCopyToClipboard();

  const handleCopy = () => {
    const code = tabs[activeTab]?.props.code;
    if (code) {
      copy(String(code).trim());
    }
  };

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-gray-700">
      <div className="flex items-center justify-between border-b border-gray-700 bg-gray-800">
        <div className="flex">
          {tabs.map((tab, index) => (
            <button
              key={tab.props.label}
              onClick={() => setActiveTab(index)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === index
                  ? 'border-b-2 border-blue-500 bg-gray-900 text-blue-400'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'
              }`}
            >
              {tab.props.label}
            </button>
          ))}
        </div>
        <button
          onClick={handleCopy}
          className="mr-2 rounded px-3 py-1 text-xs font-medium text-gray-400 transition-colors hover:bg-gray-700 hover:text-gray-200"
          title="코드 복사"
        >
          {copied ? '✓ 복사됨' : '복사'}
        </button>
      </div>
      <div>
        {tabs.map((tab, index) => (
          <div key={tab.props.label} className={activeTab === index ? 'block' : 'hidden'}>
            <CodeBlock
              language={tab.props.language}
              customStyle={{
                borderRadius: '0 0 0.5rem 0.5rem',
              }}
            >
              {String(tab.props.code).trim()}
            </CodeBlock>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CodeTabs;
