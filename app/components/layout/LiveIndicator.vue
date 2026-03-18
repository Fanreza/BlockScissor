<template>
  <div class="flex items-center gap-2">
    <div :class="['w-2 h-2 rounded-full animate-pulse', isConnected ? 'bg-green-500' : 'bg-red-500']" />
    <span class="text-xs text-muted-foreground hidden sm:inline">
      {{ isConnected ? 'Live' : 'Offline' }}
    </span>
  </div>
</template>

<script setup lang="ts">
const isConnected = ref(false)

onMounted(() => {
  // Check if WebSocket is available
  isConnected.value = typeof window !== 'undefined' && !!window.WebSocket
})
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
