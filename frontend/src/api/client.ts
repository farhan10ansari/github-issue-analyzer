import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export type ScanResponse = {
  repo: string;
  issues_fetched: number;
  cached_successfully: boolean;
};

export type AnalyzeResponse = {
  analysis: string;
};

export type RepoListResponse = {
  repos: string[];
};