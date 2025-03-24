<template>
  <input
    type="file"
    accept="image/*"
    id="image"
    name="image"
    class="d-none"
    @change="changeImage"
  />

  <div v-if="isPreview">
    <div
      class="position-relative mb-11 border rounded-3"
      :class="[imageType === 'icon' ? '' : 'mb-lg-17']"
    >
      <a
        href="#"
        class="previewResetBtn position-absolute top-0 end-0 px-2 text-white fs-2"
        @click.prevent="resetImage('reset')"
      >
        <i class="bi bi-x"></i>
      </a>
      <div
        class="previewImage backgroundCover rounded-3"
        :style="{ backgroundImage: `url(${previewImageUrl})` }"
      ></div>
    </div>

    <div class="text-center">
      <button type="button" class="btn btn-primary w-75" @click.prevent="uploadImage">
        確認更新
      </button>
    </div>
  </div>

  <div v-else>
    <label
      for="image"
      class="w-100 mb-11 border rounded-3 overflow-hidden"
      :class="[imageType === 'icon' ? '' : 'mb-xl-17']"
    >
      <span
        class="uploadLabelImage backgroundCover cursorPoint d-block"
        :style="{ backgroundImage: `url(${tempImageUrl})` }"
        v-if="tempImageUrl"
      ></span>
      <span
        class="uploadLabelBtn cursorPoint d-flex flex-column justify-content-center align-items-center fs-5"
        v-else
      >
        <i class="bi bi-cloud-arrow-up d-block display-3"></i>
        點擊上傳{{ imageType === 'avatar' ? '頭像' : '封面' }}
      </span>
    </label>

    <label for="image" class="d-block text-center">
      <span class="btn btn-primary w-75">
        {{ imageType === 'avatar' ? '更新頭像' : '更新封面' }}
      </span>
    </label>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { loadingStore, messageStore } from '@/stores/index';
import { apiCreateImage } from '@/scripts/api';

const loadingRef = loadingStore();
const messageRef = messageStore();
const { openLoading, closeLoading } = loadingRef;
const { pushMessage } = messageRef;

const props = defineProps({
  tempImageUrl: {
    type: String,
    default: '',
  },
  imageType: {
    type: String,
    default: 'avatar',
  },
});
const emit = defineEmits(['updateImage']);

const uploadFile = ref('');
const isPreview = ref(false);
const previewImageUrl = ref('');

// 更換並瀏覽圖片
function changeImage(event) {
  const image = event.target.files[0];

  if (image) {
    uploadFile.value = image;
    let url = window.URL.createObjectURL(image);
    isPreview.value = true;
    previewImageUrl.value = url;
  }
}

// 重置圖片
function resetImage() {
  uploadFile.value = '';
  previewImageUrl.value = '';
  isPreview.value = false;
  window.URL.revokeObjectURL(uploadFile.value);
}

// 上傳圖片
async function uploadImage() {
  const formData = new FormData();
  formData.append('image', uploadFile.value);
  openLoading();

  try {
    const res = await apiCreateImage(formData, props.imageType);
    const { status, data } = res.data;

    if (status === 'success') {
      pushMessage({
        style: 'success',
        title: '上傳成功',
        text: '上傳成功，請等待圖片載入',
      });
      emit('updateImage', data.imageUrl);
    } else {
      pushMessage({
        style: 'danger',
        title: '上傳失敗',
        text: '上傳失敗，請重整網頁',
      });
    }
    resetImage();
    closeLoading();
  } catch (err) {
    pushMessage({
      style: 'danger',
      title: '上傳失敗',
      text: err.response?.data?.message || '上傳失敗，請重整網頁',
    });
    closeLoading();
  }
}
</script>
