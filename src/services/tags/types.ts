export interface Tag {
  id: number;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface CreateTag {
  text: string;
}

export interface UpdateTag {
  id: number;
  body: CreateTag;
}
