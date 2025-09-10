import { BASE_URL } from "@/utils/constant";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export type Task = {
  id: string;
  title: string;
  description: string;
  status: "todo" | "inProgress" | "done";
  date: string;
};

export type GroupedTasks = {
  todo: Task[];
  "inProgress": Task[];
  done: Task[];
};

type TasksState = {
  tasks: GroupedTasks;
  loading: boolean;
  error: string | null;
};

const initialState: TasksState = {
  tasks: { todo: [], inProgress: [], done: [] },
  loading: false,
  error: null,
};

// --- Thunks (API calls) ---
export const fetchTasks = createAsyncThunk("tasks/fetch", async () => {
  const res = await axios.get<GroupedTasks>(`${BASE_URL}/api/tasks`);
  return res.data;
});

export const createTask = createAsyncThunk(
  "tasks/create",
  async (task: { title: string; description: string; status: "todo" | "inProgress" | "done" }) => {
    const res = await axios.post<Task>(`${BASE_URL}/api/tasks`, task);
    return res.data;
  }
);

export const updateTask = createAsyncThunk(
  "tasks/update",
  async ({ id, updates }: { id: string; updates: Partial<Task> }) => {
    const res = await axios.put<Task>(`${BASE_URL}/api/tasks/${id}`, updates);
    return res.data;
  }
);

export const updateTaskStatus = createAsyncThunk(
  "tasks/updateStatus",
  async ({ id, status }: { id: string; status: "todo" | "inProgress" | "done" }) => {
    const res = await axios.patch<Task>(`${BASE_URL}/api/tasks/${id}/status`, { status });
    return res.data;
  }
);

export const deleteTask = createAsyncThunk("tasks/delete", async (id: string) => {
  await axios.delete(`${BASE_URL}/api/tasks/${id}`);
  return id;
});

// --- Slice ---
const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch
    builder.addCase(fetchTasks.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.loading = false;
      state.tasks = action.payload;
    });
    builder.addCase(fetchTasks.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch tasks";
    });

    // Create
    builder.addCase(createTask.fulfilled, (state, action) => {
      state.tasks[action.payload.status].push(action.payload);
    });

    // Update
    builder.addCase(updateTask.fulfilled, (state, action) => {
      const updated = action.payload;
      (Object.keys(state.tasks) as (keyof GroupedTasks)[]).forEach((key) => {
        state.tasks[key] = state.tasks[key].map((t) =>
          t.id === updated.id ? updated : t
        );
      });
    });

    // Update Status
    builder.addCase(updateTaskStatus.fulfilled, (state, action) => {
      const updated = action.payload;
      // remove from old list
      (Object.keys(state.tasks) as (keyof GroupedTasks)[]).forEach((key) => {
        state.tasks[key] = state.tasks[key].filter((t) => t.id !== updated.id);
      });
      // add to new list
      state.tasks[updated.status].push(updated);
    });

    // Delete
    builder.addCase(deleteTask.fulfilled, (state, action) => {
      (Object.keys(state.tasks) as (keyof GroupedTasks)[]).forEach((key) => {
        state.tasks[key] = state.tasks[key].filter((t) => t.id !== action.payload);
      });
    });
  },
});

export default tasksSlice.reducer;
