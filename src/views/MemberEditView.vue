<template>
  <div class="container-fluid">
    <div class="row gx-16 justify-content-center">
      <div class="col-12 mb-14">
        <h1 class="h3">編輯會員</h1>
      </div>
      <div class="col-12 col-xxl-6 mb-16">
        <div class="d-flex flex-column h-100 py-16 px-14 px-md-16 bg-white rounded shadow-sm">
          <h2 class="title mb-11">
            <span class="titleIcon bg-secondary-subtle">
              <i class="bi bi-image-fill"></i>
            </span>
            <span> 會員頭像 </span>
          </h2>
          <div class="flex-fill d-flex flex-column justify-content-center m-lg-16">
            <UploadComponent
              :temp-image-url="member.avatarImgUrl"
              imageType="avatar"
              @update-image="uploadImage"
            />
          </div>
        </div>
      </div>
      <div class="col-12 col-xxl-6 mb-16">
        <div class="p-14 p-md-16 bg-white shadow-sm rounded">
          <h2 class="title mb-11">
            <span class="titleIcon bg-secondary-subtle">
              <i class="bi bi-image-fill"></i>
            </span>
            <span> 基本資料 </span>
          </h2>
          <VForm ref="formRef" v-slot="{ errors, meta }" @submit="updateMember(tempMember)">
            <div class="mb-8">
              <label for="id" class="form-label"> 會員編號： </label>
              <input
                type="text"
                name="id"
                id="id"
                class="form-control"
                :value="member._id"
                disabled
              />
            </div>
            <div class="mb-8">
              <label for="email" class="form-label"> 電子信箱： </label>
              <input
                type="email"
                name="email"
                id="email"
                class="form-control"
                :value="member.email"
                disabled
              />
            </div>
            <div class="mb-8">
              <label for="nickName" class="form-label"> 暱稱： </label>
              <VField
                type="text"
                name="暱稱"
                id="nickName"
                class="form-control"
                :class="{
                  'is-invalid': errors['暱稱'],
                }"
                placeholder="請輸入暱稱"
                rules="required"
                v-model="tempMember.nickName"
                required
              />
              <ErrorMessage name="暱稱" class="invalid-feedback" />
            </div>
            <div class="mb-8">
              <label for="gender" class="form-label"> 性別： </label>
              <VField
                as="select"
                name="性別"
                id="gender"
                class="form-select"
                :class="{ 'is-invalid': errors['性別'] }"
                placeholder="請選擇性別"
                rules="required"
                v-model="tempMember.gender"
                required
              >
                <option value="secret" select>秘密</option>
                <option value="female">女生</option>
                <option value="male">男生</option>
              </VField>
              <ErrorMessage name="性別" class="invalid-feedback" />
            </div>
            <div class="mb-16">
              <label for="role" class="form-label"> 權限： </label>
              <VField
                as="select"
                name="權限"
                id="role"
                class="form-select"
                :class="{ 'is-invalid': errors['權限'] }"
                placeholder="請選擇權限"
                rules="required"
                v-model="tempMember.role"
                required
              >
                <option value="member" select>會員</option>
                <option value="admin">管理員</option>
              </VField>
              <ErrorMessage name="權限" class="invalid-feedback" />
            </div>
            <div class="text-center">
              <button
                type="submit"
                aria-disabled="true"
                class="btn btn-primary w-75"
                :class="{ disabled: !meta.valid }"
                :disabled="!meta.valid"
              >
                更新基本資料
              </button>
            </div>
          </VForm>
        </div>
      </div>
      <div class="col-12 text-center">
        <router-link to="/dashboard/members" class="btn btn-outline-primary">
          <i class="bi bi-arrow-90deg-left me-8"></i>
          返回會員列表
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { loadingStore, messageStore } from '@/stores/index';
import { apiGetMember, apiUpdateMember } from '@/scripts/api';
import UploadComponent from '@/components/UploadComponent.vue';

const router = useRouter();
const route = useRoute();
const loadingRef = loadingStore();
const messageRef = messageStore();
const { openLoading, closeLoading } = loadingRef;
const { pushMessage } = messageRef;

const formRef = ref(null);
const member = ref({});
const tempMember = ref({});

// 取得會員資料
async function getMember(id) {
  openLoading();

  try {
    const res = await apiGetMember(id);
    const { status, data } = res.data;
    if (status === 'success') {
      member.value = { ...data };
      tempMember.value = { ...data };
    } else {
      pushMessage({
        style: 'danger',
        title: '載入失敗',
        text: '會員取得失敗，將轉回會員列表頁面',
      });
      router.push('/dashboard/member');
    }
    closeLoading();
  } catch (err) {
    pushMessage({
      style: 'danger',
      title: '載入失敗',
      text: err.response?.data?.message || '會員取得失敗，將轉回會員列表頁面',
    });
    closeLoading();
    router.push('/dashboard/member');
  }
}

// 更新會員基本資料
async function updateMember(item, updateType) {
  openLoading();

  if (updateType !== 'updateAvatarImgUrl') {
    // 刪除頭像資料
    delete item.avatarImgUrl;
  }

  try {
    const res = await apiUpdateMember(item, member.value._id);
    const { status, data } = res.data;
    if (status === 'success') {
      pushMessage({
        style: 'success',
        title: '更新成功',
        text: '更新成功',
      });
      member.value = { ...data };
      tempMember.value = { ...data };
    } else {
      pushMessage({
        style: 'danger',
        title: '更新失敗',
        text: '更新失敗，請重整網頁',
      });
    }
    closeLoading();
  } catch (err) {
    pushMessage({
      style: 'danger',
      title: '更新失敗',
      text: err.response?.data?.message || '更新失敗，請重整網頁',
    });
    closeLoading();
  }
}

// 更新圖片
function uploadImage(imageUrl) {
  updateMember({ avatarImgUrl: imageUrl }, 'updateAvatarImgUrl');
}

onMounted(() => {
  const { id } = route.params;
  if (id) {
    getMember(id);
  } else {
    pushMessage({
      style: 'danger',
      title: '請輸入正確會員 ID',
      text: '會員 ID 錯誤',
    });
    router.push('/dashboard/member');
  }
});
</script>
