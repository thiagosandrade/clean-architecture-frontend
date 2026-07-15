export interface TaskDependency {
  todoItemId: string;
  dependsOnTodoItemId: string;
  description: string;
}
