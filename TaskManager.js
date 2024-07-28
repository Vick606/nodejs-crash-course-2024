import { EventEmitter } from 'events';

class TaskManager extends EventEmitter {
  constructor() {
    super();
    this.tasks = [];
  }

  addTask(task) {
    this.tasks.push({ ...task, status: 'pending' });
    this.emit('taskAdded', task);
  }

  completeTask(taskId) {
    const taskIndex = this.tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      this.tasks[taskIndex].status = 'completed';
      this.emit('taskCompleted', this.tasks[taskIndex]);
    } else {
      this.emit('error', new Error(`Task with id ${taskId} not found`));
    }
  }

  deleteTask(taskId) {
    const taskIndex = this.tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      const deletedTask = this.tasks.splice(taskIndex, 1)[0];
      this.emit('taskDeleted', deletedTask);
    } else {
      this.emit('error', new Error(`Task with id ${taskId} not found`));
    }
  }

  listTasks() {
    this.emit('taskListed', this.tasks);
  }
}

// Create a task manager instance
const taskManager = new TaskManager();

// Event listeners
taskManager.on('taskAdded', (task) => {
  console.log(`New task added: ${task.name}`);
});

taskManager.on('taskCompleted', (task) => {
  console.log(`Task completed: ${task.name}`);
});

taskManager.on('taskDeleted', (task) => {
  console.log(`Task deleted: ${task.name}`);
});

taskManager.on('taskListed', (tasks) => {
  console.log('Current tasks:');
  tasks.forEach(task => {
    console.log(`- ${task.name} (${task.status})`);
  });
});

taskManager.on('error', (error) => {
  console.error('An error occurred:', error.message);
});

// Multiple listeners for the same event
taskManager.on('taskAdded', () => {
  console.log('Task count updated');
});

// Using once for one-time event listener
taskManager.once('taskAdded', () => {
  console.log('First task added! (This message will appear only once)');
});

// Simulate task management operations
taskManager.addTask({ id: 1, name: 'Complete project proposal' });
taskManager.addTask({ id: 2, name: 'Review code changes' });
taskManager.completeTask(1);
taskManager.deleteTask(2);
taskManager.completeTask(3); // This will trigger an error event
taskManager.listTasks();

// Demonstrate removeListener
const taskAddedListener = () => console.log('A task was added');
taskManager.on('taskAdded', taskAddedListener);
taskManager.addTask({ id: 3, name: 'Prepare presentation' });
taskManager.removeListener('taskAdded', taskAddedListener);
taskManager.addTask({ id: 4, name: 'Schedule team meeting' });

// Demonstrate removeAllListeners
taskManager.removeAllListeners('taskDeleted');
taskManager.deleteTask(3); // This won't log anything now