<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getPublicSite, type SiteConfig } from '../api'

const loading = ref(true)
const error = ref<string | null>(null)
const site = ref<SiteConfig | null>(null)

onMounted(async () => {
  try {
    site.value = await getPublicSite()
  } catch (e: any) {
    error.value = e?.message ?? '加载失败'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="wrap">
    <div v-if="loading" class="card">加载中…</div>
    <div v-else-if="error" class="card">错误：{{ error }}</div>
    <template v-else>
      <section class="hero card">
        <div class="hero-left">
          <div class="kicker">公司介绍</div>
          <h1 class="title">{{ site?.companyName || '公司名称' }}</h1>
          <p class="desc">{{ site?.companyIntro || '在管理页填写公司介绍内容。' }}</p>
        </div>
        <div class="hero-right">
          <img
            v-if="site?.heroImageUrl"
            class="hero-img"
            :src="site.heroImageUrl"
            alt="公司展示图"
          />
          <div v-else class="hero-ph">可在管理页上传并设置首页展示图</div>
        </div>
      </section>

      <section v-if="site?.promoVideoUrl" class="card section">
        <div class="section-title">宣传视频</div>
        <video class="video" controls :src="site.promoVideoUrl" />
      </section>
    </template>
  </div>
</template>

<style scoped>
.wrap {
  display: grid;
  gap: 16px;
}
.hero {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 16px;
  align-items: center;
  padding: 22px;
}
.kicker {
  color: #0284c7;
  font-weight: 700;
  letter-spacing: 0.2px;
  font-size: 13px;
}
.title {
  margin: 6px 0 10px;
  font-size: 34px;
  line-height: 1.15;
}
.desc {
  margin: 0;
  color: #334155;
  white-space: pre-wrap;
}
.hero-img {
  width: 100%;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  object-fit: cover;
  aspect-ratio: 16/10;
}
.hero-ph {
  border-radius: 14px;
  border: 1px dashed #cbd5e1;
  background: #f8fafc;
  color: #64748b;
  padding: 18px;
  aspect-ratio: 16/10;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.section-title {
  font-weight: 800;
  margin-bottom: 10px;
}
.video {
  width: 100%;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  background: #000;
}
@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr;
  }
  .title {
    font-size: 28px;
  }
}
</style>

