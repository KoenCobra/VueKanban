import type { BoardColumn } from "./BoardColumn";

export interface Board {
 name?: string,
 columns: BoardColumn[]
}