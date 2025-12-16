// main.js
import readline from 'node:readline';
import { APIClient } from './api.js';
import { Task, PriorityTask, User } from './models.js';
import * as processor from './taskProcessor.js';

const api = new APIClient();

async function main() {
  try {
    // Fetch users and todos concurrently
    const [usersData, todosData] = await Promise.all([
      api.fetchUsers(),
      api.fetchTodos()
    ]);

    const users = usersData.map(user => new User(user));
    const tasks = todosData.map(todo => (todo.userId % 2 === 0
      ? new PriorityTask({ ...todo, priority: 'high' })
      : new Task(todo)
    ));

    tasks.forEach(task => {
      const user = users.find(u => u.id === task.userId);
      if (user) user.addTask(task);
    });

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    function showMenu() {
      console.log('\n--- Task Manager CLI ---');
      console.log('1. List all tasks');
      console.log('2. List tasks by status');
      console.log('3. Show user statistics');
      console.log('4. Search tasks by keyword');
      console.log('5. Exit');
      rl.question('Choose an option: ', handleMenu);
    }

    function handleMenu(option) {
      switch (option) {
        case '1':
          console.log('\nAll Tasks:');
          tasks.forEach(t => {
            console.log(`- [${t.getStatus()}] ${t.title} (User ${t.userId})`);
          });
          showMenu();
          break;
        case '2':
          rl.question('Enter status (Completed/Pending): ', status => {
            const filtered = processor.filterByStatus(tasks, status);
            console.log(`\nTasks with status "${status}":`);
            filtered.forEach(t => console.log(`- ${t.title} (User ${t.userId})`));
            showMenu();
          });
          break;
        case '3':
          console.log('\nUser Statistics:');
          users.forEach(u => {
            console.log(`- ${u.name} (${u.email}): ${u.tasks.length} tasks, Completion Rate: ${(u.getCompletionRate() * 100).toFixed(2)}%`);
          });
          showMenu();
          break;
        case '4':
          rl.question('Enter search keyword: ', keyword => {
            const results = processor.searchTasks(tasks, keyword);
            console.log(`\nTasks matching "${keyword}":`);
            results.forEach(t => console.log(`- ${t.title} (User ${t.userId})`));
            showMenu();
          });
          break;
        case '5':
          console.log('Exiting CLI...');
          rl.close();
          break;
        default:
          console.log('Invalid option, try again.');
          showMenu();
      }
    }

    showMenu();

  } catch (err) {
    console.error('Main error:', err.message);
  }
}

main();
