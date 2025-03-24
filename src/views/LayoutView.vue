<template>
  <div class="position-relative">
    <aside class="sidebar bg-primary">
      <div class="d-flex justify-content-between justify-content-xl-center align-items-center">
        <router-link to="/signin" class="d-block px-8 py-5 text-center">
          <img src="../assets/images/logo-white.svg" alt="logo" class="mw-100" />
        </router-link>
        <a
          class="btn btn-primary py-3 d-xl-none border-0 fs-2 rounded-0"
          data-bs-toggle="offcanvas"
          href="#sidebarMenu"
          role="button"
          aria-controls="sidebarMenu"
        >
          <i class="bi bi-list"></i>
        </a>
      </div>
      <div
        class="offcanvas-xl offcanvas-end text-bg-primary flex-fill"
        data-bs-backdrop="static"
        tabindex="-1"
        id="sidebarMenu"
        aria-labelledby="sidebarMenuLabel"
      >
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" id="sidebarMenuLabel">
            <img src="../assets/images/logo-white.svg" alt="logo" class="mw-100" />
          </h5>

          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
            data-bs-target="#sidebarMenu"
            aria-label="Close"
          ></button>
        </div>
        <div class="offcanvas-body d-flex flex-column justify-content-between h-100">
          <ul class="list-unstyled mx-11 mt-14 mb-0 p-0">
            <li class="mb-6">
              <p class="textLsLg text-muted">選單</p>
            </li>
            <li class="mb-6">
              <router-link to="/dashboard" class="menuLink d-block px-8 py-4 rounded-2 text-white">
                <i class="bi bi-speedometer me-8"></i>
                控制台
              </router-link>
            </li>
            <li class="mb-6">
              <router-link
                to="/dashboard/members"
                class="menuLink d-block px-8 py-4 rounded-2 text-white"
                :class="{ active: $route.name === 'memberEdit' }"
              >
                <i class="bi bi-people-fill me-8"></i>
                會員管理
              </router-link>
            </li>
            <li class="mb-6">
              <router-link
                to="/dashboard/categories"
                class="menuLink d-block px-8 py-4 rounded-2 text-white"
              >
                <i class="bi bi-columns-gap me-8"></i>
                分類管理
              </router-link>
            </li>
            <li class="mb-6">
              <router-link
                to="/dashboard/tags"
                class="menuLink d-block px-8 py-4 rounded-2 text-white"
              >
                <i class="bi bi-bookmarks me-8"></i>
                標籤管理
              </router-link>
            </li>
            <li class="mb-6">
              <router-link
                to="/dashboard/recipes"
                class="menuLink d-block px-8 py-4 rounded-2 text-white"
                :class="{ active: $route.name === 'recipeEdit' }"
              >
                <i class="bi bi-cookie me-8"></i>
                食譜管理
              </router-link>
            </li>
            <li class="mb-6">
              <router-link
                to="/dashboard/images"
                class="menuLink d-block px-8 py-4 rounded-2 text-white"
              >
                <i class="bi bi-image me-8"></i>
                圖片管理
              </router-link>
            </li>
            <li class="mb-6">
              <p class="textLsLg text-muted">其他</p>
            </li>
            <li class="mb-6">
              <a
                href="#"
                class="menuLink d-block px-8 py-4 rounded-2 text-white"
                @click.prevent="signOut"
              >
                <i class="bi bi-door-open-fill me-8"></i>
                登出
              </a>
            </li>
          </ul>
        </div>
      </div>
    </aside>
    <main class="main d-flex flex-column px-8 py-17 px-xl-17">
      <RouterView v-if="signInStatus" />
    </main>
  </div>
</template>

<script setup>
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/offcanvas';
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getToken, clearToken } from '@/scripts/methods';
import { messageStore } from '@/stores/index';

const router = useRouter();
const messageRef = messageStore();
const { pushMessage } = messageRef;
const signInStatus = ref(false);

// 登出
function signOut() {
  clearToken();
  pushMessage({
    style: 'success',
    title: '登出成功',
    text: '登出成功，將跳轉至登入頁面',
  });
  router.push('/signin');
}

// 確認是否登入
function checkSignInStatus() {
  // 取得 token
  const token = getToken();

  // 若有 token 則登入，反之轉為登入頁面
  if (token) {
    signInStatus.value = true;
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    signInStatus.value = false;
    pushMessage({
      style: 'danger',
      title: '登入失敗',
      text: '登入失敗，請重新登入',
    });
    router.push('/signin');
  }
}

onMounted(() => {
  checkSignInStatus();
});
</script>
