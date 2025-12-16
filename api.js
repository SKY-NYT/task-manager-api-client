// api.js
export class APIClient {
  constructor() {
    // private cached fetchers using closures
    this._fetchUsers = this._createCachedFetcher(
      'https://jsonplaceholder.typicode.com/users'
    );

    this._fetchTodos = this._createCachedFetcher(
      'https://jsonplaceholder.typicode.com/todos'
    );
  }

  // higher-order function that returns a cached async fetcher
  _createCachedFetcher(url) {
    let cache = null; // closure remembers this
    return async () => {
      if (cache) {
        console.log(`Using cached data for ${url}`);
        return cache;
      }
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Fetch failed for ${url}`);
        cache = await res.json(); // store in closure
        return cache;
      } catch (err) {
        console.error(err.message);
        return [];
      }
    };
  }

  // Cached async/await versions
  fetchUsers() {
    return this._fetchUsers();
  }

  fetchTodos() {
    return this._fetchTodos();
  }

  // Promise-based version (optional)
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

  //  New: Fetch users and todos concurrently using Promise.all
  async fetchUsersAndTodosConcurrently() {
    try {
      // Run both fetches at the same time
      const [users, todos] = await Promise.all([this.fetchUsers(), this.fetchTodos()]);
      console.log('Fetched users and todos concurrently');
      return { users, todos };
    } catch (err) {
      console.error('Error fetching users and todos concurrently:', err.message);
      return { users: [], todos: [] };
    }
  }
}
