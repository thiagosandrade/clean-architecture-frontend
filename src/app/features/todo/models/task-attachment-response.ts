export interface TaskAttachmentsResponse {
  attachments: TaskAttachment[];
}

export interface TaskAttachment {
  id: string;
  todoItemId: string;
  originalFileName: string;
  storedFileName: string;
  contentType: string;
  size: number;
  createdOn: string;
  createdBy: string;
}
