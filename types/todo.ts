export type Todo = {
  id: string;
  task: string;
  status: "pending" | "completed";
  createdAt?: string;
  updatedAt?: string;
};
