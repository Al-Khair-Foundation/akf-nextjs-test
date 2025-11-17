"use server";

import { Todo } from "@/types/todo";
import { revalidatePath } from "next/cache";

export async function createTodo(todo: Partial<Todo>) {
  try {
    const response = await fetch(`${process.env.BASE_URL}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todo),
    });

    const result = await response.json();

    console.log(result);

    if (!response.ok) {
      throw new Error(result.error ?? "Unable to create todo");
    }

    revalidatePath(`/`);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    };
  }
}

export async function removeTodo(id: string) {
  try {
    const response = await fetch(`${process.env.BASE_URL}/items/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    const result = await response.json();

    console.log(result);

    if (!response.ok) {
      throw new Error(result.error ?? "Unable to create todo");
    }

    revalidatePath(`/`);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    };
  }
}

export async function updateTodoStatus(id: string, status: string) {
  try {
    const response = await fetch(`${process.env.BASE_URL}/items/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: status === "pending" ? "completed" : "pending",
      }),
    });

    const result = await response.json();

    console.log(result);

    if (!response.ok) {
      throw new Error(result.error ?? "Unable to create todo");
    }

    revalidatePath(`/`);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    };
  }
}
