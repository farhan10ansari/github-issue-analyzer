import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
     <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                 // (Reuse the same components config from previous step for styling)
                 h1: ({node, ...props}) => <h1 className="text-xl font-bold text-gray-900 mb-3" {...props} />,
                 h2: ({node, ...props}) => <h2 className="text-lg font-bold text-gray-900 mt-4 mb-2" {...props} />,
                 ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 space-y-1" {...props} />,
                 li: ({node, ...props}) => <li className="text-gray-700" {...props} />,
                 p: ({node, ...props}) => <p className="mb-4 leading-relaxed" {...props} />,
                 code: ({node, ...props}) => <code className="bg-gray-200 px-1.5 py-0.5 rounded text-sm text-pink-600 font-mono" {...props} />,
              }}
            >
              {content}
            </ReactMarkdown>
  );
}