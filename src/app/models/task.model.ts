export interface ITask {
  id?: number;
  username: string;
  email: string;
  text: string;
  status: string;
  completed?: boolean;
  edited?: string| boolean | undefined;
  action?: any;
  [key: string]: any;
}

export interface IAdmin {
  username: string;
  password: string;
  [key: string]: any;
}
