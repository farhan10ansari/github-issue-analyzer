import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ScanForm } from './components/ScanForm';
import { AnalyzeForm } from './components/AnalyzeForm';
import { Database, Bot } from 'lucide-react';
import clsx from 'clsx';

const queryClient = new QueryClient();

function App() {
  const [activeTab, setActiveTab] = useState<'scan' | 'analyze'>('scan');

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
          
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              GitHub Issue Analyzer
            </h1>
            <p className="mt-3 text-lg text-gray-500">
              Fetch issues locally and analyze them using Gemini 2.5 Flash.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 inline-flex">
              <button
                onClick={() => setActiveTab('scan')}
                className={clsx(
                  "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all",
                  activeTab === 'scan' 
                    ? "bg-blue-600 text-white shadow-md" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <Database size={18} />
                Scan Repo
              </button>
              <button
                onClick={() => setActiveTab('analyze')}
                className={clsx(
                  "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all",
                  activeTab === 'analyze' 
                    ? "bg-purple-600 text-white shadow-md" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <Bot size={18} />
                Analyze Issues
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="transition-all duration-300 ease-in-out">
            {activeTab === 'scan' ? (
              <div className="max-w-2xl mx-auto">
                <ScanForm />
              </div>
            ) : (
              <AnalyzeForm />
            )}
          </div>

        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
