import { defineStore } from "pinia";
import { ref } from "vue";
import axios from 'axios'
import type { Board } from "@/interfaces/board";

export const useBoardStore = defineStore('board', () => {
 const boards = ref<Board[]>([])
 const selectedBoard = ref<Board>()
 const isEditBoardVisible = ref(false)
 const isSideBarVisible = ref(true)
 const isAddBoardVisible = ref(false)

 const getBoards = async () => {
  try {
   const response = await axios.get('data.json');
   boards.value = response.data.boards;

  } catch (error) {
   console.error('Error fetching boards:', error);
  }
 }

 const addBoard = (board: Board) => {
  boards.value.push(board)
 }

 return { boards, selectedBoard, isEditBoardVisible, isSideBarVisible, isAddBoardVisible, getBoards, addBoard }
})