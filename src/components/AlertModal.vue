<template>
  <div
    class="modal fade"
    id="alertModal"
    tabindex="-1"
    aria-labelledby="alertModalLabel"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    ref="alertModalRef"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content overflow-hidden">
        <div class="modal-body p-0">
          <div class="p-11 text-center">
            <h1 class="modal-title title mb-8" id="alertModalLabel">
              <span class="titleIcon bg-dark-subtle">
                <i class="bi bi-pencil-fill"></i>
              </span>
              <slot name="modal-header">標題</slot>
            </h1>
            <slot name="modal-content">內容</slot>
          </div>
          <div class="px-11 py-8 bg-light text-center">
            <slot name="modal-footer">按鈕</slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useModal } from '@/scripts/methods';

const alertModalRef = ref(null);
const { openModal, hideModal } = useModal(alertModalRef);

defineExpose({
  openModal,
  hideModal,
});
</script>
