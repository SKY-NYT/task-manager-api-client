// taskProcessor.js


export const filterByStatus = (tasks, status) =>
  tasks.filter(t => t.getStatus() === status);


export const calculateStatistics = tasks =>
  tasks.reduce(
    (stats, task) => {
      stats.total++;
      if (task.completed) stats.completed++;
      else stats.pending++;

     
      if (task.priority) {
        stats.byPriority[task.priority] = (stats.byPriority[task.priority] || 0) + 1;
      }

      return stats;
    },
    {
      total: 0,
      completed: 0,
      pending: 0,
      byPriority: {} 
    }
  );


export const groupByUser = tasks => {
  const map = new Map();
  tasks.forEach(task => {
    if (!map.has(task.userId)) map.set(task.userId, []);
    map.get(task.userId).push(task);
  });
  return map;
};


export const extractUniqueTags = tasks => {
  const tagSet = new Set();
  tasks.forEach(task => {
    task.tags?.forEach(tag => tagSet.add(tag)); 
  });
  return tagSet;
};


export const searchTasks = (tasks, keyword) => {
  const lower = keyword.toLowerCase();
  return tasks.filter(task => task.title.toLowerCase().includes(lower));
};
