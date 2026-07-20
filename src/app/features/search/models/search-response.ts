import { TodoItemAttachmentSearch } from "./attachment-search-item";
import { SubItemSearch } from "./todo-subitem-search";
import { TodoItemSearch } from "./todo-item-search";
import { UserSearchItem } from "./user-search-item";


export interface SearchResponse {

  tasks: TodoItemSearch[];

  subtasks: SubItemSearch[];

  attachments: TodoItemAttachmentSearch[];

  users: UserSearchItem[];

}