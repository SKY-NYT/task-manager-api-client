/* import { jest } from '@jest/globals';
import { APIClient } from '../../api.js';

describe('Task 5 & 6: API Logic and Error Handling', () => {
  let client;

  beforeEach(() => {
    client = new APIClient();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should handle network failure in fetchUsers (Error Handling)', async () => {

    global.fetch.mockResolvedValue({
      ok: false,
      status: 500
    });

    const data = await client.fetchUsers();
    expect(data).toEqual([]); 
  });

  test('should handle fetch throwing an exception (Boundary Condition)', async () => {
    global.fetch.mockRejectedValue(new Error('DNS Timeout'));
    const data = await client.fetchTodos();
    expect(data).toEqual([]);
  });

  test('fetchUsersAndTodosConcurrently should handle partial failure', async () => {

    global.fetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([{ id: 1 }]) });
    global.fetch.mockResolvedValueOnce({ ok: false });

    const result = await client.fetchUsersAndTodosConcurrently();
    expect(result.todos).toEqual([]); 
  });

  test('fetchUsersPromise should handle success (Promise-based version)', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([{ name: 'Kofi' }])
    });
    const data = await client.fetchUsersPromise();
    expect(data[0].name).toBe('Kofi');
  });

  test('fetchUsersPromise: should handle network error (Line 51-58 coverage)', async () => {
    global.fetch.mockResolvedValue({ ok: false });
    const data = await client.fetchUsersPromise();
    expect(data).toEqual([]); 
  });

  test('fetchUsersAndTodosConcurrently: should handle a total throw (Line 69-70 coverage)', async () => {

    global.fetch.mockImplementation(() => { throw new Error('Critical Failure'); });
    const result = await client.fetchUsersAndTodosConcurrently();
    expect(result.users).toEqual([]);
    expect(result.todos).toEqual([]);
  });
}); */