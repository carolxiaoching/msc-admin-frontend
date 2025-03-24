<template>
  <VueApexCharts ref="dataChart" height="320" :options="dataOptions" :series="[]"></VueApexCharts>
</template>

<script setup>
import { ref, watch } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

const dataChart = ref(null);
const tempData = ref([]);
const tempRecipes = ref([]);

const dataOptions = {
  chart: {
    height: '100px',
    width: '100px',
    type: 'pie',
    toolbar: {
      show: false,
    },
  },
  align: 'center',
  legend: {
    position: 'bottom',
  },
};

function countData(type) {
  // 使用 reduce 計算食譜中分類的數量： [{食譜id: 數量}]
  const dataCount = tempRecipes.value.reduce((accumulator, recipe) => {
    if (type === 'category') {
      // 計算分類數量
      if (!accumulator[recipe.category]) {
        // 若找不到則新增並賦予值 1
        accumulator[recipe.category] = 1;
      } else {
        // 找到則 +1
        accumulator[recipe.category] += 1;
      }
    } else if (type === 'tag') {
      // 計算標籤數量
      // 迴圈每個食譜裡的 tags 陣列
      recipe.tags.forEach((tag) => {
        if (!accumulator[tag]) {
          accumulator[tag] = 1;
        } else {
          accumulator[tag] += 1;
        }
      });
    }
    return accumulator;
  }, {});

  return dataCount;
}

// 更新圖表
function updateChart() {
  const dataCount = countData(props.type);

  // 取得分類名稱陣列： [分類1, 分類2, 分類3]
  const newLabels = tempData.value.map((dataItem) => {
    return dataItem.title;
  });

  // 取得食譜分類數量陣列： [分類1數量, 分類2數量, 分類3數量]
  const newSeries = tempData.value.map((dataItem) => {
    // 在 dataCount 找分類 id，如果找不到則為 0，找得到取得其值
    const num = dataCount[dataItem._id] ? dataCount[dataItem._id] || 0 : 0;
    return num;
  });

  // 渲染圖表
  dataChart.value.updateSeries(newSeries);
  dataChart.value.updateOptions({ labels: newLabels });
}

const props = defineProps({
  dataProps: {
    type: Object,
    default() {
      return [];
    },
  },
  recipes: {
    type: Object,
    default() {
      return [];
    },
  },
  type: {
    type: String,
    default: '',
  },
});

// 動態監聽 props
watch(props, (nweProps) => {
  tempData.value = nweProps.dataProps;
  tempRecipes.value = nweProps.recipes;
  updateChart();
});
</script>
