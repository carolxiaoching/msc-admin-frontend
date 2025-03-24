<template>
  <VueApexCharts
    ref="membersChart"
    height="320"
    :options="membersOptions"
    :series="[]"
  ></VueApexCharts>
</template>

<script setup>
import { ref, watch } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { getMonthArray } from '@/scripts/methods';

const membersChart = ref(null);
const tempMembers = ref([]);
const categories = getMonthArray();

// 圖表選項
const membersOptions = ref({
  tooltip: {
    enabled: false,
  },
  chart: {
    height: '100px',
    type: 'line',
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
  },
  stroke: {
    curve: 'smooth',
  },
  dataLabels: {
    enabled: true,
  },
  xaxis: {
    categories: categories.map((item) => `${item.year}/${item.month}`),
  },
});

// 處理圖表
function updateChart() {
  // 初始化 12 個月份，預設數量為 0
  const newSeries = {
    name: '用戶',
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  };

  tempMembers.value.forEach((member) => {
    const date = new Date(member.createdAt);
    // 取得食譜的年份
    const memberYear = date.getFullYear();
    // 取得食譜的月份
    const memberMonth = date.getMonth() + 1;

    // 檢查年月是否在範圍內
    const index = categories.findIndex(
      (item) => item.year === memberYear && item.month === memberMonth
    );

    // 更新對應年月的資料
    if (index !== -1) {
      newSeries.data[index] += 1;
    }
  });

  // 渲染畫面
  membersChart.value.updateSeries([newSeries]);
}

const props = defineProps({
  members: {
    type: Object,
    default() {
      return [];
    },
  },
});

// 動態監聽 props
watch(props, (nweProps) => {
  tempMembers.value = nweProps.members;
  updateChart();
});
</script>
