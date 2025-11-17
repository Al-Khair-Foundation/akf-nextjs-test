# Test Tasks

## Task 1: Add Filter Capabilities

Implement filtering functionality for the todo list using search and status filters in todo-list.tsx.

### Requirements

1. **Search Input**

   - Add a text input field to search todos by task name
   - Implement debouncing (500ms) to prevent excessive API calls
   - Update URL search params with query parameter

2. **Status Dropdown**
   - Add a select dropdown with options:
     - All
     - Completed
     - Pending
   - Update URL search params with status parameter
   - Sync dropdown value with URL state

### Acceptance Criteria

- [ ] Search input filters todos by task name
- [ ] Dropdown filters todos by status (all/completed/pending)
- [ ] URL updates with search params
- [ ] Filters persist on page reload
- [ ] 500ms debounce applied to search input

---

## Task 2: Server-Side Data Fetching with Suspense

Implement server action for fetching todos and add React Suspense for loading states in page.tsx for component Home.

### Requirements

1. **Server Action**

   - Create `getTodos` server action in `actions/todo-actions.ts`
   - Accept `query` and `status` parameters
   - Return todos from API endpoint: `GET /items?query=&status=`

2. **Page Component Updates**

   - Use server action in `app/page.tsx` (Server Component)
   - Read `query` and `status` from searchParams
   - Pass parameters to `getTodos` action

3. **React Suspense**
   - Wrap TodoList component with Suspense boundary
   - Add loading fallback component
   - Show skeleton/spinner during data fetch

### Acceptance Criteria

- [ ] `getTodos` server action created
- [ ] Server action accepts query and status parameters
- [ ] Page component uses server action instead of direct fetch
- [ ] Suspense boundary shows loading state
- [ ] Error boundary handles failed requests
- [ ] URL params properly passed to API

---

## Testing Checklist

### Task 1 Testing

- [ ] Type in search input and verify todos filter after 500ms
- [ ] Select different status options and verify filtering
- [ ] Check URL updates with correct search params
- [ ] Reload page and verify filters persist
- [ ] Clear filters and verify all todos show

### Task 2 Testing

- [ ] Navigate to page and verify loading state appears
- [ ] Verify todos load correctly after suspense resolves
- [ ] Test with different query params in URL
- [ ] Test with different status params in URL
- [ ] Simulate API error and verify error handling
- [ ] Check network tab for correct API calls

## Notes

- Both tasks work together: filters update URL → page refetches → suspense shows loading
- Server action enables better caching and revalidation
- Suspense provides automatic loading states without manual state management
