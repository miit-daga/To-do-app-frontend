import { create } from "zustand";

const taskStore = (set) => ({
  tasks: [],
  tasksType: "all",
  isLoading: false,

  setTasks: (tasks) =>
    set((state) => ({
      ...state,
      tasks,
    })),
  setTasksType: (tasksType) =>
    set((state) => ({
      ...state,
      tasksType,
    })),

  setIsLoading: (isLoading) => set((state) => ({ ...state, isLoading })),
});

const useTaskStore = create(taskStore);
export default useTaskStore;
