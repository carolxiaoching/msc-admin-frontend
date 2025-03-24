<template>
  <div class="container-fluid">
    <h1 class="mb-14 h3">控制台</h1>
    <div class="row g-8 g-lg-16 mb-16 mb-lg-16">
      <div class="col-6 col-lg-3" v-for="(item, index) in stats" :key="index">
        <div
          class="d-flex justify-content-around align-items-center p-11 bg-white rounded shadow-sm"
        >
          <div class="d-none d-xxl-block px-11 py-8 bg-light rounded-circle">
            <i class="display-5" :class="item.icon"></i>
          </div>
          <div class="text-center text-muted">
            <h3 class="mb-8 fs-6">{{ item.name }}</h3>
            <p>
              <span class="me-4 text-dark display-6 fw-medium">{{ item.num }}</span>
              {{ item.unit }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="row gy-16">
      <div class="col-12 col-lg-6" v-for="(chart, index) in chartSections" :key="index">
        <div class="h-100 p-16 bg-white rounded shadow-sm">
          <h2 class="title mb-11">
            <span class="titleIcon bg-secondary-subtle">
              <i :class="chart.icon"></i>
            </span>
            <span> {{ chart.title }} </span>
          </h2>
          <component :is="chart.component" v-bind="chart.props"></component>
        </div>
      </div>
      <div class="col-12 col-lg-6">
        <div class="h-100 p-16 bg-white rounded shadow-sm">
          <div class="d-flex justify-content-center align-items-end mb-11">
            <h2 class="title">
              <span class="titleIcon bg-secondary-subtle">
                <i class="bi bi-people-fill"></i>
              </span>
              <span> 最新會員 </span>
            </h2>
            <div class="d-none d-md-block ms-auto">
              <router-link to="/dashboard/members" class="link-primary text-decoration-underline">
                看更多
                <i class="bi bi-arrow-right-short"></i>
              </router-link>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table align-middle mb-0">
              <thead>
                <tr class="table-active">
                  <th class="d-none d-xxl-table-cell text-center" width="120">ID 編號</th>
                  <th class="text-center">會員</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in members.slice(0, 5)" :key="item._id">
                  <td class="d-none d-xxl-table-cell text-center">#{{ item._id.slice(-5) }}</td>
                  <td class="text-center text-xxl-start">
                    <div class="d-flex align-items-center">
                      <img
                        :src="item.avatarImgUrl"
                        class="thumbnail me-8 rounded-circle"
                        v-if="item.avatarImgUrl"
                      />
                      <div class="thumbnail me-8 rounded-circle" v-else>
                        <i class="bi bi-person-fill"></i>
                      </div>
                      <p class="flex-fill">
                        {{ item.nickName }}
                        <span class="d-block">{{ item.email }}</span>
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-6">
        <div class="h-100 p-16 bg-white rounded shadow-sm">
          <div class="d-flex justify-content-center align-items-end mb-11">
            <h2 class="title">
              <span class="titleIcon bg-secondary-subtle">
                <i class="bi bi-cookie"></i>
              </span>
              <span> 最新食譜 </span>
            </h2>
            <div class="d-none d-md-block ms-auto">
              <router-link to="/dashboard/recipes" class="link-primary text-decoration-underline">
                看更多
                <i class="bi bi-arrow-right-short"></i>
              </router-link>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table align-middle mb-0">
              <thead>
                <tr class="table-active">
                  <th class="d-none d-xxl-table-cell text-center" width="120">ID 編號</th>
                  <th class="d-none d-xxl-table-cell text-center">食譜分類</th>
                  <th class="text-center">食譜名稱</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in recipes.slice(0, 5)" :key="item._id">
                  <td class="d-none d-xxl-table-cell text-center">#{{ item._id.slice(-5) }}</td>
                  <td class="d-none d-xxl-table-cell text-center">
                    {{ getCategoryName(categories, item.category) }}
                  </td>
                  <td class="text-center text-xxl-start">
                    <div class="d-flex align-items-center">
                      <img :src="item.coverImgUrl" class="thumbnail me-8" v-if="item.coverImgUrl" />
                      <div class="thumbnail me-8" v-else>
                        <i class="bi bi-person-fill"></i>
                      </div>
                      <p class="flex-fill">
                        {{ item.title }}
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, markRaw } from 'vue';
import { apiGetMembers, apiGetRecipes, apiGetCategories, apiGetTags } from '@/scripts/api';
import { loadingStore, messageStore } from '@/stores/index';
import { getCategoryName } from '@/scripts/methods';
import PieChartComponent from '@/components/PieChart.vue';
import LineChartComponent from '@/components/LineChart.vue';
import AreaChartComponent from '@/components/AreaChart.vue';

const loadingRef = loadingStore();
const messageRef = messageStore();
const { openLoading, closeLoading } = loadingRef;
const { pushMessage } = messageRef;
const members = ref([]);
const recipes = ref([]);
const categories = ref([]);
const tags = ref([]);

const stats = ref({
  members: {
    icon: 'bi bi-people-fill',
    name: '會員人數',
    num: 0,
    unit: '人',
  },
  recipes: {
    icon: 'bi bi-cookie',
    name: '食譜數量',
    num: 0,
    unit: '篇',
  },
  categories: {
    icon: 'bi bi-columns-gap',
    name: '分類數量',
    num: 0,
    unit: '個',
  },
  tags: {
    icon: 'bi bi-bookmarks-fill',
    name: '標籤數量',
    num: 0,
    unit: '個',
  },
});

const chartSections = ref([
  {
    title: '分類比例',
    icon: 'bi bi-columns-gap',
    component: markRaw(PieChartComponent),
    props: { 'data-props': categories, recipes, type: 'category' },
  },
  {
    title: '標籤比例',
    icon: 'bi bi-bookmarks-fill',
    component: markRaw(PieChartComponent),
    props: { 'data-props': tags, recipes, type: 'tag' },
  },
  {
    title: '會員增長',
    icon: 'bi bi-people-fill',
    component: markRaw(LineChartComponent),
    props: { members },
  },
  {
    title: '食譜增長',
    icon: 'bi bi-cookie',
    component: markRaw(AreaChartComponent),
    props: { categories, recipes },
  },
]);

// 取得 會員/食譜/分類/標籤 資料
async function getData() {
  try {
    openLoading();

    const [membersResponse, recipesResponse, categoriesResponse, tagsResponse] = await Promise.all([
      apiGetMembers({ noPagination: true }), // 取得會員資料
      apiGetRecipes({ noPagination: true }), // 取得食譜資料
      apiGetCategories({ noPagination: true }), // 取得分類資料
      apiGetTags({ noPagination: true }), // 取得標籤資料
    ]);

    members.value = membersResponse.data.data;
    recipes.value = recipesResponse.data.data;
    categories.value = categoriesResponse.data.data;
    tags.value = tagsResponse.data.data;

    stats.value.members.num = members.value.length;
    stats.value.recipes.num = recipes.value.length;
    stats.value.categories.num = categories.value.length;
    stats.value.tags.num = tags.value.length;

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

onBeforeMount(() => {
  getData();
});
</script>
