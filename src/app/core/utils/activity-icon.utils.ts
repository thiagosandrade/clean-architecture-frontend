import { TaskActivityType } from "../enums/activity-type.enum";

export function activityIcon(type: TaskActivityType): string {

  switch (type) {

    case TaskActivityType.TaskCreated:
      return 'add_circle';

    case TaskActivityType.TaskUpdated:
      return 'edit_note';

    case TaskActivityType.DescriptionUpdated:
      return 'edit';

    case TaskActivityType.PriorityChanged:
      return 'priority_high';

    case TaskActivityType.LabelsChanged:
      return 'label';

    case TaskActivityType.DueDateChanged:
      return 'event';

    case TaskActivityType.TaskCompleted:
      return 'task_alt';

    case TaskActivityType.TaskReopened:
      return 'restart_alt';

    case TaskActivityType.SubtasksUpdated:
      return 'checklist';

    case TaskActivityType.BreakdownGenerated:
      return 'account_tree';

    case TaskActivityType.DescriptionRewritten:
      return 'auto_awesome';

    case TaskActivityType.NoteAdded:
      return 'note_add';

    case TaskActivityType.AttachmentAdded:
      return 'attach_file';

    case TaskActivityType.EmbeddingsGenerated:
      return 'psychology';

    case TaskActivityType.CategoriesGenerated:
      return 'category';

    default:
      return 'history';
  }

}