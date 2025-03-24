<template>
  <div class="col-12 col-xxl-8">
    <div class="alert alert-danger mb-16" role="alert" v-if="errorMessage">{{ errorMessage }}</div>
    <div class="table-responsive mb-16 p-14 p-md-16 bg-white rounded shadow-sm">
      <table class="table recipeTable">
        <tbody>
          <tr>
            <th scope="row" width="150" class="d-none d-sm-table-cell text-nowrap">食譜封面</th>
            <td class="text-center">
              <img
                :src="tempRecipe.coverImgUrl"
                alt=""
                class="img-thumbnail"
                style="max-width: 160px"
              />
            </td>
          </tr>
          <tr>
            <th scope="row" width="150" class="d-none d-sm-table-cell text-nowrap">食譜名稱</th>
            <td>{{ tempRecipe.title }}</td>
          </tr>
          <tr v-if="recipe._id">
            <th scope="row" width="150" class="d-none d-sm-table-cell ext-nowrap">食譜 ID</th>
            <td>{{ recipe._id }}</td>
          </tr>
          <tr>
            <th scope="row" width="150" class="d-none d-sm-table-cell text-nowrap">食譜分類</th>
            <td>
              {{ getCategoryName(categories, tempRecipe.category) }}
            </td>
          </tr>
          <tr v-if="tempRecipe.tags.length">
            <th scope="row" width="150" class="d-none d-sm-table-cell text-nowrap">食譜標籤</th>
            <td class="d-flex flex-wrap">
              <div class="me-4 fs-5" v-for="tagItem in tempRecipe.tags" :key="tagItem">
                <span class="badge text-bg-secondary">
                  {{ getTagName(tags, tagItem) }}
                </span>
              </div>
            </td>
          </tr>
          <tr>
            <th scope="row" width="150" class="d-none d-sm-table-cell text-nowrap">烹飪時間</th>
            <td>{{ tempRecipe.cookingTime }}</td>
          </tr>
          <tr>
            <th scope="row" width="150" class="d-none d-sm-table-cell text-nowrap">食譜份量</th>
            <td>{{ tempRecipe.servings }}</td>
          </tr>
          <tr>
            <th scope="row" width="150" class="d-none d-sm-table-cell text-nowrap">食譜描述</th>
            <td>{{ tempRecipe.description }}</td>
          </tr>
          <tr>
            <th scope="row" width="150" class="d-none d-sm-table-cell text-nowrap">是否開啟</th>
            <td class="text-success" v-if="tempRecipe.isPublic">開啟</td>
            <td class="text-danger" v-else>不開啟</td>
          </tr>
          <tr>
            <th scope="row" width="150" class="d-none d-sm-table-cell text-nowrap">營養成分</th>
            <td>
              <ul class="list-unstyled mb-0">
                <li>總卡路里：{{ tempRecipe.nutritionFacts.calories }}</li>
                <li>蛋白質：{{ tempRecipe.nutritionFacts.protein }}</li>
                <li>總脂肪：{{ tempRecipe.nutritionFacts.totalFat }}</li>
                <li>碳水化合物：{{ tempRecipe.nutritionFacts.totalCarb }}</li>
                <li>鹽：{{ tempRecipe.nutritionFacts.sodium }}</li>
                <li>糖：{{ tempRecipe.nutritionFacts.sugar }}</li>
              </ul>
            </td>
          </tr>
          <tr>
            <th scope="row" width="150" class="d-none d-sm-table-cell text-nowrap">食材</th>
            <td>
              <ul class="list-unstyled mb-0">
                <li v-for="(item, index) in tempRecipe.ingredients" :key="`ingredients${index}`">
                  {{ item.ingredientName }} {{ item.ingredientQty }}
                </li>
              </ul>
            </td>
          </tr>
          <tr>
            <th scope="row" width="150" class="d-none d-sm-table-cell text-nowrap">步驟</th>
            <td>
              <ul class="list-unstyled mb-0">
                <li v-for="(item, index) in tempRecipe.steps" :key="`ingredients${index}`">
                  STEP {{ item.stepOrder || index }}： {{ item.stepContent }}
                </li>
              </ul>
            </td>
          </tr>
          <tr>
            <th scope="row" width="150" class="d-none d-sm-table-cell text-nowrap">小撇步</th>
            <td>{{ tempRecipe.note || '無' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="d-flex flex-column flex-md-row align-items-center">
      <button
        type="button"
        class="btn btn-outline-primary w-100 mb-8 mb-md-0 me-md-16"
        @click.prevent="$emit('update-step', { step: 3, data: tempRecipeData })"
      >
        <i class="bi bi-arrow-90deg-left me-8"></i>
        上一步
      </button>
      <button type="button" class="btn btn-primary w-100" @click.prevent="updateRecipe">
        送出
      </button>
    </div>
  </div>

  <AlertModal ref="alertModalRef">
    <template #modal-header> {{ recipe._id ? '更新' : '新增' }}成功 </template>
    <template #modal-content>
      恭喜 {{ recipe._id ? '更新' : '新增' }}成功，將為您導入產品列表頁面
    </template>
    <template #modal-footer>
      <button type="button" class="w-50 btn btn-primary" @click="closeSuccesModal">關閉</button>
    </template>
  </AlertModal>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { loadingStore, messageStore } from '@/stores/index';
import { apiUpdateRecipe, apiCreateRecipe } from '@/scripts/api';
import { getCategoryName, getTagName } from '@/scripts/methods';
import AlertModal from '@/components/AlertModal.vue';

const router = useRouter();
const loadingRef = loadingStore();
const messageRef = messageStore();
const { openLoading, closeLoading } = loadingRef;
const { pushMessage } = messageRef;
const alertModalRef = ref(null);
const errorMessage = ref('');
const tempRecipeData = ref({});

const props = defineProps({
  recipe: {
    type: Object,
    default() {
      return {};
    },
  },
  categories: {
    type: Object,
    default() {
      return {};
    },
  },
  tags: {
    type: Object,
    default() {
      return {};
    },
  },
  tempRecipe: {
    type: Object,
    default() {
      return {};
    },
  },
});

// 動態監聽 props
watch(
  props,
  (newProps) => {
    tempRecipeData.value = newProps.tempRecipe;
  },
  { immediate: true, deep: true }
);

// 定義 'update-step' 事件，避免父組件的事件傳入 AlertModal
// 解決 Vue 警告：'Extraneous non-emits event listeners'
defineEmits(['update-step']);

// 新增/更新 食譜
async function updateRecipe() {
  props.tempRecipe.steps.forEach((item, index) => {
    item.stepOrder = index + 1;
  });

  const id = props.recipe._id;
  const apiMethods = {
    new: apiCreateRecipe,
    update: apiUpdateRecipe,
  };
  let active = 'new';
  let msg = '新增';

  if (id) {
    active = 'update';
    msg = '更新';
  }

  try {
    openLoading();
    await apiMethods[active](props.tempRecipe, id);
    alertModalRef.value?.openModal();
    closeLoading();
  } catch (err) {
    pushMessage({
      style: 'danger',
      title: `${msg}失敗`,
      text: err.response?.data?.message || `${msg}失敗，請重整網頁`,
    });
    errorMessage.value = err.response?.data?.message || `${msg}失敗，請重整網頁`;
    closeLoading();
  }
}

// 關閉 modal
function closeSuccesModal() {
  alertModalRef.value?.hideModal();
  router.push('/dashboard/recipes');
}
</script>
