<template>
  <div class="root">
    <el-card
      v-if="!result.success"
      class="card"
      v-loading="loading"
      :style="{
        height: height ? height + 'px' : null,
        width: width ? width + 'px' : null,
      }"
    >
      <div v-if="!loading" class="content">
        {{ result.msg }}
        <el-button class="retry-btn" @click="loadData">重试</el-button>
      </div>
    </el-card>
    <div v-else v-loading="outLoading">
      <slot :data="result.data" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineProps, ref, onMounted } from 'vue'

defineComponent({
  name: 'LoadComp',
})

const props = defineProps({
  loadFn: {
    type: Function,
    required: true,
  },
  afterLoad: {
    type: Function,
    required: false,
  },
  // renderFn: {
  //   type: Function,
  //   required: true,
  // },
  width: {
    type: Number,
    required: false,
  },
  height: {
    type: Number,
    default: 200,
  },
  notLoadOnMounted: {
    type: Boolean,
    required: false,
  },
  errMsgFn: {
    type: Function,
    required: false,
  },
  outLoading: {
    type: Boolean,
    required: false,
  },
})
const loading = ref(false)
const result = ref({
  success: false,
  msg: '准备加载',
  data: null,
})

const loadData = async () => {
  loading.value = true
  try {
    result.value.data = await props.loadFn()
    result.value.success = true
    if (props.afterLoad) {
      await props.afterLoad()
    }
  } catch (e: any) {
    console.error(e)
    result.value.success = false
    result.value.msg = props.errMsgFn ? props.errMsgFn(e) : e.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (!props.notLoadOnMounted) {
    loadData()
  }
})
</script>

<style scoped lang="less">
.root {
  position: relative;
}
.card {
  &.el-card {
    display: flex;
    :deep(.el-card__body) {
      display: flex;
      flex-grow: 1;
    }
  }
}
.content {
  flex-flow: column;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
}
.retry-btn {
  margin: 5px;
}
</style>
