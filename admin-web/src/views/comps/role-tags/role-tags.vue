<template>
  <div>
    <el-popover
      v-for="(ele, index) in items"
      :key="index"
      trigger="hover"
      :disabled="!ele.authorityList.length"
    >
      <template #reference>
        <Tags :items="[ele]" />
      </template>
      <Tags :items="ele.authorityList" />
    </el-popover>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { Tags } from '@/components'
import { RoleDataType } from '@/views/role-mgt'

defineProps({
  items: {
    type: Array as PropType<RoleDataType[]>,
    required: true,
  },
})
</script>
