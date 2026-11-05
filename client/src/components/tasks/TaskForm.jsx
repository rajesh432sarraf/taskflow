import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Textarea from '../common/Textarea';
import Select from '../common/Select';
import Button from '../common/Button';
import ErrorMessage from '../common/ErrorMessage';

/**
 * TaskForm Component.
 * Used inside modal for Creating or Updating tasks.
 */
export default function TaskForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Pending',
    dueDate: '',
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        priority: initialData.priority || 'Medium',
        status: initialData.status || 'Pending',
        dueDate: initialData.dueDate
          ? new Date(initialData.dueDate).toISOString().split('T')[0]
          : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'Medium',
        status: 'Pending',
        dueDate: '',
      });
    }
    setErrors({});
    setSubmitError(null);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (formData.title.trim().length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters';
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Description cannot exceed 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        status: formData.status,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
      };
      await onSubmit(payload);
    } catch (err) {
      setSubmitError(err.response?.data?.message || err.message || 'Failed to save task');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {submitError && (
        <ErrorMessage message={submitError} />
      )}

      {/* Title */}
      <Input
        label="Task Title"
        name="title"
        placeholder="e.g. Design homepage wireframe"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        required
        maxLength={100}
      />

      {/* Description */}
      <Textarea
        label="Description (Optional)"
        name="description"
        placeholder="Add details, notes, or subtasks..."
        value={formData.description}
        onChange={handleChange}
        error={errors.description}
        maxLength={1000}
        rows={3}
      />

      {/* Row: Priority & Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          options={[
            { value: 'Low', label: 'Low Priority' },
            { value: 'Medium', label: 'Medium Priority' },
            { value: 'High', label: 'High Priority' },
          ]}
        />

        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={[
            { value: 'Pending', label: 'Pending' },
            { value: 'In Progress', label: 'In Progress' },
            { value: 'Completed', label: 'Completed' },
          ]}
        />
      </div>

      {/* Due Date */}
      <Input
        label="Due Date (Optional)"
        name="dueDate"
        type="date"
        value={formData.dueDate}
        onChange={handleChange}
        helperText="Leave empty if there is no deadline"
      />

      {/* Action Buttons */}
      <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
        >
          {initialData ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}

