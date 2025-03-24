<template>
  <div
    class="modal fade"
    id="imageModal"
    tabindex="-1"
    aria-labelledby="imageModalLabel"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    ref="imageModalRef"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content overflow-hidden">
        <div class="modal-body p-0">
          <div class="p-11">
            <h1 class="modal-title title mb-8" id="imageModalLabel">
              <span class="titleIcon bg-dark-subtle">
                <i class="bi bi-pencil-fill"></i>
              </span>
              <slot name="modal-header">標題</slot>
            </h1>
            <div class="my-11 text-center">
              <slot name="modal-image">圖片</slot>
            </div>
            <slot name="modal-content">內容</slot>
          </div>

          <div class="px-11 py-8 bg-light text-center">
            <button type="button" class="w-50 btn btn-primary" data-bs-dismiss="modal">關閉</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useModal } from '@/scripts/methods';

const imageModalRef = ref(null);
const { openModal, hideModal } = useModal(imageModalRef);

defineExpose({
  openModal,
  hideModal,
});
</script>
