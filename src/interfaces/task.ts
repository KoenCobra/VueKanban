import type { SubTask } from "./subTask";

export interface Task {
 description?: string,
 status?: string,
 subtasks: SubTask[],
 title?: string
}