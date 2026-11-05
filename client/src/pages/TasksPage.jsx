import React from 'react';
import { CheckSquare, ShieldCheck, ArrowRight, Clock } from 'lucide-react';
import Button from '../components/common/Button';

/**
 * Tasks Page placeholder shell demonstrating Phase 2 readiness.
 */
export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#202938]">
            Tasks Workspace
          </h1>
          <p className="text-sm text-[#667085] mt-1">
            Personal Task Management • Phase 2 Milestone
          </p>
        </div>

        <Button
          variant="primary"
          icon={CheckSquare}
          disabled={true}
          title="Task creation unlocks in Phase 2"
        >
          + Add Task (Phase 2)
        </Button>
      </div>

      {/* Clean Empty State Card */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-12 text-center shadow-xs flex flex-col items-center justify-center max-w-2xl mx-auto my-8">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#27845B] flex items-center justify-center mb-4">
          <Clock className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold text-[#202938]">
          Task CRUD Scheduled for Phase 2
        </h2>
        <p className="text-sm text-[#667085] mt-2 max-w-md leading-relaxed">
          The Phase 1 foundation, layout architecture, and component libraries are verified.
          Task creation, status toggling, search, and priority filters will be implemented in Phase 2.
        </p>

        <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-[#27845B] bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
          <ShieldCheck className="w-4 h-4" />
          <span>Strict Phase Boundary Maintained</span>
        </div>
      </div>
    </div>
  );
}

