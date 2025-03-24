import { ref, onMounted } from 'vue';
import Modal from 'bootstrap/js/dist/modal';

// Modal
export function useModal(modalRef) {
  const modal = ref(null);

  onMounted(() => {
    modal.value = new Modal(modalRef.value);

    // 解決 Bootstrap Modal 關閉後焦點問題
    // https://github.com/twbs/bootstrap/issues/41005
    modalRef.value.addEventListener('hide.bs.modal', () => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    });
  });

  const openModal = () => {
    modal.value?.show();
  };

  const hideModal = () => {
    modal.value?.hide();
  };

  return {
    modal,
    openModal,
    hideModal,
  };
}

// token 相關

export const setToken = (token) => {
  const expries = new Date(Date.now() + 1000 * 60 * 60 * 24).toGMTString();
  document.cookie = `mySecretCookbook=${token}; expires=${expries}; path=/`;
};

export const getToken = () => {
  const token = document.cookie.replace(
    /(?:(?:^|.*;\s*)mySecretCookbook\s*=\s*([^;]*).*$)|^.*$/,
    '$1'
  );
  return token;
};

export const clearToken = () => {
  document.cookie = 'mySecretCookbook=;expires=;path=/';
};

// 取得時間
export const getTime = (time) => {
  const newTime = new Date(time);
  const year = newTime.getFullYear();
  const month = newTime.getMonth() < 9 ? `0${newTime.getMonth() + 1}` : newTime.getMonth() + 1;
  const date = newTime.getDate() < 9 ? `0${newTime.getDate()}` : newTime.getDate();
  const hour = newTime.getHours() < 10 ? `0${newTime.getHours()}` : newTime.getHours();
  const minutes = newTime.getMinutes() < 10 ? `0${newTime.getMinutes()}` : newTime.getMinutes();
  return `${year}/${month}/${date} ${hour}:${minutes}`;
};

// 利用分類 ID 取得分類名稱
export function getCategoryName(categoriesValue, categoryId) {
  const category = categoriesValue.find((item) => item._id === categoryId);
  return category ? category.title : '未分類';
}

// 利用標籤 ID 取得標籤名稱
export function getTagName(tagsValue, tagId) {
  const tag = tagsValue.find((item) => item._id === tagId);
  return tag ? tag.title : '';
}

// 取得當月份前後六個月的陣列
export function getMonthArray() {
  const monthArray = [];
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  for (let i = -6; i <= 6; i++) {
    const date = new Date(currentYear, currentMonth + i);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    monthArray.push({ year, month });
  }

  return monthArray;
}
