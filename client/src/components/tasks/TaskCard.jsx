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
 * TaskCard Component.
 * Displays task details with priority badge, status indicator, due date, and action triggers.
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

  // Priority Styles
  const priorityBadge = {
    Low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200',
    High: 'bg-red-50 text-red-700 border-red-200',
  }[task.priority] || 'bg-gray-100 text-gray-700 border-gray-200';

  // Status Styles
  const statusBadge = {
    'Pending': 'bg-gray-100 text-gray-700 border-gray-200',
    'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
    'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  }[task.status] || 'bg-gray-100 text-gray-700 border-gray-200';

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
      className={`bg-white rounded-xl border p-4 sm:p-5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between ${
        isCompleted
          ? 'border-[#E5E7EB] bg-[#FCFDFD] opacity-90'
          : isOverdue
          ? 'border-red-200 bg-red-50/20'
          : 'border-[#E5E7EB]'
      }`}
    >
      <div>
        {/* Top: Status checkbox & Title & Priority */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Quick Completion Toggle */}
            <button
              type="button"
              disabled={isToggling}
              onClick={() => onStatusToggle && onStatusToggle(task)}
              aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
              className="mt-0.5 text-[#667085] hover:text-[#27845B] transition-colors focus:outline-hidden cursor-pointer shrink-0 disabled:opacity-50"
            >
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-[#27845B]" />
              ) : (
                <Circle className="w-5 h-5 hover:text-[#27845B]" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <h4
                className={`text-sm font-semibold text-[#202938] leading-snug break-words ${
                  isCompleted ? 'line-through text-[#667085]' : ''
                }`}
              >
                {task.title}
              </h4>

              {task.description && (
                <p className="mt-1 text-xs text-[#667085] line-clamp-2 leading-relaxed">
                  {task.description}
                </p>
              )}
            </div>
          </div>

          {/* Priority Pill */}
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${priorityBadge}`}
          >
            {task.priority}
          </span>
        </div>
      </div>

      {/* Bottom Bar: Badges, Date, Actions */}
      <div className="mt-4 pt-3 border-t border-[#E5E7EB] flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          {/* Status Badge */}
          <span
            className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${statusBadge}`}
          >
            {task.status}
          </span>

          {/* Due Date Indicator */}
          {formattedDueDate && (
            <div
              className={`flex items-center gap-1 text-[11px] font-medium ${
                isOverdue
                  ? 'text-red-600 font-semibold'
                  : 'text-[#667085]'
              }`}
            >
              {isOverdue ? (
                <AlertTriangle className="w-3.5 h-3.5" />
              ) : (
                <Calendar className="w-3.5 h-3.5" />
              )}
              <span>{formattedDueDate}</span>
              {isOverdue && <span className="text-[10px]">(Overdue)</span>}
            </div>
          )}
        </div>

        {/* Card Actions (Edit, Delete) */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-md text-[#667085] hover:text-[#202938] hover:bg-[#F1F3F5] transition-colors cursor-pointer"
            aria-label="Edit task"
            title="Edit Task"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(task)}
            className="p-1.5 rounded-md text-[#667085] hover:text-[#D64545] hover:bg-red-50 transition-colors cursor-pointer"
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
