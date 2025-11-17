import { Todo } from "@/types/todo";
import TodoList from "./_components/todo-list";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query: string; status: string }>;
}) {
  const { query, status } = await searchParams;

  const response = await fetch(
    `${process.env.BASE_URL}/items?query=${query ?? ""}&status=${status ?? ""}`
  );

  if (!response.ok) {
    return (
      <div className="max-w-md w-full mx-auto my-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
            <span className="text-red-600 text-sm font-bold">!</span>
          </div>
          <div className="flex-1">
            <h3 className="text-red-800 font-semibold text-sm mb-1">
              Something went wrong
            </h3>
            <p className="text-red-700 text-sm">
              Unable to fetch todos. Please try again or check the console for
              more details.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const result = await response.json();

  const todos: Todo[] = result.data;
  return <TodoList todos={todos} />;
}
