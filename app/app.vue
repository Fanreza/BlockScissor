<template>
  <div class="min-h-screen bg-background text-foreground flex flex-col">
    <AppHeader />
    <main class="max-w-5xl mx-auto px-4 py-6 flex-1 w-full">
      <NuxtPage />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '~/components/layout/AppHeader.vue'
import AppFooter from '~/components/layout/AppFooter.vue'
</script>
