<template>
  <VueApexCharts
    ref="recipesChart"
    height="320"
    :options="recipesOptions"
    :series="[]"
  ></VueApexCharts>
</template>

<script setup>
import { ref, watch } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { getCategoryName, getMonthArray } from '@/scripts/methods';

const recipesChart = ref(null);
const tempCategories = ref([]);
const tempRecipes = ref([]);
const categories = getMonthArray();

const recipesOptions = ref({
  chart: {
    height: '100px',
    type: 'area',
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  dataLabels: {
    enabled: true,
  },
  tooltip: {
    enabled: false,
  },
  xaxis: {
    categories: categories.map((item) => `${item.year}/${item.month}`),
  },
});

// 處理圖表
function updateChart() {
  // 初始化 12 個月份，預設數量為 0
  const newSeries = tempCategories.value.map((category) => ({
    name: category.title,
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  }));

  tempRecipes.value.forEach((recipe) => {
    const date = new Date(recipe.createdAt);
    // 取得食譜的年份
    const memberYear = date.getFullYear();
    // 取得食譜的月份
    const memberMonth = date.getMonth() + 1;

    // 找到對應的分類名稱
    const categoryName = getCategoryName(tempCategories.value, recipe.category);

    // 找到對應分類的 index
    const categoryIndex = newSeries.findIndex((item) => item.name === categoryName);

    if (categoryIndex !== -1) {
      // 找到對應年月的 index
      const index = categories.findIndex(
        (item) => item.year === memberYear && item.month === memberMonth
      );

      // 更新對應年月的資料
      if (index !== -1) {
        newSeries[categoryIndex].data[index] += 1;
      }
    }
  });

  // 渲染畫面
  recipesChart.value.updateSeries(newSeries);
}

const props = defineProps({
  recipes: {
    type: Object,
    default() {
      return [];
    },
  },
  categories: {
    type: Object,
    default() {
      return [];
    },
  },
});

// 動態監聽 props
watch(props, (nweProps) => {
  tempCategories.value = nweProps.categories;
  tempRecipes.value = nweProps.recipes;
  updateChart();
});
</script>
