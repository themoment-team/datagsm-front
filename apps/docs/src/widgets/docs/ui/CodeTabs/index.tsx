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
  activeTabIndex?: number;
  onChange?: (index: number) => void;
}

export const CodeTab = () => null;

const CodeTabs = ({ children, activeTabIndex, onChange }: CodeTabsProps) => {
  const tabs = Children.toArray(children).filter(
    (child): child is React.ReactElement<CodeTabProps> => isValidElement(child),
  );

  const [internalActiveTab, setInternalActiveTab] = useState(0);
  
  const isControlled = activeTabIndex !== undefined;
  const activeTab = isControlled ? activeTabIndex : internalActiveTab;

  const handleTabChange = (index: number) => {
    if (!isControlled) {
      setInternalActiveTab(index);
    }
    onChange?.(index);
  };

  const { copied, copy } = useCopyToClipboard();

  const handleCopy = () => {
    const code = tabs[activeTab]?.props.code;
    if (code) {
      copy(String(code).trim());
    }
  };

  return (
    <div className="my-6 overflow-hidden border-2 border-foreground pixel-shadow-sm">
      <div className="flex items-center justify-between border-b-2 border-foreground bg-gray-900">
        <div className="flex">
          {tabs.map((tab, index) => (
            <button
              key={tab.props.label}
              onClick={() => handleTabChange(index)}
              className={`px-4 py-2 text-xs font-medium uppercase tracking-widest transition-colors font-mono ${
                activeTab === index
                  ? 'border-b-2 border-white bg-gray-800 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              }`}
            >
              {tab.props.label}
            </button>
          ))}
        </div>
        <button
          onClick={handleCopy}
          className="mr-2 cursor-pointer border border-gray-600 px-3 py-1 text-xs font-medium text-gray-400 transition-colors hover:border-gray-300 hover:text-gray-200 font-mono"
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
                borderRadius: 0,
                margin: 0,
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
