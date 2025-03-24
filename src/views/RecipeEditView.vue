<template>
  <div class="container-fluid">
    <div class="row justify-content-center">
      <ul class="d-flex justify-content-center mb-14 mb-md-18">
        <li
          class="stepProgressItem active position-relative px-14 py-8 text-center"
          :class="{ stepProgressActive: step === 1 }"
        >
          <span class="d-block">STEP 1</span>
          基本資料
          <span class="stepProgressLine d-block z-999"></span>
        </li>
        <li
          class="stepProgressItem position-relative px-14 py-8 text-center"
          :class="{ active: step > 1, stepProgressActive: step === 2 }"
        >
          <span class="d-block">STEP 2</span>
          成分與食材
          <span class="stepProgressLine d-block z-999"></span>
        </li>
        <li
          class="stepProgressItem position-relative px-14 py-8 text-center"
          :class="{ active: step > 2, stepProgressActive: step === 3 }"
        >
          <span class="d-block">STEP 3</span>
          步驟與備註
          <span class="stepProgressLine d-block z-999"></span>
        </li>
        <li
          class="stepProgressItem position-relative px-14 py-8 text-center"
          :class="{ active: step == 4, stepProgressActive: step === 4 }"
        >
          <span class="d-block">STEP 4</span>
          確認與送出
        </li>
      </ul>

      <RecipeBasicsEdit
        v-if="step == 1"
        @update-step="updateStep"
        :recipe="recipe"
        :categories="categories"
        :tags="tags"
        :temp-recipe="tempRecipe"
      />
      <RecipeIngredientsEdit v-if="step == 2" @update-step="updateStep" :temp-recipe="tempRecipe" />
      <RecipeStepsEdit v-if="step == 3" @update-step="updateStep" :temp-recipe="tempRecipe" />
      <RecipeSubmit
        v-if="step == 4"
        @update-step="updateStep"
        :recipe="recipe"
        :categories="categories"
        :tags="tags"
        :temp-recipe="tempRecipe"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import RecipeBasicsEdit from '@/components/RecipeBasicsEdit.vue';
import RecipeIngredientsEdit from '@/components/RecipeIngredientsEdit.vue';
import RecipeStepsEdit from '@/components/RecipeStepsEdit.vue';
import RecipeSubmit from '@/components/RecipeSubmit.vue';
import { useRoute, useRouter } from 'vue-router';
import { loadingStore, messageStore } from '@/stores/index';
import { apiGetRecipe, apiGetCategories, apiGetTags } from '@/scripts/api';

const router = useRouter();
const route = useRoute();
const loadingRef = loadingStore();
const messageRef = messageStore();
const { openLoading, closeLoading } = loadingRef;
const { pushMessage } = messageRef;
const step = ref(1);
const recipe = ref({});
const categories = ref({});
const tags = ref({});
const tempRecipe = ref({
  nutritionFacts: {
    calories: 0,
    protein: 0,
    totalFat: 0,
    totalCarb: 0,
    sodium: 0,
    sugar: 0,
  },
  title: '',
  coverImgUrl: '',
  isPublic: false,
  category: '',
  cookingTime: '',
  description: '',
  servings: 1,
  ingredients: [
    {
      ingredientName: '',
      ingredientQty: '',
    },
  ],
  steps: [
    {
      stepContent: '',
    },
  ],
  note: '',
  tags: [],
});

// 更新步驟
function updateStep(item) {
  Object.assign(tempRecipe.value, item.data);
  step.value = item.step;
}

// 取得食譜資料
async function getRecipe(id) {
  openLoading();

  try {
    const res = await apiGetRecipe(id);
    const { status, data } = res.data;
    if (status === 'success') {
      recipe.value = { ...data };
      tempRecipe.value = JSON.parse(JSON.stringify(data));
    } else {
      pushMessage({
        style: 'danger',
        title: '載入失敗',
        text: '載入失敗，請重整網頁',
      });
    }
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

// 取得頁面所需資料
async function getData() {
  openLoading();

  try {
    const tagsResponse = await apiGetTags({ noPagination: true });
    const categoriesResponse = await apiGetCategories({ noPagination: true });

    tags.value = tagsResponse.data.data;
    categories.value = categoriesResponse.data.data;

    const { id } = route.params;
    if (id !== 'new') {
      await getRecipe(id);
    }

    closeLoading();
  } catch (err) {
    pushMessage({
      style: 'danger',
      title: '載入失敗',
      text: err.response?.data?.message || '載入失敗，請重整網頁',
    });
    router.push('/dashboard/recipes');
    closeLoading();
  }
}

onMounted(() => {
  getData();
});
</script>
