<template>
  <h1 class="mb-14 h3">圖片管理</h1>
  <div class="table-responsive">
    <table class="table mb-14 align-middle">
      <thead>
        <tr class="table-active">
          <th class="d-none d-sm-table-cell text-center" width="120">ID 編號</th>
          <th class="d-none d-sm-table-cell text-center" width="120">圖片類型</th>
          <th class="text-center">圖片網址</th>
          <th class="d-none d-xxl-table-cell text-center" width="160">上傳會員</th>
          <th class="d-none d-xxl-table-cell text-center" width="160">建立時間</th>
          <th class="d-none d-xxl-table-cell text-center" width="160">更新時間</th>
          <th class="text-center" width="160">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in images" :key="item._id">
          <td class="d-none d-sm-table-cell text-center">#{{ item._id.slice(-5) }}</td>
          <td class="d-none d-sm-table-cell text-center">{{ item.type }}</td>
          <td class="text-center">
            <div class="d-flex flex-column flex-md-row justify-content-center align-items-center">
              <img :src="item.imageUrl" alt="" class="thumbnail me-md-4" />
              <a :href="item.imageUrl" target="_blank" class="text-decoration-underline">
                開啟圖片
              </a>
            </div>
          </td>
          <td class="d-none d-xxl-table-cell text-center">{{ item.user?.nickName }}</td>
          <td class="d-none d-xxl-table-cell text-center">{{ $getTime(item.createdAt) }}</td>
          <td class="d-none d-xxl-table-cell text-center">{{ $getTime(item.updatedAt) }}</td>

          <td class="text-center">
            <div class="btn-group btn-group-sm" role="group">
              <button type="button" class="btn btn-outline-dark" @click="openImageModal(item)">
                看更多
              </button>
              <button type="button" class="btn btn-outline-danger" @click="openDelModal(item)">
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <Pagination :pagination="pagination" @update-page="getImages" />
  <DelModal ref="delModalRef" :del-id="delData.id" @del-item="delImage">
    <template #modal-header> 刪除圖片 </template>
    <template #modal-content>
      <p class="mb-8">
        確定要刪除 <strong> 圖片：#{{ delData.id.slice(-5) }} </strong>
      </p>
      <img :src="delData.imageUrl" class="img-thumbnail" style="max-height: 12rem" />
    </template>
  </DelModal>
  <ImageModal ref="imageModalRef">
    <template #modal-header> 圖片 #{{ tempImage.id.slice(-5) }} </template>
    <template #modal-image>
      <img :src="tempImage.imageUrl" class="img-thumbnail" style="max-height: 20rem" />
    </template>
    <template #modal-content>
      <label for="imageUrl" class="form-label">網址連結：</label>
      <input
        type="text"
        id="imageUrl"
        class="form-control mb-8"
        :value="tempImage.imageUrl"
        disabled
      />
      <p>上傳會員：{{ tempImage.userNickName }}</p>
      <p>建立時間：{{ $getTime(tempImage.createdAt) }}</p>
      <p>更新時間：{{ $getTime(tempImage.updatedAt) }}</p>
    </template>
  </ImageModal>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { apiGetImages, apiDelImage } from '@/scripts/api';
import { loadingStore, messageStore } from '@/stores/index';
import Pagination from '@/components/PaginationComponent.vue';
import DelModal from '@/components/DelModal.vue';
import ImageModal from '@/components/ImageModal.vue';

const loadingRef = loadingStore();
const messageRef = messageStore();
const { openLoading, closeLoading } = loadingRef;
const { pushMessage } = messageRef;
const images = ref([]);
const pagination = ref({});
const delModalRef = ref(null);
const imageModalRef = ref(null);
const delData = ref({
  id: '',
  imageUrl: '',
});
const tempImage = ref({
  id: '',
  type: '',
  imageUrl: '',
  user: {
    nickName: '',
  },
  createdAt: '',
  updatedAt: '',
});

// 取得所有圖片
async function getImages(page = 1) {
  openLoading();
  try {
    const res = await apiGetImages({ page });
    images.value = res.data.data.results;
    pagination.value = res.data.data.pagination;
    closeLoading();
  } catch (err) {
    pushMessage({
      style: 'danger',
      title: '載入失敗',
      text: err.response?.data?.message || '載入失敗，請重整網頁',
    });
    closeLoading();
  }
}

// 刪除圖片
async function delImage(id) {
  openLoading();

  try {
    const res = await apiDelImage(id);
    const { status } = res.data;

    if (status === 'success') {
      pushMessage({
        style: 'success',
        title: '刪除成功',
        text: '圖片刪除成功，請等待載入畫面',
      });
      getImages();
    } else {
      pushMessage({
        style: 'danger',
        title: '刪除失敗',
        text: '圖片刪除失敗，請重整網頁',
      });
    }
    delModalRef.value?.hideModal();
    closeLoading();
  } catch (err) {
    pushMessage({
      style: 'danger',
      title: '刪除失敗',
      text: err.response?.data?.message || '圖片刪除失敗，請重整網頁',
    });
    closeLoading();
  }
}

// 開啟 delModal
function openDelModal(item) {
  delData.value = {
    id: item._id,
    imageUrl: item.imageUrl,
  };

  delModalRef.value?.openModal();
}

// 開啟 ImageModal
function openImageModal(item) {
  tempImage.value = {
    id: item._id,
    type: item.type,
    imageUrl: item.imageUrl,
    userNickName: item.user?.nickName,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
  imageModalRef.value?.openModal();
}

onMounted(() => {
  getImages();
});
</script>
