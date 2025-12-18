import { useState, useEffect } from 'react';
import { apiClient, type AnalyzeResponse,type RepoListResponse } from '../api/client';
import { Bot, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

export const AnalyzeForm = () => {
  const [repos, setRepos] = useState<string[]>([]);
  const [selectedRepo, setSelectedRepo] = useState('');
  const [prompt, setPrompt] = useState('Find themes across recent issues and recommend what the maintainers should fix first');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingRepos, setIsFetchingRepos] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch repos on mount
  const fetchRepos = async () => {
    setIsFetchingRepos(true);
    try {
      const res = await apiClient.get<RepoListResponse>('/repos');
      setRepos(res.data.repos);
      if (res.data.repos.length > 0) {
        setSelectedRepo(res.data.repos[0]);
      }
    } catch (err) {
      console.error("Failed to fetch repos", err);
    } finally {
      setIsFetchingRepos(false);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRepo || !prompt) return;

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const res = await apiClient.post<AnalyzeResponse>('/analyze', { repo: selectedRepo, prompt });
      setAnalysis(res.data.analysis);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Analysis failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-purple-600">
          <Bot size={24} />
          <h2 className="text-xl font-bold">Analyze Issues</h2>
        </div>
        <button 
          onClick={fetchRepos} 
          className="text-gray-500 hover:text-purple-600 transition-colors p-2 rounded-full hover:bg-purple-50"
          title="Refresh Repo List"
        >
          <RefreshCw size={18} className={isFetchingRepos ? "animate-spin" : ""} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Select Repository</label>
          {repos.length === 0 && !isFetchingRepos ? (
            <div className="p-3 bg-yellow-50 text-yellow-800 rounded-md text-sm border border-yellow-200">
              No repositories found. Please go to the <strong>Scan</strong> tab to fetch some issues first.
            </div>
          ) : (
            <select
              value={selectedRepo}
              onChange={(e) => setSelectedRepo(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block"
            >
              <option value="" disabled>-- Select a repo --</option>
              {repos.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 outline-none resize-none"
          />
        </div>

        <button
          disabled={isLoading || !selectedRepo}
          className="w-full bg-purple-600 text-white py-2.5 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 transition-all font-medium shadow-sm hover:shadow-md"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <Sparkles size={18} /> Generate Analysis
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {analysis && (
        <div className="mt-8">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">AI Analysis Result</h3>
          <div className="prose prose-sm max-w-none p-6 bg-slate-50 rounded-xl border border-gray-200 text-slate-800">
            <MarkdownRenderer content={analysis} />
          </div>
        </div>
      )}
    </div>
  );
};
