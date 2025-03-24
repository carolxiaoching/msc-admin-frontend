<template>
  <div
    class="modal fade"
    id="delModal"
    tabindex="-1"
    aria-labelledby="delModalLabel"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    ref="delModalRef"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content overflow-hidden">
        <div class="modal-body p-0">
          <div class="d-flex p-11">
            <span class="titleIcon bg-danger-subtle text-danger">
              <i class="bi bi-x-lg"></i>
            </span>
            <div class="flex-fill">
              <h1 class="modal-title mb-8 h4" id="delModalLabel">
                <slot name="modal-header">標題</slot>
              </h1>
              <div class="mb-8">
                <slot name="modal-content">內容</slot>
              </div>
              <p class="text-muted">注意：刪除後無法復原</p>
            </div>
          </div>
          <div class="d-flex justify-content-end px-11 py-8 bg-light">
            <button type="button" class="btn btn-outline-primary me-8" data-bs-dismiss="modal">
              關閉
            </button>
            <button type="button" class="btn btn-outline-danger" @click="$emit('del-item', delId)">
              確定刪除
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useModal } from '@/scripts/methods';

const delModalRef = ref(null);
const { openModal, hideModal } = useModal(delModalRef);

defineExpose({
  openModal,
  hideModal,
});

defineProps({
  delId: {
    type: String,
    default: '',
  },
});
</script>
