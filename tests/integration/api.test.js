import { jest } from '@jest/globals';
import { APIClient } from '../__mocks__/api.js'; 
import { Task, User } from '../../models.js';



describe('Task 3: APIClient Integration Tests', () => {
  let client;

  beforeEach(() => {
    client = new APIClient();
    jest.clearAllMocks();
  });

  test('fetchTodos should return data that can be converted to Task instances', async () => {
    const data = await client.fetchTodos();
    const tasks = data.map(t => new Task(t));
    
    expect(tasks[0]).toBeInstanceOf(Task);
    expect(tasks[0].title).toContain('Mock Todo');
  });

  test('fetchUserTodos should filter correctly for a specific ID', async () => {
    const userTodos = await client.fetchUserTodos(1);
    expect(userTodos.every(t => t.userId === 1)).toBe(true);
  });

  test('fetchUsersAndTodosConcurrently should return both datasets', async () => {
    const result = await client.fetchUsersAndTodosConcurrently();
    expect(result.users).toBeDefined();
    expect(result.todos).toBeDefined();
    expect(client.fetchUsers).toHaveBeenCalled();
    expect(client.fetchTodos).toHaveBeenCalled();
  });
  test('Integration: should hydrate a User with Tasks from the API', async () => {
    
    const userData = (await client.fetchUsers())[0]; 
    const todoData = await client.fetchUserTodos(userData.id);
    const user = new User(userData);
    const tasks = todoData.map(t => new Task(t));
    user.addTask(...tasks);
    expect(user).toBeInstanceOf(User);
    expect(user.tasks[0]).toBeInstanceOf(Task);

    expect(typeof user.getCompletionRate()).toBe('number');
  });
});