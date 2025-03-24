import { ref } from 'vue';
import { defineStore } from 'pinia';

export default defineStore('messageStore', () => {
  const messages = ref([]);

  // 顯示 Toast
  function showToast() {
    setTimeout(() => {
      messages.value.shift();
    }, 3000);
  }

  // 關閉 Toast
  function clearToast(index) {
    messages.value.splice(index, 1);
  }

  // 新增 Toast
  function pushMessage(data) {
    const { style = 'success', title, text } = data;
    messages.value.push({ style, title, text });
    showToast();
  }

  return {
    messages,
    showToast,
    clearToast,
    pushMessage,
  };
});
