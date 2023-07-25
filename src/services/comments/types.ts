import { User } from "../users/types";

export interface Comment {
  id: number;
  text: string;
  taskId: number;
  parentId: number | null;
  numberOfChildren: number;
  createdAt: Date;
  updatedAt: Date;
  user: User;
}

export interface GetComments {
  data: Comment[];
  totalItems: number;
  totalPages: number;
}

export interface CreateComment {
  text: string;
  userId: number;
  taskId: number;
}

export interface TaskCommentsType {
  id: number;
  params: string;
}
