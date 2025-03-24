<template>
  <h1 class="mb-14 h3">會員管理</h1>
  <div class="table-responsive">
    <table class="table mb-14 align-middle">
      <thead>
        <tr class="table-active">
          <th class="d-none d-md-table-cell text-center" width="120">ID 編號</th>
          <th class="text-center">會員</th>
          <th class="d-none d-lg-table-cell text-center">電子信箱</th>
          <th class="d-none d-xxl-table-cell text-center" width="120">性別</th>
          <th class="d-none d-sm-table-cell text-center" width="120">身分別</th>
          <th class="d-none d-xxl-table-cell text-center" width="200">建立時間</th>
          <th class="d-none d-xxl-table-cell text-center" width="200">更新時間</th>
          <th class="text-center" width="200">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in members" :key="item._id">
          <td class="d-none d-md-table-cell text-center">#{{ item._id.slice(-5) }}</td>
          <td class="text-center">
            <div class="d-flex justify-content-center align-items-center">
              <img
                :src="item.avatarImgUrl"
                class="thumbnail me-4 rounded-circle"
                v-if="item.avatarImgUrl"
              />
              <div class="thumbnail me-4 rounded-circle" v-else>
                <i class="bi bi-person-fill"></i>
              </div>
              {{ item.nickName }}
            </div>
          </td>
          <td class="d-none d-lg-table-cell text-center">{{ item.email }}</td>
          <td class="d-none d-xxl-table-cell text-center">
            {{ { female: '女生', male: '男性' }[item.gender] || '秘密' }}
          </td>
          <td class="d-none d-sm-table-cell text-center">
            {{ item.role === 'admin' ? '管理員' : '會員' }}
          </td>
          <td class="d-none d-xxl-table-cell text-center">{{ $getTime(item.createdAt) }}</td>
          <td class="d-none d-xxl-table-cell text-center">{{ $getTime(item.updatedAt) }}</td>

          <td class="text-center">
            <div class="btn-group btn-group-sm" role="group">
              <router-link :to="`/dashboard/member/${item._id}`" class="btn btn-outline-dark">
                編輯
              </router-link>
              <button type="button" class="btn btn-outline-danger" @click="openDelModal(item)">
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <Pagination :pagination="pagination" @update-page="getMembers" />
  <DelModal ref="delModalRef" :del-id="delData.id" @del-item="delMember">
    <template #modal-header> 刪除{{ delData.role === 'admin' ? '管理員' : '會員' }} </template>
    <template #modal-content>
      <p class="mb-8">
        確定要刪除
        <strong>
          {{ delData.role === 'admin' ? '管理員' : '會員' }}：#{{ delData.id.slice(-5) }}
        </strong>
      </p>
      <div class="d-flex align-items-center">
        <img
          :src="delData.avatarImgUrl"
          class="thumbnail me-4 rounded-circle"
          v-if="delData.avatarImgUrl"
        />
        <img src="" class="thumbnail me-4 rounded-circle" v-else />
        <strong>
          {{ delData.nickName }}
        </strong>
      </div>
    </template>
  </DelModal>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { apiGetMembers, apiDelMember } from '@/scripts/api';
import { loadingStore, messageStore } from '@/stores/index';
import Pagination from '@/components/PaginationComponent.vue';
import DelModal from '@/components/DelModal.vue';

const loadingRef = loadingStore();
const messageRef = messageStore();
const { openLoading, closeLoading } = loadingRef;
const { pushMessage } = messageRef;
const members = ref([]);
const pagination = ref({});
const delModalRef = ref(null);
const delData = ref({
  id: '',
  role: '',
  avatarImgUrl: '',
  nickName: '',
});

// 取得所有會員
async function getMembers(page = 1) {
  openLoading();

  try {
    const res = await apiGetMembers({ page });
    members.value = res.data.data.results;
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

// 刪除會員
async function delMember(id) {
  openLoading();

  try {
    const res = await apiDelMember(id);
    const { status } = res.data;

    if (status === 'success') {
      pushMessage({
        style: 'success',
        title: '刪除成功',
        text: '刪除成功，請等待載入畫面',
      });
      getMembers();
    } else {
      pushMessage({
        style: 'danger',
        title: '刪除失敗',
        text: '刪除失敗，請重整網頁',
      });
    }
    delModalRef.value?.hideModal();
    closeLoading();
  } catch (err) {
    pushMessage({
      style: 'danger',
      title: '刪除失敗',
      text: err.response?.data?.message || '刪除失敗，請重整網頁',
    });
    closeLoading();
  }
}

// 開啟 delModal
function openDelModal(item) {
  delData.value = {
    id: item._id,
    role: item.role,
    avatarImgUrl: item.avatarImgUrl,
    nickName: item.nickName,
  };

  delModalRef.value?.openModal();
}

onMounted(() => {
  getMembers();
});
</script>
