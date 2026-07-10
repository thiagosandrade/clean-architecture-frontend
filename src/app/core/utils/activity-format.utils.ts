import { TaskActivityType } from '../enums/activity-type.enum';

export function formatActivity(type: TaskActivityType): string {

    switch(type){

        case TaskActivityType.DescriptionUpdated:
            return 'Description updated';

        case TaskActivityType.PriorityChanged:
            return 'Priority changed';

        case TaskActivityType.LabelsChanged:
            return 'Labels updated';

        case TaskActivityType.DueDateChanged:
            return 'Due date changed';

        case TaskActivityType.TaskCompleted:
            return 'Task completed';

        case TaskActivityType.TaskReopened:
            return 'Task reopened';

        case TaskActivityType.SubtasksUpdated:
            return 'Subtasks updated';

        case TaskActivityType.BreakdownGenerated:
            return 'AI generated subtasks';

        case TaskActivityType.DescriptionRewritten:
            return 'AI rewrote description';

        default:
            return 'Activity';
    }

}