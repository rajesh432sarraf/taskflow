import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, ListFilter } from 'lucide-react';
import taskService from '../services/taskService';
import TaskCard from '../components/tasks/TaskCard';
import TaskForm from '../components/tasks/TaskForm';
import SearchBar from '../components/tasks/SearchBar';
import FilterBar from '../components/tasks/FilterBar';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';

/**
 * TasksPage Component.
 * Complete task management interface with search, status/priority filtering, creation, and editing.
 */
export default function TasksPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter state synced with query params
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Confirmation
  const [deletingTask, setDeletingTask] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sync state if URL query param changes
  useEffect(() => {
    const urlStatus = searchParams.get('status');
    if (urlStatus && ['Pending', 'In Progress', 'Completed'].includes(urlStatus)) {
      setStatusFilter(urlStatus);
    }
  }, [searchParams]);

  // Fetch tasks
  const loadTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (statusFilter !== 'All') params.status = statusFilter;
      if (priorityFilter !== 'All') params.priority = priorityFilter;

      const res = await taskService.getTasks(params);
      if (res.success) {
        const taskList = Array.isArray(res.data)
          ? res.data
          : res.data?.tasks || [];
        setTasks(taskList);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, statusFilter, priorityFilter]);

  // Debounced/instant query effect
  useEffect(() => {
    const handler = setTimeout(() => {
      loadTasks();
    }, 250);

    return () => clearTimeout(handler);
  }, [loadTasks]);

  // Handle Create or Edit Submit
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
      await loadTasks();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Quick Status Toggle
  const handleStatusToggle = async (task) => {
    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      await taskService.updateTask(task._id, { status: newStatus });
      await loadTasks();
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
      await loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setPriorityFilter('All');
    setSearchParams({});
  };

  const hasActiveFilters = searchTerm !== '' || statusFilter !== 'All' || priorityFilter !== 'All';

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black tracking-tight text-white">
              My Tasks
            </h1>
            {!isLoading && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-emerald-200/70">
            Organize, prioritize, and track your daily execution pipeline.
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
          className="shadow-[0_0_20px_rgba(16,185,129,0.35)] bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-2.5 font-bold cursor-pointer"
        >
          Add Task
        </Button>
      </div>

      {error && (
        <ErrorMessage
          title="Tasks Error"
          message={error}
          onRetry={loadTasks}
        />
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white/[0.04] backdrop-blur-md rounded-2xl border border-emerald-500/20 p-4.5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          className="w-full md:max-w-md"
        />

        <FilterBar
          status={statusFilter}
          onStatusChange={(val) => {
            setStatusFilter(val);
            if (val === 'All') {
              searchParams.delete('status');
            } else {
              searchParams.set('status', val);
            }
            setSearchParams(searchParams);
          }}
          priority={priorityFilter}
          onPriorityChange={setPriorityFilter}
          onReset={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      {/* Task List / Grid Area */}
      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Loader size="lg" text="Loading tasks..." />
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={ListFilter}
          title={hasActiveFilters ? 'No matching tasks' : 'No tasks created yet'}
          description={
            hasActiveFilters
              ? 'No tasks match your active search and filter criteria. Try adjusting your filters.'
              : 'Keep your productivity on track by creating your first task.'
          }
          actionLabel={hasActiveFilters ? 'Reset Filters' : 'Create Task'}
          actionIcon={hasActiveFilters ? undefined : Plus}
          onAction={hasActiveFilters ? handleResetFilters : () => setIsTaskModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.map((task) => (
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
            ? 'Make changes to your existing task below.'
            : 'Fill in the information to add a task.'
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
