import { jest } from '@jest/globals';

export class APIClient {
  constructor() {
    this.fetchUsers = jest.fn(() => Promise.resolve([
      { id: 1, name: 'Mock User 1' },
      { id: 2, name: 'Mock User 2' }
    ]));
    
    this.fetchTodos = jest.fn(() => Promise.resolve([
      { id: 1, userId: 1, title: 'Mock Todo 1', completed: false },
      { id: 2, userId: 1, title: 'Mock Todo 2', completed: true }
    ]));
  }

  
  async fetchUsersAndTodosConcurrently() {
    const [users, todos] = await Promise.all([this.fetchUsers(), this.fetchTodos()]);
    return { users, todos };
  }

  async fetchUserTodos(userId) {
    const todos = await this.fetchTodos();
    return todos.filter(todo => todo.userId === userId);
  }
}