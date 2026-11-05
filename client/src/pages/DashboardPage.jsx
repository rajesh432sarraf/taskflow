import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Layers, 
  CheckSquare, 
  Clock, 
  CheckCircle,
  Database,
  Server,
  Layout,
  Terminal,
  ArrowRight
} from 'lucide-react';
import api from '../services/api';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';

export default function DashboardPage() {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastPingTime, setLastPingTime] = useState(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/health');
      setHealthData(response.data);
      setLastPingTime(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('API Health check error:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Unable to connect to TaskFlow Backend API'
      );
      setHealthData(null);
      setLastPingTime(new Date().toLocaleTimeString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#202938]">
          Welcome to TaskFlow
        </h1>
        <p className="text-sm sm:text-base text-[#667085] mt-1">
          Personal Task & Productivity Manager • Phase 1 Foundation & System Status
        </p>
      </div>

      {/* Task Summary Stat Cards (Design System Preview) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between text-[#667085] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Tasks</span>
            <div className="w-8 h-8 rounded-lg bg-[#F1F3F5] text-[#202938] flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#202938]">0</span>
            <span className="text-[11px] font-medium text-[#27845B] bg-[#27845B]/10 px-2 py-0.5 rounded-full">
              Phase 2 Scope
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between text-[#667085] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#202938]">0</span>
            <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              Ready
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between text-[#667085] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">In Progress</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#202938]">0</span>
            <span className="text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
              Ready
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between text-[#667085] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Completed</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#27845B] flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#202938]">0</span>
            <span className="text-[11px] font-medium text-[#27845B] bg-[#27845B]/10 px-2 py-0.5 rounded-full">
              Ready
            </span>
          </div>
        </div>
      </div>

      {/* Backend API & Live Connection Panel */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E5E7EB] gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
              loading ? 'bg-amber-50 text-amber-600' :
              error ? 'bg-rose-50 text-[#D64545]' :
              'bg-emerald-50 text-[#27845B]'
            }`}>
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#202938]">Backend API & Database Connectivity</h2>
              <p className="text-xs text-[#667085]">
                Endpoint: <code className="bg-[#F1F3F5] text-[#202938] px-1.5 py-0.5 rounded font-mono">GET /api/health</code>
                {lastPingTime && ` • Last ping: ${lastPingTime}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {loading ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span>Connecting...</span>
              </span>
            ) : error ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-50 text-[#D64545] border border-rose-200">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Connection Failed</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-[#27845B] border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>API Operational</span>
              </span>
            )}

            <Button
              variant="secondary"
              size="sm"
              icon={RefreshCw}
              isLoading={loading}
              onClick={fetchHealth}
            >
              Ping API
            </Button>
          </div>
        </div>

        {/* Diagnostic Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB]">
            <span className="text-xs font-medium text-[#667085] block">API Service</span>
            <span className="text-base font-semibold text-[#202938] mt-1 block">
              {error ? 'Unreachable' : healthData?.success ? 'Express Running' : 'Initializing'}
            </span>
            <span className="text-xs text-[#667085] mt-1 block">Port 5000 (HTTP)</span>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB]">
            <span className="text-xs font-medium text-[#667085] block">Database Status</span>
            <span className={`text-base font-semibold mt-1 block ${
              healthData?.database === 'connected' ? 'text-[#27845B]' : 'text-[#B7791F]'
            }`}>
              {healthData?.database === 'connected' 
                ? 'Atlas Connected' 
                : healthData?.database === 'disconnected'
                  ? 'Disconnected'
                  : 'Checking...'}
            </span>
            <span className="text-xs text-[#667085] mt-1 block">
              {healthData?.database === 'connected' ? 'Mongoose active' : 'Awaiting IP Whitelist'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB]">
            <span className="text-xs font-medium text-[#667085] block">Environment</span>
            <span className="text-base font-semibold text-[#202938] mt-1 block capitalize">
              {healthData?.environment || 'Development'}
            </span>
            <span className="text-xs text-[#667085] mt-1 block">Local workspace</span>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB]">
            <span className="text-xs font-medium text-[#667085] block">Server Uptime</span>
            <span className="text-base font-semibold text-[#202938] mt-1 block font-mono">
              {healthData?.uptime !== undefined ? `${healthData.uptime}s` : '—'}
            </span>
            <span className="text-xs text-[#667085] mt-1 block">Process runtime</span>
          </div>
        </div>

        {/* Error banner if present */}
        {error && (
          <div className="mt-6">
            <ErrorMessage
              title="Backend Connection Error"
              message={error}
              onRetry={fetchHealth}
            />
          </div>
        )}

        {/* Live Payload Inspector */}
        {healthData && (
          <div className="mt-6 p-4 rounded-xl bg-[#F1F3F5] border border-[#E5E7EB]">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#667085] mb-2">
              <Terminal className="w-3.5 h-3.5" />
              <span>Live Health Check Response</span>
            </div>
            <pre className="text-xs font-mono text-[#202938] overflow-x-auto p-2 bg-white rounded-lg border border-[#E5E7EB]">
              {JSON.stringify(healthData, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* MERN Architecture Overview */}
      <div>
        <h2 className="text-lg font-bold text-[#202938] mb-4">Architecture Component Verification</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#27845B] flex items-center justify-center mb-4">
              <Layout className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-[#202938]">React 19 + Vite 8</h3>
            <p className="text-xs text-[#667085] mt-1">
              Modular frontend structure, React Router DOM, Axios service layer, Lucide icons, and Tailwind CSS design tokens.
            </p>
            <div className="mt-4 pt-4 border-t border-[#E5E7EB] flex items-center justify-between text-xs">
              <span className="text-[#667085]">Port</span>
              <span className="font-mono font-semibold text-[#202938]">5173</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#27845B] flex items-center justify-center mb-4">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-[#202938]">Express 4 REST API</h3>
            <p className="text-xs text-[#667085] mt-1">
              Modular Node.js service with explicit CORS, cookie parser, centralized error handling, and health routing.
            </p>
            <div className="mt-4 pt-4 border-t border-[#E5E7EB] flex items-center justify-between text-xs">
              <span className="text-[#667085]">Port</span>
              <span className="font-mono font-semibold text-[#202938]">5000</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#27845B] flex items-center justify-center mb-4">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-[#202938]">MongoDB Atlas</h3>
            <p className="text-xs text-[#667085] mt-1">
              Cluster configured with Mongoose driver, DNS fallback, connection timeout, and user-scoped schema architecture.
            </p>
            <div className="mt-4 pt-4 border-t border-[#E5E7EB] flex items-center justify-between text-xs">
              <span className="text-[#667085]">Driver</span>
              <span className="font-semibold text-[#27845B]">Mongoose 8.9.5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
