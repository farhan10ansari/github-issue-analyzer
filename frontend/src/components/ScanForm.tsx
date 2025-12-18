import { useState } from 'react';
import { apiClient, type ScanResponse } from '../api/client';
import { Loader2, CheckCircle, Database } from 'lucide-react';

export const ScanForm = () => {
  const [repo, setRepo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<ScanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repo) return;

    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await apiClient.post<ScanResponse>('/scan', { repo });
      setData(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <div className="flex items-center gap-2 mb-4 text-blue-600">
        <Database size={20} />
        <h2 className="text-xl font-bold">1. Scan Repository</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            GitHub Repo (owner/name)
          </label>
          <input
            type="text"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            placeholder="e.g. facebook/react"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <button
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex justify-center items-center gap-2 transition-colors"
        >
          {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Fetch & Cache Issues'}
        </button>
      </form>

      {data && (
        <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md flex items-center gap-2 text-sm">
          <CheckCircle size={16} />
          <span>
            Success! Fetched {data.issues_fetched} issues for {data.repo}.
          </span>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          Error: {error}
        </div>
      )}
    </div>
  );
};
