'use client';

import { Children, type ReactNode, isValidElement, useState } from 'react';

interface CodeTabProps {
  label: string;
  language: string;
  code: string;
}

interface CodeTabsProps {
  children: ReactNode;
}

export const CodeTab = ({ code }: CodeTabProps) => {
  return <>{code}</>;
};

const CodeTabs = ({ children }: CodeTabsProps) => {
  const tabs = Children.toArray(children).filter(
    (child): child is React.ReactElement<CodeTabProps> =>
      isValidElement(child) && typeof child === 'object' && child !== null && 'props' in child,
  );

  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-gray-700">
      <div className="flex border-b border-gray-700 bg-gray-800">
        {tabs.map((tab, index) => (
          <button
            key={index}
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
      <div>
        {tabs.map((tab, index) => (
          <div key={index} className={activeTab === index ? 'block' : 'hidden'}>
            <pre className="my-0 overflow-x-auto rounded-b-lg bg-gray-900 p-4 text-sm text-gray-100">
              <code className={`language-${tab.props.language}`}>
                {String(tab.props.code).trim()}
              </code>
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CodeTabs;
