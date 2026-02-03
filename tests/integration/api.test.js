import { jest } from '@jest/globals';
import { APIClient } from '../../api.js'; 
import { Task, User } from '../../models.js';

describe('API Client Comprehensive Testing', () => {
  let client;

  beforeEach(() => {
    global.fetch = jest.fn();
    client = new APIClient();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });


  describe('Core Logic', () => {
    test('should handle network failure in async fetcher', async () => {
      global.fetch.mockResolvedValue({ ok: false, status: 500 });
      const data = await client.fetchUsers();
      expect(data).toEqual([]); 
    });

    test('fetchUsersAndTodosConcurrently should handle total failure', async () => {
      global.fetch.mockImplementation(() => { 
        throw new Error('Critical Failure'); 
      });
      const result = await client.fetchUsersAndTodosConcurrently();
      expect(result.users).toEqual([]);
      expect(result.todos).toEqual([]);
    });


    test('fetchUsersPromise should handle success and network error', async () => {
     
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [{ name: 'Kofi' }]
      });
      const successData = await client.fetchUsersPromise();
      expect(successData[0].name).toBe('Kofi');

      
      global.fetch.mockResolvedValueOnce({ ok: false });
      const errorData = await client.fetchUsersPromise();
      expect(errorData).toEqual([]);
    });
  });

  describe('Data Integration', () => {
    test('should correctly hydrate a User with fetched Tasks', async () => {
      const mockUser = { id: 7, name: 'Kofi' };
      const mockTasks = [{ id: 10, title: 'Lab Review', completed: true, userId: 7 }];

      global.fetch
        .mockResolvedValueOnce({ ok: true, json: async () => [mockUser] })
        .mockResolvedValueOnce({ ok: true, json: async () => mockTasks });

      const users = await client.fetchUsers();
      const userTasks = await client.fetchUserTodos(users[0].id);
      
      const user = new User(users[0]);
      userTasks.forEach(t => user.addTask(new Task(t)));

      expect(user.tasks).toHaveLength(1);
      expect(user.getCompletionRate()).toBe(1);
    });
  });
});