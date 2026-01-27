// api.js
export class APIClient {
  constructor() {
    this._fetchUsers = this._createCachedFetcher(
      'https://jsonplaceholder.typicode.com/users'
    );

    this._fetchTodos = this._createCachedFetcher(
      'https://jsonplaceholder.typicode.com/todos'
    );
  }

  
  _createCachedFetcher(url) {
    let cache = null; 
    return async () => {
      if (cache) {
        console.log(`Using cached data for ${url}`);
        return cache;
      }
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Fetch failed for ${url}`);
        cache = await res.json(); 
        return cache;
      } catch (err) {
        console.error(err.message);
        return [];
      }
    };
  }


  fetchUsers() {
    return this._fetchUsers();
  }

  fetchTodos() {
    return this._fetchTodos();
  }

  fetchUsersPromise() {
    return fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch users (Promise)');
        return res.json();
      })
      .catch(err => {
        console.error('Promise error:', err.message);
        return [];
      });
  }

  async fetchUserTodos(userId) {
    const todos = await this.fetchTodos();
    return todos.filter(todo => todo.userId === userId);
  }

  async fetchUsersAndTodosConcurrently() {
    try {
    
      const [users, todos] = await Promise.all([this.fetchUsers(), this.fetchTodos()]);
      console.log('Fetched users and todos concurrently');
      return { users, todos };
    } catch (err) {
      console.error('Error fetching users and todos concurrently:', err.message);
      return { users: [], todos: [] };
    }
  }
}
