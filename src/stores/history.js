import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useHistoryStore = defineStore('history', () => {
  const history = ref([])
  function addToHistory(val) {
    history.value.push(val)
  }

  return { history, addToHistory }
})
