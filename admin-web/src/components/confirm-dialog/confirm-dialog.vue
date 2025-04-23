<template>
  <el-dialog v-model="show" :title="title" append-to-body>
    <div class="content-box">
      <slot></slot>
    </div>
    <el-row :gutter="5" type="flex" justify="end">
      <el-button
        v-for="(btn, idx) in innerBtnList"
        :key="idx"
        :type="btn.type as any"
        :loading="btn.loading"
        @click="btn.onClick && btn.onClick(btn, idx)"
      >
        {{ btn.text }}
      </el-button>
    </el-row>
  </el-dialog>
</template>

<script lang="ts" setup>
import { defineComponent, ref, computed, PropType } from 'vue'

defineComponent({
  name: 'ConfirmDialog',
})

type BtnType = {
  text: string
  type?: string
  loading?: boolean
  onClick?: (ele: BtnType, idx: number) => any
}

const props = defineProps({
  title: {
    type: String,
    required: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  btnList: {
    type: Array as PropType<BtnType[]>,
    required: false,
  },
  ok: {
    type: Function as PropType<(ele: BtnType) => any | Promise<any>>,
    required: false,
  },
  cancel: {
    type: Function as PropType<(ele: BtnType) => void>,
    required: false,
  },
})
const show = ref(false)

const toggle = (value?: boolean) => {
  show.value = typeof value === 'boolean' ? value : !show.value
}

const innerBtnList = computed(() => {
  return (
    props.btnList || [
      {
        text: '取消',
        onClick: (e: BtnType) => {
          props.cancel && props.cancel(e)
          toggle(false)
        },
      },
      {
        text: '确认',
        type: 'primary',
        onClick: async (e: BtnType) => {
          if (props.ok) {
            if (props.loading) {
              e.loading = true
            }
            await props.ok(e)
            if (props.loading) {
              e.loading = false
            }
          }
          toggle(false)
        },
      },
    ]
  )
})

defineExpose({
  toggle,
})
</script>

<style lang="less" scoped>
.content-box {
  min-height: 80px;
  margin: 10px 0;
}
</style>
