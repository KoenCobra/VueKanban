import { defineStore } from "pinia";
import { ref } from "vue";

export const useThemeStore = defineStore('theme', () => {
 const isDarkMode = ref(false)

 return { isDarkMode }
})