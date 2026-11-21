import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppLayout } from './layouts/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { LabExplorerPage } from './pages/LabExplorerPage';
import { LabDetailPage } from './pages/LabDetailPage';
import { WorkflowVisualizerPage } from './pages/WorkflowVisualizerPage';
import { ToolsRegistryPage } from './pages/ToolsRegistryPage';
import { SkillsRegistryPage } from './pages/SkillsRegistryPage';
import { MemoryExplorerPage } from './pages/MemoryExplorerPage';
import { ExecutionHistoryPage } from './pages/ExecutionHistoryPage';
import { EvaluationCenterPage } from './pages/EvaluationCenterPage';
import { SystemArchitecturePage } from './pages/SystemArchitecturePage';
import { SettingsPage } from './pages/SettingsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5000,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/labs" element={<LabExplorerPage />} />
            <Route path="/labs/:id" element={<LabDetailPage />} />
            <Route path="/workflows" element={<WorkflowVisualizerPage />} />
            <Route path="/tools" element={<ToolsRegistryPage />} />
            <Route path="/skills" element={<SkillsRegistryPage />} />
            <Route path="/memory" element={<MemoryExplorerPage />} />
            <Route path="/history" element={<ExecutionHistoryPage />} />
            <Route path="/evaluations" element={<EvaluationCenterPage />} />
            <Route path="/architecture" element={<SystemArchitecturePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
