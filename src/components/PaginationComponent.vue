<template>
  <nav aria-label="Page navigation">
    <ul class="pagination justify-content-center mb-0">
      <li class="page-item" :class="{ disabled: !pagination.hasPrev }">
        <a
          class="page-link"
          href="#"
          aria-label="Previous"
          @click.prevent="$emit('update-page', pagination.currentPage - 1)"
          :disabled="!pagination.hasPrev"
        >
          <span>&laquo;</span>
        </a>
      </li>
      <li
        class="page-item"
        :class="{ active: n == pagination.currentPage }"
        v-for="n in pagination.totalPage"
        :key="n"
      >
        <a class="page-link" href="#" @click.prevent="$emit('update-page', n)">
          {{ n }}
        </a>
      </li>
      <li
        class="page-item"
        :class="{ disabled: !pagination.hasNext }"
        @click.prevent="$emit('update-page', pagination.currentPage + 1)"
      >
        <a class="page-link" href="#" aria-label="Next" :disabled="!pagination.hasNext">
          <span>&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
defineProps({
  pagination: Object,
});
</script>
