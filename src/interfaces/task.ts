import type { SubTask } from "./subTask";

export interface Task {
 description?: string,
 status?: string,
 subTasks: SubTask[],
 title?: string
}