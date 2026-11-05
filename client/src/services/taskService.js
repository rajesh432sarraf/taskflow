import api from './api';

/**
 * Task Management API Service.
 * Communicates with backend /api/tasks endpoints.
 */
export const taskService = {
  /**
   * Fetch all tasks for authenticated user.
   * Supports search, status, and priority query filters.
   * @param {Object} [params] - { search, status, priority }
   * @returns {Promise<Object>} API response with task list
   */
  async getTasks(params = {}) {
    const query = new URLSearchParams();
    if (params.search && params.search.trim()) query.append('search', params.search.trim());
    if (params.status && params.status !== 'All') query.append('status', params.status);
    if (params.priority && params.priority !== 'All') query.append('priority', params.priority);

    const queryString = query.toString();
    const endpoint = queryString ? `/tasks?${queryString}` : '/tasks';
    const response = await api.get(endpoint);
    return response.data;
  },

  /**
   * Fetch single task by ID.
   * @param {string} id - Task ObjectId
   * @returns {Promise<Object>}
   */
  async getTaskById(id) {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  /**
   * Create a new task.
   * @param {Object} taskData - { title, description, priority, status, dueDate }
   * @returns {Promise<Object>}
   */
  async createTask(taskData) {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  /**
   * Update an existing task.
   * @param {string} id - Task ObjectId
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>}
   */
  async updateTask(id, updates) {
    const response = await api.put(`/tasks/${id}`, updates);
    return response.data;
  },

  /**
   * Delete a task.
   * @param {string} id - Task ObjectId
   * @returns {Promise<Object>}
   */
  async deleteTask(id) {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  /**
   * Retrieve aggregated dashboard task metrics.
   * @returns {Promise<Object>} { totalTasks, pendingTasks, inProgressTasks, completedTasks, overdueTasks }
   */
  async getTaskStats() {
    const response = await api.get('/tasks/stats');
    return response.data;
  },
};

export default taskService;

