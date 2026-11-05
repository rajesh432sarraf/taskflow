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
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      dot: 'bg-emerald-500 shadow-[0_0_8px_#10B981]',
      borderBar: 'bg-emerald-500',
    },
    Medium: {
      badge: 'bg-amber-50 text-amber-700 border-amber-200/80',
      dot: 'bg-amber-500 shadow-[0_0_8px_#F59E0B]',
      borderBar: 'bg-amber-500',
    },
    High: {
      badge: 'bg-rose-50 text-rose-700 border-rose-200/80',
      dot: 'bg-rose-500 shadow-[0_0_8px_#EF4444]',
      borderBar: 'bg-rose-500',
    },
  }[task.priority] || {
    badge: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
    borderBar: 'bg-slate-400',
  };

  // Status Styles
  const statusBadge = {
    'Pending': 'bg-slate-50 text-slate-700 border-slate-200',
    'In Progress': 'bg-sky-50 text-sky-700 border-sky-200',
    'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  }[task.status] || 'bg-slate-50 text-slate-700 border-slate-200';

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
      className={`group relative overflow-hidden bg-white rounded-2xl border p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between ${
        isCompleted
          ? 'border-slate-200 bg-slate-50/40 opacity-80'
          : isOverdue
          ? 'border-rose-300 bg-rose-50/20'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Left Priority Accent Stripe */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${
          isCompleted ? 'bg-slate-300' : priorityConfig.borderBar
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
              className="mt-0.5 text-slate-400 hover:text-[#059669] transition-transform active:scale-90 focus:outline-hidden cursor-pointer shrink-0 disabled:opacity-50"
            >
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-[#059669]" />
              ) : (
                <Circle className="w-5 h-5 hover:text-[#059669]" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <h4
                className={`text-sm font-semibold text-[#0F172A] leading-snug break-words transition-all ${
                  isCompleted ? 'line-through text-slate-400' : ''
                }`}
              >
                {task.title}
              </h4>

              {task.description && (
                <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {task.description}
                </p>
              )}
            </div>
          </div>

          {/* Priority Pill with Glowing Dot */}
          <span
            className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border shrink-0 ${priorityConfig.badge}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${priorityConfig.dot}`} />
            {task.priority}
          </span>
        </div>
      </div>

      {/* Bottom Bar: Status Badge, Date, Actions */}
      <div className="pl-1.5 mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
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
                  ? 'text-rose-600 font-semibold'
                  : 'text-slate-500'
              }`}
            >
              {isOverdue ? (
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              ) : (
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span>{formattedDueDate}</span>
              {isOverdue && (
                <span className="text-[10px] bg-rose-100 text-rose-700 px-1 rounded font-bold">
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
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Edit task"
            title="Edit Task"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(task)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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
