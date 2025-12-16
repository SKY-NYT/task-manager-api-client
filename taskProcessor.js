// taskProcessor.js

// Filter tasks by status
export const filterByStatus = (tasks, status) =>
  tasks.filter(t => t.getStatus() === status);

// Enhanced statistics generator
export const calculateStatistics = tasks =>
  tasks.reduce(
    (stats, task) => {
      stats.total++;
      if (task.completed) stats.completed++;
      else stats.pending++;

      // Count by priority if available
      if (task.priority) {
        stats.byPriority[task.priority] = (stats.byPriority[task.priority] || 0) + 1;
      }

      return stats;
    },
    {
      total: 0,
      completed: 0,
      pending: 0,
      byPriority: {} // e.g., { high: 10, medium: 5, low: 2 }
    }
  );

// Group tasks by user using Map
export const groupByUser = tasks => {
  const map = new Map();
  tasks.forEach(task => {
    if (!map.has(task.userId)) map.set(task.userId, []);
    map.get(task.userId).push(task);
  });
  return map;
};

// Extract unique tags/categories using Set + optional chaining
export const extractUniqueTags = tasks => {
  const tagSet = new Set();
  tasks.forEach(task => {
    task.tags?.forEach(tag => tagSet.add(tag)); // optional chaining
  });
  return tagSet;
};

// Search tasks by keyword in title
export const searchTasks = (tasks, keyword) => {
  const lower = keyword.toLowerCase();
  return tasks.filter(task => task.title.toLowerCase().includes(lower));
};
