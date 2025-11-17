"use client";
import {
  createTodo,
  removeTodo,
  updateTodoStatus,
} from "@/actions/todo-actions";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Todo } from "@/types/todo";
import {
  CircleCheck,
  CircleXIcon,
  FolderClosed,
  Loader2,
  Plus,
  Trash,
} from "lucide-react";
import React from "react";
import { toast } from "sonner";

export default function TodoList({ todos }: { todos: Todo[] }) {
  const [todo, setTodo] = React.useState<Partial<Todo>>({
    task: ``,
    status: `pending`,
  });
  const [loading, setLoading] = React.useState<boolean>(false);

  const addTodo = async () => {
    setLoading(true);
    const result = await createTodo(todo);

    if (!result.success) {
      toast.error("Todo not added!");
      return;
    }

    toast.success("Todo added!");

    setLoading(false);
    setTodo({ task: ``, status: `pending` });
  };

  return (
    <div className="space-y-4 max-w-md w-full mx-auto my-12">
      <h1 className="text-lg font-semibold underline">Todo App</h1>
      <div className="w-full flex items-center gap-2">
        <Input
          name="todo"
          placeholder="Add task to-do"
          value={todo.task}
          onChange={(e) => setTodo({ task: e.target.value, status: `pending` })}
        />
        <Button type="button" variant={"secondary"} onClick={addTodo}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Add
        </Button>
      </div>
      <div className="flex flex-col gap-3 h-60vh overflow-y-auto">
        {todos.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant={"icon"}>
                <FolderClosed />
              </EmptyMedia>
              <EmptyTitle>Nothing Yet</EmptyTitle>
              <EmptyDescription>
                You haven&apos;t created any to-dos yet. Get started by creating
                your first to-do.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          todos.map((t) => (
            <div
              key={t.id}
              className="flex justify-between items-center rounded-md py-2 px-3 border text-sm"
            >
              <p>{t.task}</p>
              <div className="flex items-center gap-2">
                <Button
                  variant={"ghost"}
                  size={"icon-sm"}
                  className={
                    t.status === "completed"
                      ? "bg-green-50 hover:bg-green-200 text-green-700"
                      : "bg-amber-50 hover:bg-amber-200 text-amber-700"
                  }
                  title={
                    t.status === "completed"
                      ? "Mark as pending"
                      : "Mark as completed"
                  }
                  onClick={() => updateTodoStatus(t.id, t.status)}
                >
                  {t.status === "completed" ? <CircleCheck /> : <CircleXIcon />}
                </Button>
                <Button
                  variant={"ghost"}
                  size={"icon-sm"}
                  className="hover:bg-red-50"
                  onClick={() => removeTodo(t.id)}
                >
                  <Trash className="text-red-600" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
