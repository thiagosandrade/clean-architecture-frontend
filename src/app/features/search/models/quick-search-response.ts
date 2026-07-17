import { AttachmentSearchItem } from "./attachment-search-item";
import { SubtaskSearchItem } from "./subtask-search-item";
import { TaskSearchItem } from "./task-search-item";
import { UserSearchItem } from "./user-search-item";

export interface QuickSearchResponse {

  tasks: TaskSearchItem[];

  subtasks: SubtaskSearchItem[];

  attachments: AttachmentSearchItem[];

  users: UserSearchItem[];

}