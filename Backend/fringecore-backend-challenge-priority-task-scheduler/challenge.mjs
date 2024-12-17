const TASK_REQUIRE_TIME_MS = 5_000;
// Modify the function below to process each task for 5 secs
/**
 * Processes an task and executes a callback to mark the task as done.
 *
 * @param {Object} task - The task object containing details about the task.
 * @param {string} task.id - Unique identifier for the task.
 * @param {number} task.priority - Priority level of the task (higher is more urgent).
 * @param {string} task.description - A description of the task. Can be empty string.
 * @param {function(string | undefined):void} task.setTaskDone - Callback function to mark the task as complete.
 * It receives an optional message string.
 */

let currentTask = null;
let queue = [];

export const processTask = (task) => {
  if (currentTask) {
    if (task.priority > currentTask.priority) {
      currentTask.setTaskDone(`Task ${currentTask.id} not done. There is a higher priority`);
      startProcessingTask(task);
      return; 
    } else {
      queue.push(task);
      return; 
    }
  }
  startProcessingTask(task);
}

function startProcessingTask(task) {
  currentTask = task; 

  setTimeout(() => {
    task.setTaskDone("Task done successfully.");
    currentTask = null;
    processQueue();
  }, TASK_REQUIRE_TIME_MS);
}

function processQueue() {
  if (queue.length > 0) {
    queue.sort((a, b) => b.priority - a.priority); 
    const nextTask = queue.shift(); 
    processTask(nextTask); 
  }
}
