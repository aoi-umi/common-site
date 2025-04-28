<template>
  <div class="root">
    <el-popover trigger="hover" :show-arrow="false" disabled>
      <template #reference>
        <el-avatar
          class="icon"
          icon="el-icon-user-filled"
          :src="user.avatarUrl"
        />
      </template>
    </el-popover>
    <span>{{ user.nickname }}</span>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { UserInfo } from '@/models/user'

defineProps({
  user: {
    type: Object as PropType<UserInfo>,
    required: true,
  },
})
</script>

<style scoped lang="less">
.root {
  display: flex;
  align-items: center;
}
.icon {
  margin-right: 10px;
  cursor: pointer;
}
.info {
  display: flex;
  flex-direction: column;
}
</style>
