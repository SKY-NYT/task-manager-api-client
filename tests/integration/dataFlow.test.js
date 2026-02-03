import { jest } from '@jest/globals';
import { APIClient } from '../../api';
import { Task, User } from '../../models';
import { calculateStatistics, groupByUser } from '../../taskProcessor';




describe('Data Flow Integration Tests', () => {
  let apiClient;

  beforeEach(() => {
    global.fetch = jest.fn();
    apiClient = new APIClient();
    jest.clearAllMocks();
  });

 afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should fetch todos from API and generate accurate statistics', async () => {

    const mockRawTodos = [
      { id: 1, title: 'Learn Jest', completed: true, userId: 1 },
      { id: 2, title: 'Write Tests', completed: false, userId: 1 },
      { id: 3, title: 'Review Lab', completed: false, userId: 2 }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRawTodos,
    });

    
    const rawData = await apiClient.fetchTodos();
    const taskInstances = rawData.map(data => new Task(data));
    const stats = calculateStatistics(taskInstances);

    
    expect(stats.total).toBe(3);
    expect(stats.completed).toBe(1);
    expect(stats.pending).toBe(2);
    expect(taskInstances[0]).toBeInstanceOf(Task);
  });


  test('should fetch todos and correctly group them into a Map by User ID', async () => {
   
    const mockRawTodos = [
      { id: 1, title: 'Task A', userId: 10, completed: true },
      { id: 2, title: 'Task B', userId: 10, completed: false },
      { id: 3, title: 'Task C', userId: 20, completed: true }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRawTodos,
    });

    // 2. Act
    const rawData = await apiClient.fetchTodos();
    const groupedMap = groupByUser(rawData);

    // 3. Assert
    expect(groupedMap).toBeInstanceOf(Map);
    expect(groupedMap.get(10)).toHaveLength(2);
    expect(groupedMap.get(20)).toHaveLength(1);
    expect(groupedMap.get(10)[0].title).toBe('Task A');
  });

 
  test('should fetch user-specific todos and update User model completion rate', async () => {
    
    const johnData = { id: 5, name: 'John Doe', email: 'john@example.com' };
    const johnTodos = [
      { id: 101, title: 'Draft Report', completed: true, userId: 5 },
      { id: 102, title: 'Send Email', completed: false, userId: 5 }
    ];

    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => johnTodos,
    });

    const user = new User(johnData);

    const rawTasks = await apiClient.fetchUserTodos(5);
    const taskInstances = rawTasks.map(t => new Task(t));
    user.addTask(...taskInstances); 

   
    expect(user.tasks).toHaveLength(2);
    expect(user.getCompletionRate()).toBe(0.5); 
    expect(user.getTasksByStatus('Completed')).toHaveLength(1);
  });
});