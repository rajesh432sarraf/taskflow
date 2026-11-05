import React, { useState, useEffect } from 'react';
import { Server, RefreshCw, Terminal } from 'lucide-react';
import api from '../services/api';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';

/**
 * Dedicated System Health and API Diagnostics Page.
 */
export default function HealthPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/health');
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Health check failed');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">System Health & Diagnostics</h1>
          <p className="text-sm text-emerald-200/70 mt-1">
            Real-time status of backend services and database connection.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          icon={RefreshCw}
          isLoading={loading}
          onClick={checkHealth}
          className="border border-emerald-500/30 text-emerald-300 hover:text-white hover:bg-white/10"
        >
          Refresh Status
        </Button>
      </div>

      {loading && <Loader size="lg" text="Querying backend health endpoint..." fullHeight />}

      {error && (
        <ErrorMessage
          title="Health Check Failed"
          message={error}
          onRetry={checkHealth}
        />
      )}

      {data && (
        <div className="bg-white/[0.04] backdrop-blur-md rounded-2xl border border-emerald-500/20 p-6 shadow-xl space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-emerald-500/15">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.3)]">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Endpoint: /api/health</h2>
              <span className="text-xs text-emerald-300 font-semibold flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Status: 200 OK • Database Connected
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 mb-2">
              <Terminal className="w-3.5 h-3.5" />
              <span>Full Diagnostic Response</span>
            </div>
            <pre className="text-xs font-mono text-emerald-200/90 overflow-x-auto p-3.5 bg-black/40 rounded-lg border border-white/5">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

