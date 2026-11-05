import React, { useState, useEffect } from 'react';
import { Server, RefreshCw, Terminal, CheckCircle2, AlertCircle } from 'lucide-react';
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
          <h1 className="text-2xl font-bold text-[#202938]">System Health & Diagnostics</h1>
          <p className="text-sm text-[#667085] mt-1">
            Real-time status of backend services and database connection.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          icon={RefreshCw}
          isLoading={loading}
          onClick={checkHealth}
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
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[#E5E7EB]">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#27845B] flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#202938]">Endpoint: /api/health</h2>
              <span className="text-xs text-[#667085]">Status: 200 OK</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#F1F3F5] border border-[#E5E7EB]">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#667085] mb-2">
              <Terminal className="w-3.5 h-3.5" />
              <span>Full Diagnostic Response</span>
            </div>
            <pre className="text-xs font-mono text-[#202938] overflow-x-auto p-3 bg-white rounded-lg border border-[#E5E7EB]">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

