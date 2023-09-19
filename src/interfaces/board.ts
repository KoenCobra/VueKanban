import type { BoardColumn } from "./boardColumn";

export interface Board {
 name?: string,
 columns: BoardColumn[]
}