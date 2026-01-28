import { jest } from '@jest/globals';
import { APIClient } from '../../api.js'; 
import { User, Task } from '../../models.js';

describe('Task 4: Testing with Spies', () => {
  

  test('1. should spy on console.log when using cached data', async () => {
    const client = new APIClient();
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
    await client.fetchUsers();
    await client.fetchUsers(); 
    
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Using cached data'));
    logSpy.mockRestore(); 
  });

  test('2. should spy on console.error when fetch fails', async () => {
    const client = new APIClient();
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
   
    const fetchSpy = jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Network Failure'));
    
    await client.fetchUsers();
    
    expect(errorSpy).toHaveBeenCalled();
    
    errorSpy.mockRestore();
    fetchSpy.mockRestore();
  });

  test('3. should spy on addTask to verify it is called in User', () => {
    const user = new User({ id: 1 });
    const spy = jest.spyOn(user, 'addTask');
    
    user.addTask(new Task({ id: 1 }));
    
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(expect.any(Object));
    spy.mockRestore();
  });

  test('4. should spy on getStatus during filterByStatus utility', () => {
    const task = new Task({ title: 'Spy Task', completed: true });
    const spy = jest.spyOn(task, 'getStatus');
    
    task.getStatus(); 
    
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test('5. should verify that getCompletionRate calls the task list', () => {
    const user = new User({ id: 1 });
    user.addTask(new Task({ completed: true }));
    const spy = jest.spyOn(user.tasks, 'filter'); 
    
    user.getCompletionRate();
    
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test('6. should spy on the toggle method of a Task', () => {
    const task = new Task({ completed: false });
    const spy = jest.spyOn(task, 'toggle');
    
    task.toggle();
    
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });
});