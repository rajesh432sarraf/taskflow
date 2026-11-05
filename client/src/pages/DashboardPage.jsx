import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  CheckCircle2, 
  Clock, 
  Hourglass, 
  ListTodo, 
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import taskService from '../services/taskService';
import StatCard from '../components/common/StatCard';
import TaskCard from '../components/tasks/TaskCard';
import TaskForm from '../components/tasks/TaskForm';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';

/**
 * DashboardPage Component.
 * Displays user overview, stats cards, recent tasks, status/priority breakdown, and quick creation action.
 */
export default function DashboardPage() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal States
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Confirmation Modal
  const [deletingTask, setDeletingTask] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch Dashboard Data
  const loadDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [statsRes, tasksRes] = await Promise.all([
        taskService.getTaskStats(),
        taskService.getTasks(),
      ]);

      if (statsRes.success) {
        setStats(statsRes.data?.stats || statsRes.data || {
          totalTasks: 0,
          pendingTasks: 0,
          inProgressTasks: 0,
          completedTasks: 0,
          overdueTasks: 0,
        });
      }

      if (tasksRes.success) {
        const taskList = Array.isArray(tasksRes.data)
          ? tasksRes.data
          : tasksRes.data?.tasks || [];
        setRecentTasks(taskList.slice(0, 5));
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Handle Quick Add or Edit Submit
  const handleFormSubmit = async (taskData) => {
    setIsSubmitting(true);
    try {
      if (editingTask) {
        await taskService.updateTask(editingTask._id, taskData);
      } else {
        await taskService.createTask(taskData);
      }
      setIsTaskModalOpen(false);
      setEditingTask(null);
      await loadDashboardData();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Quick Status Toggle
  const handleStatusToggle = async (task) => {
    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      await taskService.updateTask(task._id, { status: newStatus });
      await loadDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task status');
    }
  };

  // Handle Delete Confirmation
  const confirmDelete = async () => {
    if (!deletingTask) return;
    setIsDeleting(true);
    try {
      await taskService.deleteTask(deletingTask._id);
      setDeletingTask(null);
      await loadDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader size="lg" text="Loading dashboard metrics..." />
      </div>
    );
  }

  const completionRate = stats.totalTasks > 0
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
    : 0;

  return (
    <div className="space-y-8">
      {/* Modern Precision Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white p-6 sm:p-7 shadow-xs border border-slate-200/80 bg-gradient-to-br from-white via-white to-emerald-50/30">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-xs font-semibold text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-[#059669]" />
              <span>Daily Productivity Momentum</span>
              <span className="text-emerald-300">•</span>
              <span className="text-emerald-700 font-bold">
                {stats.overdueTasks > 0 ? `${stats.overdueTasks} Overdue` : 'All Clear'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Welcome back, <span className="text-[#059669]">{user?.name || 'User'}</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
              You have <span className="font-semibold text-slate-900">{stats.pendingTasks} tasks</span> awaiting action and{' '}
              <span className="font-semibold text-slate-900">{stats.inProgressTasks} in progress</span>. Keep the momentum going!
            </p>

            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  setEditingTask(null);
                  setIsTaskModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold transition-all shadow-xs hover:shadow-sm hover:shadow-emerald-600/25 active:scale-98 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Task</span>
              </button>
            </div>
          </div>

          {/* Right: Circular Radial Progress Dial */}
          <div className="flex items-center gap-4 bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/60 shrink-0 self-start md:self-auto">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#E2E8F0"
                  strokeWidth="8"
                  fill="none"
                />
                {/* Animated Progress Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#059669"
                  strokeWidth="8"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (251.2 * completionRate) / 100}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-lg font-extrabold text-slate-900 tracking-tight leading-none">
                  {completionRate}%
                </span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-0.5">
                  Done
                </span>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="text-slate-500 font-medium">Completion Goal</div>
              <div className="text-slate-900 text-sm font-bold">
                {stats.completedTasks} of {stats.totalTasks} Done
              </div>
              <div className="text-[11px] text-slate-400">
                {stats.totalTasks === 0
                  ? 'Start by adding a task'
                  : completionRate === 100
                  ? '🎉 All tasks finished!'
                  : `${stats.pendingTasks + stats.inProgressTasks} tasks remaining`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <ErrorMessage
          title="Dashboard Error"
          message={error}
          onRetry={loadDashboardData}
        />
      )}

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tasks"
          value={stats.totalTasks}
          icon={ListTodo}
          subtext={`${completionRate}% completion rate`}
          variant="default"
        />

        <StatCard
          title="Pending Tasks"
          value={stats.pendingTasks}
          icon={Clock}
          subtext="Awaiting action"
          variant="warning"
        />

        <StatCard
          title="In Progress"
          value={stats.inProgressTasks}
          icon={Hourglass}
          subtext="Currently active"
          variant="info"
        />

        <StatCard
          title="Completed"
          value={stats.completedTasks}
          icon={CheckCircle2}
          subtext="Successfully finished"
          variant="success"
        />
      </div>

      {/* Overview & Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Recent Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">
                Recent Tasks
              </h2>
              <p className="text-xs text-[#64748B]">
                Your most recently updated workflow items
              </p>
            </div>
            <Link
              to="/tasks"
              className="text-xs font-bold text-[#059669] hover:text-[#047857] inline-flex items-center gap-1 transition-colors px-2.5 py-1 rounded-lg hover:bg-emerald-50"
            >
              View all tasks
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentTasks.length === 0 ? (
            <EmptyState
              title="No tasks in your workspace"
              description="Get started by creating your very first task to track your progress and boost your daily output."
              actionLabel="Create Task"
              actionIcon={Plus}
              onAction={() => {
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
            />
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {recentTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onStatusToggle={handleStatusToggle}
                  onEdit={(t) => {
                    setEditingTask(t);
                    setIsTaskModalOpen(true);
                  }}
                  onDelete={(t) => setDeletingTask(t)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Status & Priority Breakdown */}
        <div className="space-y-6">
          {/* Progress Overview Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Productivity Progress
              </h3>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-[#059669]">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1.5 font-semibold">
                  <span className="text-slate-500">Velocity Rate</span>
                  <span className="text-slate-900">{completionRate}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-[#059669] h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>

              {stats.overdueTasks > 0 && (
                <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200/80 flex items-center gap-2.5 text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 animate-pulse" />
                  <span>
                    Attention: <strong>{stats.overdueTasks}</strong> {stats.overdueTasks === 1 ? 'task is' : 'tasks are'} past due!
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats Distribution */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs">
            <h3 className="text-sm font-bold text-[#0F172A] mb-3">
              Status Breakdown
            </h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <div className="flex items-center gap-2.5 font-medium text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_6px_#F59E0B]" />
                  <span>Pending</span>
                </div>
                <span className="font-bold text-[#0F172A] bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                  {stats.pendingTasks}
                </span>
              </li>
              <li className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <div className="flex items-center gap-2.5 font-medium text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shadow-[0_0_6px_#0EA5E9]" />
                  <span>In Progress</span>
                </div>
                <span className="font-bold text-[#0F172A] bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                  {stats.inProgressTasks}
                </span>
              </li>
              <li className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <div className="flex items-center gap-2.5 font-medium text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-[0_0_6px_#10B981]" />
                  <span>Completed</span>
                </div>
                <span className="font-bold text-[#0F172A] bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                  {stats.completedTasks}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Task Form Modal (Add / Edit) */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
        description={
          editingTask
            ? 'Update the fields below to modify your task.'
            : 'Fill in the details to add a task to your workspace.'
        }
      >
        <TaskForm
          initialData={editingTask}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsTaskModalOpen(false);
            setEditingTask(null);
          }}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        title="Delete Task"
        description="Are you sure you want to permanently delete this task? This action cannot be undone."
        maxWidth="max-w-md"
      >
        <div className="mt-4 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setDeletingTask(null)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={confirmDelete}
            isLoading={isDeleting}
          >
            Delete Task
          </Button>
        </div>
      </Modal>
    </div>
  );
}
