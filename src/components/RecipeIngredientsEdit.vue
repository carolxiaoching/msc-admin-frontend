<template>
  <VForm
    class="col-12 col-xxl-8"
    ref="form"
    v-slot="{ errors }"
    @submit="$emit('update-step', { step: 3, data: tempRecipeData })"
  >
    <div class="mb-16 p-14 p-md-16 bg-white rounded shadow-sm">
      <h2 class="title mb-11">
        <span class="titleIcon bg-secondary-subtle">
          <i class="bi bi-clipboard-data"></i>
        </span>
        <span> 營養成分 </span>
        <span class="text-danger fs-6">(必填) </span>
      </h2>
      <div class="row g-8" v-if="tempRecipeData.nutritionFacts">
        <div class="col-6 col-md-4">
          <label for="calories" class="form-label"> 總卡路里： </label>
          <VField
            type="number"
            placeholder="請輸入總卡路里"
            id="calories"
            class="form-control"
            name="總卡路里"
            :class="{
              'is-invalid': errors['總卡路里'],
            }"
            v-model="tempRecipeData.nutritionFacts.calories"
            rules="required"
            required
          />
          <ErrorMessage name="總卡路里" class="invalid-feedback" />
        </div>
        <div class="col-6 col-md-4">
          <label for="protein" class="form-label"> 蛋白質： </label>
          <VField
            type="number"
            placeholder="請輸入蛋白質"
            id="protein"
            class="form-control"
            name="蛋白質"
            :class="{
              'is-invalid': errors['蛋白質'],
            }"
            v-model="tempRecipeData.nutritionFacts.protein"
            rules="required"
            required
          />
          <ErrorMessage name="蛋白質" class="invalid-feedback" />
        </div>
        <div class="col-6 col-md-4">
          <label for="totalFat" class="form-label"> 總脂肪： </label>
          <VField
            type="number"
            placeholder="請輸入總脂肪"
            id="totalFat"
            class="form-control"
            name="總脂肪"
            :class="{
              'is-invalid': errors['總脂肪'],
            }"
            v-model="tempRecipeData.nutritionFacts.totalFat"
            rules="required"
            required
          />
          <ErrorMessage name="總脂肪" class="invalid-feedback" />
        </div>
        <div class="col-6 col-md-4">
          <label for="totalCarb" class="form-label"> 總碳水化合物： </label>
          <VField
            type="number"
            placeholder="請輸入總碳水化合物"
            id="totalCarb"
            class="form-control"
            name="總碳水化合物"
            :class="{
              'is-invalid': errors['總碳水化合物'],
            }"
            v-model="tempRecipeData.nutritionFacts.totalCarb"
            rules="required"
            required
          />
          <ErrorMessage name="總碳水化合物" class="invalid-feedback" />
        </div>
        <div class="col-6 col-md-4">
          <label for="sodium" class="form-label"> 鹽： </label>
          <VField
            type="number"
            placeholder="請輸入鹽"
            id="sodium"
            class="form-control"
            name="鹽"
            :class="{
              'is-invalid': errors['鹽'],
            }"
            v-model="tempRecipeData.nutritionFacts.sodium"
            rules="required"
            required
          />
          <ErrorMessage name="鹽" class="invalid-feedback" />
        </div>
        <div class="col-6 col-md-4">
          <label for="sugar" class="form-label"> 醣類： </label>
          <VField
            type="number"
            placeholder="請輸入醣類"
            id="sugar"
            class="form-control"
            name="醣類"
            :class="{
              'is-invalid': errors['醣類'],
            }"
            v-model="tempRecipeData.nutritionFacts.sugar"
            rules="required"
            required
          />
          <ErrorMessage name="醣類" class="invalid-feedback" />
        </div>
      </div>
    </div>

    <div class="mb-16 p-14 p-md-16 bg-white rounded shadow-sm">
      <h2 class="title mb-11">
        <span class="titleIcon bg-secondary-subtle">
          <i class="bi bi-cookie"></i>
        </span>
        <span> 食材 </span>
        <span class="text-danger fs-6">(必填) </span>
      </h2>
      <draggable
        tag="ul"
        class="mb-14 p-0 list-unstyled"
        v-model="tempRecipeData.ingredients"
        handle=".handleBtn"
        item-key="id"
        animation="200"
        ghost-class="bg-light"
      >
        <template #item="{ element, index }">
          <li class="mb-8">
            <div class="d-flex flex-wrap flex-md-nowrap">
              <VField
                type="text"
                placeholder="食材名稱"
                class="ingredientName mb-4 mb-md-0 me-md-8 order-2 form-control"
                :name="`ingredients[${index}].ingredientName`"
                :class="{
                  'is-invalid': errors[`ingredients[${index}].ingredientName`],
                }"
                v-model="element.ingredientName"
                rules="required"
                required
              />
              <VField
                type="text"
                placeholder="份量"
                class="ingredientQty mb-4 mb-md-0 me-md-8 order-3 form-control"
                :name="`ingredients[${index}].ingredientQty`"
                :class="{
                  'is-invalid': errors[`ingredients[${index}].ingredientQty`],
                }"
                v-model="element.ingredientQty"
                rules="required"
                required
              />
              <div
                class="ingredientTool d-flex justify-content-end align-items-center order-1 order-md-4"
              >
                <a
                  href="#"
                  class="link-danger fs-4 me-4"
                  @click.prevent="removeDraggableItem(index)"
                >
                  <i class="bi bi-trash"></i>
                </a>
                <a href="#" class="handleBtn link-muted fs-4">
                  <i class="bi bi-list"></i>
                </a>
              </div>
            </div>
            <p class="text-danger">
              <small
                v-if="
                  errors[`ingredients[${index}].ingredientName`] ||
                  errors[`ingredients[${index}].ingredientQty`]
                "
              >
                食材名稱與分量為必填
              </small>
            </p>
          </li>
        </template>
      </draggable>
      <div class="text-center">
        <button type="button" class="btn btn-outline-primary px-21" @click="addDraggableItem()">
          新增食材
        </button>
      </div>
    </div>

    <div class="d-flex flex-column flex-md-row align-items-center">
      <button
        type="button"
        class="btn btn-outline-primary w-100 mb-8 mb-md-0 me-md-16"
        @click.prevent="$emit('update-step', { step: 1, data: tempRecipeData })"
      >
        <i class="bi bi-arrow-90deg-left me-8"></i>
        上一步
      </button>
      <button type="submit" class="btn btn-primary w-100">下一步</button>
    </div>
  </VForm>
</template>

<script setup>
import { ref, watch } from 'vue';
import draggable from 'vuedraggable';

const tempRecipeData = ref({
  nutritionFacts: {
    calories: 0,
    protein: 0,
    totalFat: 0,
    totalCarb: 0,
    sodium: 0,
    sugar: 0,
  },
  ingredients: [
    {
      ingredientName: '',
      ingredientQty: '',
    },
  ],
});

const props = defineProps({
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
      nutritionFacts: newProps.tempRecipe.nutritionFacts,
      ingredients: newProps.tempRecipe.ingredients,
    };
  },
  { immediate: true, deep: true }
);

// 移除食材
function removeDraggableItem(index) {
  if (tempRecipeData.value.ingredients.length > 1) {
    tempRecipeData.value.ingredients.splice(index, 1);
  }
}

// 新增食材
function addDraggableItem() {
  tempRecipeData.value.ingredients.push({
    ingredientName: '',
    ingredientQty: '',
  });
}
</script>
