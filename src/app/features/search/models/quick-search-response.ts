import { TodoItemAttachmentSearch as AttachmentItemSearch } from "./attachment-search-item";
import { SubItemSearch } from "./todo-subitem-search";
import { TodoItemSearch } from "./todo-item-search";
import { UserSearchItem as UserItemSearch } from "./user-search-item";

export interface QuickSearchResponse {
  tasks: TodoItemSearch[];
  subtasks: SubItemSearch[];
  attachments: AttachmentItemSearch[];
  users: UserItemSearch[];
}