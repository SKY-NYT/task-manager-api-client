// models.js
export class Task {
  constructor({ id, title, completed, userId }) {
    Object.assign(this, { id, title, completed, userId });
  }

  toggle() { this.completed = !this.completed; }
  isOverdue() { return false; } // placeholder
  getStatus() { return this.completed ? 'Completed' : 'Pending'; }
}

export class PriorityTask extends Task {
  constructor(props) {
    super(props);
    this.priority = props.priority || 'medium';
    this.dueDate = props.dueDate || null;
  }

  isOverdue() { return this.dueDate && new Date() > new Date(this.dueDate); }
}

export class User {
  constructor({ id, name, email }) {
    Object.assign(this, { id, name, email });
    this.tasks = [];
  }

  // Updated to accept multiple tasks using rest parameters
  addTask(...tasks) {
    this.tasks.push(...tasks);
  }

  getCompletionRate() {
    if (!this.tasks.length) return 0;
    return this.tasks.filter(t => t.completed).length / this.tasks.length;
  }

  getTasksByStatus(status) {
    return this.tasks.filter(t => t.getStatus() === status);
  }
}
