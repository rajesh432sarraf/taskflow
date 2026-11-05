import React from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Edit3, 
  Trash2, 
  AlertTriangle 
} from 'lucide-react';

/**
 * Premium TaskCard Component.
 * Features left priority accent bar, status pill with glow, due date with overdue pulse, and smooth hover elevation.
 */
export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusToggle,
  isToggling = false,
}) {
  const isCompleted = task.status === 'Completed';

  // Check if task is overdue
  const isOverdue =
    task.dueDate &&
    !isCompleted &&
    new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));

  // Priority Styles with glowing indicators
  const priorityConfig = {
    Low: {
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      dot: 'bg-emerald-400 shadow-[0_0_8px_#10B981]',
      borderBar: 'bg-emerald-400 shadow-[0_0_8px_#10B981]',
    },
    Medium: {
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      dot: 'bg-amber-400 shadow-[0_0_8px_#F59E0B]',
      borderBar: 'bg-amber-400 shadow-[0_0_8px_#F59E0B]',
    },
    High: {
      badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      dot: 'bg-rose-400 shadow-[0_0_8px_#EF4444]',
      borderBar: 'bg-rose-400 shadow-[0_0_8px_#EF4444]',
    },
  }[task.priority] || {
    badge: 'bg-white/10 text-slate-300 border-white/10',
    dot: 'bg-slate-400',
    borderBar: 'bg-slate-500',
  };

  // Status Styles
  const statusBadge = {
    'Pending': 'bg-white/10 text-slate-300 border-white/10',
    'In Progress': 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    'Completed': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  }[task.status] || 'bg-white/10 text-slate-300 border-white/10';

  // Format Due Date
  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <div
      className={`group relative overflow-hidden bg-white/[0.04] backdrop-blur-md rounded-2xl border p-4 sm:p-5 shadow-lg hover:shadow-xl hover:bg-white/[0.07] transition-all duration-200 flex flex-col justify-between ${
        isCompleted
          ? 'border-emerald-500/10 bg-emerald-950/20 opacity-75'
          : isOverdue
          ? 'border-rose-500/40 bg-rose-950/20'
          : 'border-emerald-500/20 hover:border-emerald-500/40'
      }`}
    >
      {/* Left Priority Accent Stripe */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${
          isCompleted ? 'bg-slate-600' : priorityConfig.borderBar
        }`}
      />

      <div className="pl-1.5">
        {/* Top: Status checkbox & Title & Priority */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Quick Completion Toggle */}
            <button
              type="button"
              disabled={isToggling}
              onClick={() => onStatusToggle && onStatusToggle(task)}
              aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
              className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-transform active:scale-90 focus:outline-hidden cursor-pointer shrink-0 disabled:opacity-50"
            >
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <Circle className="w-5 h-5 hover:text-emerald-400" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <h4
                className={`text-sm font-semibold text-white leading-snug break-words transition-all ${
                  isCompleted ? 'line-through text-slate-500' : ''
                }`}
              >
                {task.title}
              </h4>

              {task.description && (
                <p className="mt-1 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {task.description}
                </p>
              )}
            </div>
          </div>

          {/* Priority Pill with Glowing Dot */}
          <span
            className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${priorityConfig.badge}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${priorityConfig.dot}`} />
            {task.priority}
          </span>
        </div>
      </div>

      {/* Bottom Bar: Status Badge, Date, Actions */}
      <div className="pl-1.5 mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          {/* Status Badge */}
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${statusBadge}`}
          >
            {task.status}
          </span>

          {/* Due Date Indicator */}
          {formattedDueDate && (
            <div
              className={`flex items-center gap-1.5 text-[11px] font-medium ${
                isOverdue
                  ? 'text-rose-400 font-semibold'
                  : 'text-slate-300'
              }`}
            >
              {isOverdue ? (
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              ) : (
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span>{formattedDueDate}</span>
              {isOverdue && (
                <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1 rounded font-bold">
                  Overdue
                </span>
              )}
            </div>
          )}
        </div>

        {/* Card Actions (Edit, Delete) */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-300 hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Edit task"
            title="Edit Task"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(task)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            aria-label="Delete task"
            title="Delete Task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
