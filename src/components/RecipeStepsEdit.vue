<template>
  <VForm
    class="col-12 col-xxl-8"
    ref="form"
    v-slot="{ errors }"
    @submit="$emit('update-step', { step: 4, data: tempRecipeData })"
  >
    <div class="mb-16 p-14 p-md-16 bg-white rounded shadow-sm">
      <h2 class="title mb-11">
        <span class="titleIcon bg-secondary-subtle">
          <i class="bi bi-diagram-3"></i>
        </span>
        <span> 步驟 </span>
        <span class="text-danger fs-6">(必填) </span>
      </h2>
      <draggable
        tag="ul"
        :list="tempRecipeData.steps"
        class="mb-16 p-0 list-unstyled"
        handle=".handleBtn"
        item-key="id"
        animation="200"
        ghost-class="bg-light"
      >
        <template #item="{ element, index }">
          <li class="mb-11">
            <div class="d-flex align-items-center">
              <label for="step" class="form-label mb-0 me-auto h5">STEP {{ index + 1 }}</label>
              <a
                href="#"
                class="d-block me-8 link-danger fs-4"
                v-if="element.stepOrder"
                @click.prevent="removeDraggableItem('delId', index)"
              >
                <i class="bi bi-trash"></i>
              </a>

              <a
                href="#"
                class="d-block me-8 link-danger fs-4"
                v-else
                @click.prevent="removeDraggableItem('delIndex', index)"
              >
                <i class="bi bi-trash"></i>
              </a>

              <a href="#" class="handleBtn d-block link-muted fs-4">
                <i class="bi bi-list"></i>
              </a>
            </div>

            <VField
              as="textarea"
              type="text"
              rows="3"
              placeholder="請輸入步驟內容"
              class="form-control"
              :name="`steps[${index}].stepContent`"
              :class="{
                'is-invalid': errors[`steps[${index}].stepContent`],
              }"
              v-model="element.stepContent"
              rules="required"
              required
            />
            <p class="text-danger">
              <small v-if="errors[`steps[${index}].stepContent`]"> 步驟內容為必填 </small>
            </p>
          </li>
        </template>
      </draggable>
      <div class="text-center">
        <button
          type="button"
          class="btn btn-outline-primary px-21"
          @click="addDraggableItem('steps')"
        >
          新增步驟
        </button>
      </div>
    </div>
    <div class="mb-16 p-16 bg-white rounded shadow-sm">
      <h2 class="title mb-11">
        <span class="titleIcon bg-secondary-subtle">
          <i class="bi bi-journal-text"></i>
        </span>
        <span> 小撇步 </span>
        <span class="text-muted fs-6">(選填) </span>
      </h2>
      <textarea
        name="小撇步"
        id="note"
        class="form-control"
        rows="3"
        placeholder="請輸入小撇步"
        v-model="tempRecipeData.note"
      ></textarea>
    </div>

    <div class="d-flex flex-column flex-md-row align-items-center">
      <button
        type="button"
        class="btn btn-outline-primary w-100 mb-8 mb-md-0 me-md-16"
        @click.prevent="$emit('update-step', { step: 2, data: tempRecipeData })"
      >
        <i class="bi bi-arrow-90deg-left me-8"></i>
        上一步
      </button>
      <button type="submit" class="btn btn-primary w-100">下一步</button>
    </div>

    <div class="d-flex align-items-center"></div>
  </VForm>
</template>

<script setup>
import { ref, watch } from 'vue';
import draggable from 'vuedraggable';

const tempRecipeData = ref({
  steps: [
    {
      stepContent: '',
    },
  ],
  note: '',
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
      steps: newProps.tempRecipe.steps,
      note: newProps.tempRecipe.note,
    };
  },
  { immediate: true, deep: true }
);

// 移除步驟
function removeDraggableItem(delType, delItem) {
  const { steps } = tempRecipeData.value;

  if (steps.length > 1) {
    const index =
      delType === 'delId' ? steps.findIndex((step) => step.stepOrder === delItem) : delItem;

    if (index !== -1) {
      steps.splice(index, 1);
    }
  }
}

// 新增步驟
function addDraggableItem() {
  tempRecipeData.value.steps.push({
    stepContent: '',
  });
}
</script>
