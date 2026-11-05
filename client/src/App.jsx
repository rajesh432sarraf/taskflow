import { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Server, 
  Database, 
  Layout, 
  ShieldCheck, 
  ArrowRight,
  Terminal,
  Activity,
  Layers
} from 'lucide-react';
import api from './services/api';

function App() {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/health');
      setHealthData(response.data);
      setLastChecked(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('API Health check error:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Unable to connect to TaskFlow Backend API'
      );
      setHealthData(null);
      setLastChecked(new Date().toLocaleTimeString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#202938] flex flex-col justify-between">
      {/* Top Header */}
      <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-10 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#27845B] flex items-center justify-center text-white shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-[#202938]">TaskFlow</span>
                <span className="text-xs bg-[#27845B]/10 text-[#27845B] font-medium px-2 py-0.5 rounded-full border border-[#27845B]/20">
                  Phase 1 MVP
                </span>
              </div>
              <p className="text-xs text-[#667085] hidden sm:block">Personal Task & Productivity Manager</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-[#F1F3F5] text-[#667085]">
              Team: Golden Eagles
            </span>
            <button
              onClick={fetchHealth}
              disabled={loading}
              className="inline-flex items-center space-x-1.5 text-xs font-medium bg-white border border-[#E5E7EB] text-[#202938] px-3 py-1.5 rounded-lg hover:bg-[#F7F8FA] focus:outline-hidden focus:ring-2 focus:ring-[#27845B] transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#27845B]' : ''}`} />
              <span>{loading ? 'Checking...' : 'Ping API'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* Welcome Banner */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#202938]">
            System Foundation & Connectivity Status
          </h1>
          <p className="text-sm sm:text-base text-[#667085] mt-1">
            MERN foundation successfully scaffolded. Verified React client, Express API, and Tailwind CSS design tokens.
          </p>
        </div>

        {/* Live Connectivity Card */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E5E7EB] gap-4">
            <div className="flex items-center space-x-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                loading ? 'bg-amber-50 text-amber-600' :
                error ? 'bg-rose-50 text-[#D64545]' :
                'bg-emerald-50 text-[#27845B]'
              }`}>
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#202938]">Backend API Health Check</h2>
                <p className="text-xs text-[#667085]">
                  Endpoint: <code className="bg-[#F1F3F5] text-[#202938] px-1.5 py-0.5 rounded font-mono">GET /api/health</code>
                  {lastChecked && ` • Last ping: ${lastChecked}`}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {loading ? (
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  <span>Verifying connectivity...</span>
                </span>
              ) : error ? (
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-50 text-[#D64545] border border-rose-200">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Connection Failed</span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-[#27845B] border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>API Operational</span>
                </span>
              )}
            </div>
          </div>

          {/* Diagnostic Details Grid */}
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
                    ? 'Awaiting Atlas URI'
                    : 'Unknown'}
              </span>
              <span className="text-xs text-[#667085] mt-1 block">
                {healthData?.database === 'connected' ? 'Mongoose ready' : 'Configure in .env'}
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

          {/* Raw Payload Preview / Error Display */}
          {error && (
            <div className="mt-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-[#D64545]">
              <p className="font-semibold mb-1">Connection Error Details:</p>
              <p>{error}</p>
              <p className="mt-2 text-[#667085]">
                Please ensure the backend server is running via <code className="font-mono bg-white px-1 py-0.5 rounded">npm run dev</code> inside <code className="font-mono bg-white px-1 py-0.5 rounded">server/</code>.
              </p>
            </div>
          )}

          {healthData && (
            <div className="mt-6 p-4 rounded-xl bg-[#F1F3F5] border border-[#E5E7EB]">
              <div className="flex items-center space-x-2 text-xs font-semibold text-[#667085] mb-2">
                <Terminal className="w-3.5 h-3.5" />
                <span>Backend Response Payload</span>
              </div>
              <pre className="text-xs font-mono text-[#202938] overflow-x-auto">
                {JSON.stringify(healthData, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Phase 1 Scaffolding Architecture Grid */}
        <h2 className="text-lg font-bold text-[#202938] mb-4">Architecture Component Verification</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Layout className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-[#202938]">React 19 + Vite 8</h3>
            <p className="text-xs text-[#667085] mt-1">
              Modern frontend client with fast HMR, Axios service layer, React Router DOM, and Lucide icons.
            </p>
            <div className="mt-4 pt-4 border-t border-[#E5E7EB] flex items-center justify-between text-xs">
              <span className="text-[#667085]">Port</span>
              <span className="font-mono font-medium text-[#202938]">5173</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-[#202938]">Express 4 REST API</h3>
            <p className="text-xs text-[#667085] mt-1">
              Modular Node.js service with CORS protection, cookie parsing, centralized error handling, and health routing.
            </p>
            <div className="mt-4 pt-4 border-t border-[#E5E7EB] flex items-center justify-between text-xs">
              <span className="text-[#667085]">Port</span>
              <span className="font-mono font-medium text-[#202938]">5000</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#27845B] flex items-center justify-center mb-4">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-[#202938]">MongoDB + Mongoose</h3>
            <p className="text-xs text-[#667085] mt-1">
              Schema-driven data persistence ready for User and Task collections with strict tenant isolation.
            </p>
            <div className="mt-4 pt-4 border-t border-[#E5E7EB] flex items-center justify-between text-xs">
              <span className="text-[#667085]">State</span>
              <span className="font-medium text-[#27845B]">Configured in db.js</span>
            </div>
          </div>
        </div>

        {/* Next Steps Banner */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-[#27845B]" />
              <h3 className="font-semibold text-base text-[#202938]">Phase 1 Milestone Complete</h3>
            </div>
            <p className="text-xs sm:text-sm text-[#667085] mt-1">
              Phase 1 setup, connectivity, and design tokens verified. Awaiting user approval to proceed to Phase 2 (Authentication & Task CRUD).
            </p>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-xs font-semibold text-[#27845B] bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
              Ready for Phase 2
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E5E7EB] py-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#667085] gap-2">
          <span>TaskFlow • Golden Eagles MERN Project</span>
          <span>Target Deadline: Friday, 6 November 2026</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
