import { TaskItem } from "../../features/todo/models/todo.model";

export function mapGeneratedSubtasks(descriptions: string[], taskId: string): TaskItem['subtasks'] {

  return descriptions.map((description, index) => ({

    id: '00000000-0000-0000-0000-000000000000',

    todoItemId: taskId,

    order: index + 1,

    description,

    isCompleted: false,

    completedAt: null,

    createdAt: null

  }));

}