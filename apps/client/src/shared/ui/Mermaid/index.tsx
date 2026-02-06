'use client';

import { useEffect, useState } from 'react';

interface MermaidProps {
  chart: string;
}

const Mermaid = ({ chart }: MermaidProps) => {
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const renderChart = async () => {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false, // Changed to false as we render manually
          theme: 'default',
          securityLevel: 'loose',
          fontFamily: 'inherit',
        });
        
        const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);
        setSvg(svg);
        setError(false);
      } catch (err) {
        console.error('Mermaid rendering failed:', err);
        setError(true);
      }
    };

    renderChart();
  }, [chart]);

  if (error) {
    return (
      <pre className="my-6 overflow-x-auto rounded-lg bg-red-50 p-4 text-sm text-red-600">
        <code>{chart}</code>
      </pre>
    );
  }

  if (!svg) {
    return (
      <div className="my-6 flex h-32 items-center justify-center rounded-lg bg-gray-50 text-sm text-gray-400">
        Loading diagram...
      </div>
    );
  }

  return (
    <div 
      className="my-6 flex justify-center overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: svg }} 
    />
  );
};

export default Mermaid;