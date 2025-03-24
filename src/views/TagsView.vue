<template>
  <h1 class="mb-4 h3">標籤管理</h1>
  <div class="mb-8 text-end">
    <button type="button" class="btn btn-primary" @click="openTagEditModal('create')">
      <i class="bi bi-plus-lg me-8"></i>
      新增標籤
    </button>
  </div>
  <div class="table-responsive">
    <table class="table mb-14 align-middle">
      <thead>
        <tr class="table-active">
          <th class="d-none d-sm-table-cell text-center" width="120">ID 編號</th>
          <th class="text-center">標籤名稱</th>
          <th class="d-none d-xxl-table-cell text-center" width="200">建立時間</th>
          <th class="d-none d-xxl-table-cell text-center" width="200">更新時間</th>
          <th class="text-center" width="200">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in tags" :key="item._id">
          <td class="d-none d-sm-table-cell text-center">#{{ item._id.slice(-5) }}</td>
          <td class="text-center">{{ item.title }}</td>
          <td class="d-none d-xxl-table-cell text-center">{{ $getTime(item.createdAt) }}</td>
          <td class="d-none d-xxl-table-cell text-center">{{ $getTime(item.updatedAt) }}</td>

          <td class="text-center">
            <div class="btn-group btn-group-sm" role="group">
              <button
                type="button"
                class="btn btn-outline-dark"
                @click="openTagEditModal('edit', item)"
              >
                編輯
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

  <Pagination :pagination="pagination" @update-page="getTags" />
  <DelModal ref="delModalRef" :del-id="delData.id" @del-item="delTag">
    <template #modal-header> 刪除標籤 </template>
    <template #modal-content>
      確定要刪除 <strong> 標籤： {{ delData.title }} </strong>
    </template>
  </DelModal>
  <TagEditModal ref="tagEditModalRef" :temp-tag="tempTag" @get-tags="getTags">
    <template #modal-header> {{ tempTag.id ? '編輯標籤' : '新增標籤' }} </template>
  </TagEditModal>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { apiGetTags, apiDelTag } from '@/scripts/api';
import { loadingStore, messageStore } from '@/stores/index';
import Pagination from '@/components/PaginationComponent.vue';
import DelModal from '@/components/DelModal.vue';
import TagEditModal from '@/components/TagEditModal.vue';

const loadingRef = loadingStore();
const messageRef = messageStore();
const { openLoading, closeLoading } = loadingRef;
const { pushMessage } = messageRef;
const tags = ref([]);
const pagination = ref({});
const delModalRef = ref(null);
const tagEditModalRef = ref(null);
const delData = ref({
  id: '',
  title: '',
});
const tempTag = ref({
  id: '',
  title: '',
  createdAt: '',
  updatedAt: '',
});

// 取得所有標籤
async function getTags(page = 1) {
  openLoading();

  try {
    const res = await apiGetTags({ page });
    tags.value = res.data.data.results;
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

// 刪除標籤
async function delTag(id) {
  openLoading();

  try {
    const res = await apiDelTag(id);
    const { status } = res.data;

    if (status === 'success') {
      pushMessage({
        style: 'success',
        title: '刪除成功',
        text: '標籤刪除成功，請等待載入畫面',
      });
      getTags();
    } else {
      pushMessage({
        style: 'danger',
        title: '刪除失敗',
        text: '標籤刪除失敗，請重整網頁',
      });
    }
    delModalRef.value?.hideModal();
    closeLoading();
  } catch (err) {
    pushMessage({
      style: 'danger',
      title: '刪除失敗',
      text: err.response?.data?.message || '標籤刪除失敗，請重整網頁',
    });
    closeLoading();
  }
}

// 開啟 delModal
function openDelModal(item) {
  delData.value = {
    id: item._id,
    title: item.title,
  };

  delModalRef.value?.openModal();
}

// 開啟 tagEditModal
function openTagEditModal(action, item) {
  if (action === 'create') {
    tempTag.value = {
      id: '',
      title: '',
      createdAt: '',
      updatedAt: '',
    };
  } else {
    tempTag.value = {
      id: item._id,
      title: item.title,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }
  tagEditModalRef.value?.openModal();
}

onMounted(() => {
  getTags();
});
</script>
