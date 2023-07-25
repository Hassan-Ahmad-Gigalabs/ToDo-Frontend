export interface Task {
  id: number;
  title: string;
  state: string;
  description: string;
  uploads: string[];
  startDate: Date;
  endDate: Date;
  numberOfChildren: number;
  createdAt: Date;
  updatedAt: Date;
  tags: {
    id: number;
    text: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
  assignees: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
  comments: {
    id: number;
    text: string;
    numberOfChildren: number;
    createdAt: Date;
    updatedAt: Date;
  }[];
  children: Partial<Task>[];
}

export interface CreateTask {
  title: string;
  description: string;
  state: string;
  uploads: string[];
  startDate: Date;
  endDate: Date;
  numberOfChildren: number;
  createdAt: Date;
  updatedAt: Date;
  tags: number[];
  assignees: number[];
  parentId?: number;
}

export interface UpdateTask {
  id: number;
  body: Partial<CreateTask>;
}

export interface Remove {
  id: number;
  file: string;
}

export interface Upload {
  message: string;
  file: string;
}
