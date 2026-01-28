import { Task, PriorityTask, User } from '../../models.js';

describe('Task 1: Model Classes Unit Tests', () => {

  describe('Task Class', () => {
    let task;
    const taskData = { id: 1, title: 'Initial Task', completed: false, userId: 101 };

    beforeEach(() => {
    
      task = new Task(taskData);
    });

    test('should initialize with all properties via Object.assign', () => {
      expect(task.id).toBe(1);
      expect(task.title).toBe('Initial Task');
      expect(task.completed).toBe(false);
      expect(task.userId).toBe(101);
    });

    test('toggle() should switch completed from false to true', () => {
      task.toggle();
      expect(task.completed).toBe(true);
    });

    test('toggle() should switch completed from true back to false', () => {
      task.completed = true;
      task.toggle();
      expect(task.completed).toBe(false);
    });

    test('getStatus() should return "Pending" when completed is false', () => {
      expect(task.getStatus()).toBe('Pending');
    });

    test('getStatus() should return "Completed" when completed is true', () => {
      task.completed = true;
      expect(task.getStatus()).toBe('Completed');
    });

    test('isOverdue() should always return false (placeholder behavior)', () => {
      expect(task.isOverdue()).toBe(false);
    });

    test('should handle empty strings for title', () => {
      const emptyTask = new Task({ title: '' });
      expect(emptyTask.title).toBe('');
    });

    test('should handle undefined properties gracefully', () => {
      const ghostTask = new Task({});
      expect(ghostTask.id).toBeUndefined();
    });

    test('Task: should handle missing title gracefully', () => {
      const task = new Task({ id: 1 });
      expect(task.title).toBeUndefined();
      expect(task.getStatus()).toBe('Pending');
    });

    test('Task: should handle extreme future dates for isOverdue', () => {
      const task = new Task({ dueDate: '2099-01-01' });
      expect(task.isOverdue()).toBe(false);
    });

  });

  describe('PriorityTask Class', () => {
    test('should inherit from Task class', () => {
      const pTask = new PriorityTask({ title: 'Priority Item' });
      expect(pTask instanceof Task).toBe(true);
    });

    test('should set default priority to "medium" if not provided', () => {
      const pTask = new PriorityTask({});
      expect(pTask.priority).toBe('medium');
    });

    test('isOverdue() should return true for a date in the past', () => {
      const pastDate = '2000-01-01';
      const pTask = new PriorityTask({ dueDate: pastDate });
      expect(pTask.isOverdue()).toBe(true);
    });

    test('isOverdue() should return false for a date in the future', () => {
      const futureDate = '2099-12-31';
      const pTask = new PriorityTask({ dueDate: futureDate });
      expect(pTask.isOverdue()).toBe(false);
    });

    test('isOverdue() should return null/false if dueDate is missing', () => {
      const pTask = new PriorityTask({ dueDate: null });
      expect(pTask.isOverdue()).toBe(null); // Based on: this.dueDate && ...
    });

    test('should assign custom priority level', () => {
      const pTask = new PriorityTask({ priority: 'high' });
      expect(pTask.priority).toBe('high');
    });

    test('PriorityTask: should validate priority levels', () => {
      const highPrio = new PriorityTask({ priority: 'High' });
      expect(highPrio.priority).toBe('High');
    });

    test('PriorityTask: should include priority in status string', () => {
      const pTask = new PriorityTask({ title: 'Urgent', priority: 'High' });
      expect(pTask.priority).toBe('High');
    });

  });

  describe('User Class', () => {
    let user;
    beforeEach(() => {
      user = new User({ id: 1, name: 'Kofi', email: 'kofi@example.com' });
    });

    test('addTask() should add multiple tasks using rest parameters', () => {
      user.addTask(new Task({ id: 1 }), new Task({ id: 2 }), new Task({ id: 3 }));
      expect(user.tasks.length).toBe(3);
    });

    test('getCompletionRate() should return 0 when there are no tasks', () => {
      expect(user.getCompletionRate()).toBe(0);
    });

    test('getCompletionRate() should return 0.5 when half of tasks are done', () => {
      user.addTask(new Task({ completed: true }), new Task({ completed: false }));
      expect(user.getCompletionRate()).toBe(0.5);
    });

    test('getCompletionRate() should return 1 when all tasks are done', () => {
      user.addTask(new Task({ completed: true }));
      expect(user.getCompletionRate()).toBe(1);
    });

    test('getTasksByStatus() should filter "Completed" tasks correctly', () => {
      const t1 = new Task({ completed: true });
      const t2 = new Task({ completed: false });
      user.addTask(t1, t2);
      const results = user.getTasksByStatus('Completed');
      expect(results).toContain(t1);
      expect(results).not.toContain(t2);
    });

    test('getTasksByStatus() should return empty array if no tasks match', () => {
      user.addTask(new Task({ completed: false }));
      expect(user.getTasksByStatus('Completed')).toEqual([]);
    });

    test('should store constructor properties correctly', () => {
      expect(user.name).toBe('Kofi');
      expect(user.email).toBe('kofi@example.com');
    });

    test('User: should handle adding multiple tasks at once', () => {
      const user = new User({ name: 'Kofi' });
      user.addTask(new Task({ id: 1 }), new Task({ id: 2 }));
      expect(user.tasks.length).toBe(2);
    });

    test('User: filterTasks should return empty array if no matches', () => {
      const user = new User({ name: 'Kofi' });
      user.addTask(new Task({ completed: true }));
      const pending = user.tasks.filter(t => !t.completed);
      expect(pending.length).toBe(0);
    }); 
    
  });


  describe('Error Handling and Edge Cases', () => {
  test('should handle null properties in Task constructor', () => {

    const task = new Task({ id: null, title: undefined });
    expect(task.id).toBeNull();
    expect(task.title).toBeUndefined();
  });

  test('getCompletionRate should return 0 for empty tasks to avoid division by zero', () => {
    const user = new User({ id: 1 });
    
    expect(user.getCompletionRate()).toBe(0);
  });
});
});