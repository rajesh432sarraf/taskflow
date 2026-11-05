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
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#202938]">
            Dashboard
          </h1>
          <p className="mt-1 text-xs text-[#667085]">
            Welcome back, <span className="font-semibold text-[#202938]">{user?.name}</span>. Here is your productivity summary for today.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => {
            setEditingTask(null);
            setIsTaskModalOpen(true);
          }}
        >
          Add Task
        </Button>
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
          subtext="Currently being worked on"
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
            <h2 className="text-base font-semibold text-[#202938]">
              Recent Tasks
            </h2>
            <Link
              to="/tasks"
              className="text-xs font-semibold text-[#27845B] hover:text-[#206C4A] inline-flex items-center gap-1 transition-colors"
            >
              View all tasks
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentTasks.length === 0 ? (
            <EmptyState
              title="No tasks yet"
              description="Get started by creating your very first task to track your progress."
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
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#202938]">
                Productivity Progress
              </h3>
              <TrendingUp className="w-4 h-4 text-[#27845B]" />
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-[#667085]">Completion Rate</span>
                  <span className="text-[#202938] font-bold">{completionRate}%</span>
                </div>
                <div className="w-full bg-[#F1F3F5] rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#27845B] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>

              {stats.overdueTasks > 0 && (
                <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-[#D64545]">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>
                    You have <strong>{stats.overdueTasks}</strong> overdue {stats.overdueTasks === 1 ? 'task' : 'tasks'}!
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats Distribution */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-xs">
            <h3 className="text-sm font-semibold text-[#202938] mb-3">
              Status Breakdown
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#667085]">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span>Pending</span>
                </div>
                <span className="font-semibold text-[#202938]">{stats.pendingTasks}</span>
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#667085]">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span>In Progress</span>
                </div>
                <span className="font-semibold text-[#202938]">{stats.inProgressTasks}</span>
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#667085]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27845B]" />
                  <span>Completed</span>
                </div>
                <span className="font-semibold text-[#202938]">{stats.completedTasks}</span>
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
