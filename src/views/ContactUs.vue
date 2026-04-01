<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { createPublicLead, getPublicSite, type ContactLeadCreate, type SiteConfig } from '../api'

const site = ref<SiteConfig | null>(null)
const loadingSite = ref(true)

const form = ref<ContactLeadCreate>({
  name: '',
  phone: '',
  wechat: '',
  email: '',
  message: '',
})

const submitting = ref(false)
const submitError = ref<string | null>(null)
const submitOk = ref(false)

onMounted(async () => {
  try {
    site.value = await getPublicSite()
  } finally {
    loadingSite.value = false
  }
})

async function submit() {
  submitError.value = null
  submitOk.value = false
  if (!form.value.name.trim() || !form.value.phone.trim()) {
    submitError.value = '请填写姓名和手机号'
    return
  }
  submitting.value = true
  try {
    await createPublicLead({
      name: form.value.name.trim(),
      phone: form.value.phone.trim(),
      wechat: form.value.wechat?.trim() || undefined,
      email: form.value.email?.trim() || undefined,
      message: form.value.message?.trim() || undefined,
    })
    submitOk.value = true
    form.value.message = ''
  } catch (e: any) {
    submitError.value = e?.message ?? '提交失败'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="wrap">
    <div class="head card">
      <div>
        <div class="kicker">联系我们</div>
        <div class="title">留下联系方式，我们会尽快联系你</div>
      </div>
      <div v-if="loadingSite" class="muted">加载联系方式…</div>
    </div>

    <div class="grid cols">
      <section class="card">
        <div class="section-title">提交信息</div>
        <div class="grid">
          <div class="row">
            <label class="label">姓名 *</label>
            <input v-model="form.name" class="input" placeholder="请输入姓名" />
          </div>
          <div class="row">
            <label class="label">手机号 *</label>
            <input v-model="form.phone" class="input" placeholder="请输入手机号" />
          </div>
          <div class="row">
            <label class="label">微信</label>
            <input v-model="form.wechat" class="input" placeholder="可选" />
          </div>
          <div class="row">
            <label class="label">邮箱</label>
            <input v-model="form.email" class="input" placeholder="可选" />
          </div>
          <div class="row">
            <label class="label">备注</label>
            <textarea v-model="form.message" class="textarea" placeholder="需求、预算、交付时间等（可选）" />
          </div>

          <div class="actions">
            <button class="btn btn-primary" :disabled="submitting" @click="submit">
              {{ submitting ? '提交中…' : '提交' }}
            </button>
            <div v-if="submitError" class="err">{{ submitError }}</div>
            <div v-else-if="submitOk" class="ok">已提交，我们会尽快联系你。</div>
          </div>
        </div>
      </section>

      <section class="card">
        <div class="section-title">联系方式</div>
        <div class="info">
          <div class="info-row">
            <div class="info-k">电话</div>
            <div class="info-v">{{ site?.contactPhone || '（管理页填写）' }}</div>
          </div>
          <div class="info-row">
            <div class="info-k">邮箱</div>
            <div class="info-v">{{ site?.contactEmail || '（管理页填写）' }}</div>
          </div>
          <div class="info-row">
            <div class="info-k">地址</div>
            <div class="info-v">{{ site?.contactAddress || '（管理页填写）' }}</div>
          </div>
          <div class="info-row">
            <div class="info-k">说明</div>
            <div class="info-v pre">{{ site?.contactText || '（管理页填写）' }}</div>
          </div>
        </div>
      </section>
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
.cols {
  grid-template-columns: 1.1fr 0.9fr;
}
.section-title {
  font-weight: 900;
  margin-bottom: 12px;
}
.row {
  display: grid;
  gap: 6px;
}
.label {
  font-size: 12px;
  color: #475569;
  font-weight: 700;
}
.actions {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}
.err {
  color: #b91c1c;
  font-size: 13px;
}
.ok {
  color: #166534;
  font-size: 13px;
}
.info {
  display: grid;
  gap: 10px;
}
.info-row {
  display: grid;
  grid-template-columns: 90px 1fr;
  gap: 10px;
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}
.info-k {
  color: #64748b;
  font-weight: 800;
  font-size: 12px;
}
.info-v {
  color: #0f172a;
}
.pre {
  white-space: pre-wrap;
}
@media (max-width: 900px) {
  .cols {
    grid-template-columns: 1fr;
  }
}
</style>

