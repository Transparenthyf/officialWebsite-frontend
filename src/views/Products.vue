<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getPublicProducts, type Product } from '../api'

const loading = ref(true)
const error = ref<string | null>(null)
const products = ref<Product[]>([])

onMounted(async () => {
  try {
    products.value = await getPublicProducts()
  } catch (e: any) {
    error.value = e?.message ?? '加载失败'
  } finally {
    loading.value = false
  }
})

const sorted = computed(() =>
  [...products.value].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
)
</script>

<template>
  <div class="wrap">
    <div class="head card">
      <div>
        <div class="kicker">产品展示</div>
        <div class="title">产品图片 / 视频 / 介绍</div>
      </div>
      <div class="muted">内容来自后端，可在管理页维护</div>
    </div>

    <div v-if="loading" class="card">加载中…</div>
    <div v-else-if="error" class="card">错误：{{ error }}</div>

    <div v-else class="grid grid-3">
      <div v-for="p in sorted" :key="p.id" class="card item">
        <div class="media">
          <img v-if="p.coverUrl" :src="p.coverUrl" class="cover" alt="产品封面" />
          <div v-else class="cover ph">封面图（可在管理页上传）</div>
        </div>
        <div class="item-title">{{ p.title }}</div>
        <div class="item-desc">{{ p.description }}</div>

        <div v-if="p.mediaUrl" class="extra">
          <video v-if="p.mediaType === 'video'" class="video" controls :src="p.mediaUrl" />
          <img v-else class="img" :src="p.mediaUrl" alt="产品图片" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrap {
  display: grid;
  gap: 16px;
}
.head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}
.kicker {
  color: #0284c7;
  font-weight: 800;
  font-size: 13px;
}
.title {
  font-size: 22px;
  font-weight: 900;
}
.muted {
  color: #64748b;
  font-size: 12px;
}
.item {
  display: grid;
  gap: 10px;
}
.cover {
  width: 100%;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  object-fit: cover;
  aspect-ratio: 16/10;
}
.ph {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: #f8fafc;
  color: #64748b;
  border-style: dashed;
}
.item-title {
  font-weight: 900;
}
.item-desc {
  color: #334155;
  font-size: 13px;
  white-space: pre-wrap;
}
.extra {
  display: grid;
  gap: 8px;
}
.video,
.img {
  width: 100%;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #000;
}
</style>

