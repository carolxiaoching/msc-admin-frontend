<template>
  <VForm
    class="col-12 col-xxl-8"
    ref="form"
    v-slot="{ errors }"
    @submit="$emit('update-step', { step: 2, data: tempRecipeData })"
  >
    <div
      class="d-flex flex-column mb-16 p-14 p-md-16 bg-white rounded shadow-sm"
      :class="{ 'border border-danger': errors['食譜封面'] }"
      tabindex="0"
    >
      <h2 class="title mb-11">
        <span class="titleIcon bg-secondary-subtle">
          <i class="bi bi-image"></i>
        </span>
        <span> 食譜封面</span>
        <span class="text-danger fs-6">(必填) </span>
      </h2>
      <VField
        type="text"
        id="coverImgUrl"
        class="d-none"
        name="食譜封面"
        v-model="tempRecipeData.coverImgUrl"
        rules="required"
        required
      />
      <ErrorMessage name="食譜封面" v-slot="{ message }">
        <p class="mb-4 text-center text-danger">{{ message }}</p>
      </ErrorMessage>
      <div class="flex-fill mx-lg-16">
        <UploadComponent
          :temp-image-url="tempRecipeData.coverImgUrl"
          imageType="photo"
          @update-image="uploadImage"
        />
      </div>
    </div>
    <div class="p-14 p-md-16 bg-white rounded shadow-sm mb-16">
      <h2 class="title mb-11">
        <span class="titleIcon bg-secondary-subtle">
          <i class="bi bi-file-earmark-text"></i>
        </span>
        <span> 基本資料 </span>
        <span class="text-danger fs-6">(必填) </span>
      </h2>
      <div class="row g-8">
        <div class="col-12">
          <label for="title" class="form-label"> 食譜標題： </label>
          <VField
            type="text"
            placeholder="食譜標題"
            id="title"
            class="form-control"
            name="食譜標題"
            :class="{
              'is-invalid': errors['食譜標題'],
            }"
            v-model="tempRecipeData.title"
            rules="required"
            required
          />
          <ErrorMessage name="食譜標題" class="invalid-feedback" />
        </div>
        <div class="col-6" v-if="recipe.user">
          <label for="userNickName" class="form-label"> 作者： </label>
          <input
            type="text"
            name="userNickName"
            id="userNickName"
            class="form-control"
            :value="recipe.user?.nickName"
            disabled
          />
        </div>
        <div :class="[recipe.user ? 'col-6' : 'col-12']">
          <label for="category" class="form-label"> 食譜分類： </label>
          <VField
            as="select"
            name="食譜分類"
            id="category"
            class="form-select"
            :class="{ 'is-invalid': errors['食譜分類'] }"
            placeholder="請選擇食譜分類"
            rules="required"
            v-model="tempRecipeData.category"
            required
          >
            <option value="" selected disabled>請選擇食譜分類</option>
            <option
              :value="categoryItem._id"
              v-for="categoryItem in categories"
              :key="categoryItem._id"
            >
              {{ categoryItem.title }}
            </option>
          </VField>
          <ErrorMessage name="食譜分類" class="invalid-feedback" />
        </div>
        <div class="col-6">
          <label for="cookingTime" class="form-label"> 烹飪時長： </label>
          <VField
            as="select"
            name="烹飪時長"
            id="cookingTime"
            class="form-select"
            :class="{ 'is-invalid': errors['烹飪時長'] }"
            placeholder="請選擇烹飪時長"
            rules="required"
            v-model="tempRecipeData.cookingTime"
            required
          >
            <option value="" selected disabled>請選擇烹飪時長</option>
            <option value="0-15 分鐘">0-15 分鐘</option>
            <option value="15-30 分鐘">15-30 分鐘</option>
            <option value="30 分鐘以上">30-60 分鐘</option>
            <option value="60 分鐘以上">60 分鐘以上</option>
          </VField>
          <ErrorMessage name="烹飪時長" class="invalid-feedback" />
        </div>
        <div class="col-6">
          <label for="servings" class="form-label"> 烹飪份量： </label>
          <VField
            as="select"
            name="烹飪份量"
            id="servings"
            class="form-select"
            :class="{ 'is-invalid': errors['烹飪份量'] }"
            placeholder="請選擇烹飪份量"
            rules="required"
            v-model="tempRecipeData.servings"
            required
          >
            <option :value="n" v-for="n in 8" :key="`servings${n}`">{{ n }} 人份</option>
          </VField>
          <ErrorMessage name="烹飪份量" class="invalid-feedback" />
        </div>
        <div class="col-12">
          <label for="description" class="form-label"> 食譜簡介： </label>
          <VField
            as="textarea"
            type="text"
            rows="3"
            placeholder="請輸入食譜簡介"
            class="form-control"
            name="食譜簡介"
            :class="{
              'is-invalid': errors['食譜簡介'],
            }"
            v-model="tempRecipeData.description"
            rules="required"
            required
          />
          <ErrorMessage name="食譜簡介" class="invalid-feedback" />
        </div>
        <div class="col-12">
          <div class="form-group form-check ps-0">
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                role="switch"
                id="isPublic"
                v-model="tempRecipeData.isPublic"
                :true-value="true"
                :false-value="false"
              />
              <label class="form-check-label align-middle" for="isPublic">
                {{ tempRecipeData.isPublic ? '公開食譜' : '不公開食譜' }}
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="p-14 p-md-16 bg-white rounded shadow-sm mb-16"
      :class="{ 'border border-danger': errors['食譜標籤'] }"
    >
      <h2 class="title mb-11">
        <span class="titleIcon bg-secondary-subtle">
          <i class="bi bi-bookmarks-fill"></i>
        </span>
        <span> 標籤 </span>
        <span class="text-muted fs-6">(選填) </span>
      </h2>
      <div class="mx-lg-16 text-center">
        <div class="d-sm-inline-block m-2" v-for="item in tags" :key="item._id">
          <VField
            name="食譜標籤"
            type="checkbox"
            class="btn-check"
            :id="item._id"
            :value="item._id"
            v-model="tempRecipeData.tags"
            rules="maxTagArrayLength:3"
          />
          <label :for="item._id" class="btn btn-outline-primary w-100 text-nowrap">
            {{ item.title }}
          </label>
        </div>
        <ErrorMessage name="食譜標籤" v-slot="{ message }">
          <p class="mt-8 text-danger">{{ message }}</p>
        </ErrorMessage>
      </div>
    </div>

    <div class="d-flex flex-column flex-md-row align-items-center">
      <router-link
        to="/dashboard/recipes"
        class="btn btn-outline-primary w-100 mb-8 mb-md-0 me-md-16"
      >
        <i class="bi bi-arrow-90deg-left me-8"></i>
        返回食譜列表
      </router-link>
      <button type="submit" class="btn btn-primary w-100">下一步</button>
    </div>
  </VForm>
</template>

<script setup>
import { ref, watch } from 'vue';
import UploadComponent from '@/components/UploadComponent.vue';

const tempRecipeData = ref({
  title: '',
  coverImgUrl: '',
  isPublic: false,
  category: '',
  cookingTime: '',
  description: '',
  servings: 1,
  tags: [],
});

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
    tempRecipeData.value = {
      title: newProps.tempRecipe.title,
      coverImgUrl: newProps.tempRecipe.coverImgUrl,
      isPublic: newProps.tempRecipe.isPublic,
      category: newProps.tempRecipe.category,
      tags: newProps.tempRecipe.tags,
      cookingTime: newProps.tempRecipe.cookingTime,
      description: newProps.tempRecipe.description,
      servings: newProps.tempRecipe.servings,
    };
  },
  { immediate: true, deep: true }
);

// 更新圖片
function uploadImage(imageUrl) {
  tempRecipeData.value.coverImgUrl = imageUrl;
}
</script>
