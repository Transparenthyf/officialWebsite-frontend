<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  deleteAdminProduct,
  getAdminProducts,
  getAdminSite,
  type MediaType,
  type Product,
  type SiteConfig,
  updateAdminSite,
  uploadAdminMedia,
  upsertAdminProduct,
} from '../api'

const loading = ref(true)
const error = ref<string | null>(null)

const site = ref<SiteConfig>({
  companyName: '',
  companyIntro: '',
  contactText: '',
  contactPhone: '',
  contactEmail: '',
  contactAddress: '',
  heroImageUrl: null,
  promoVideoUrl: null,
})

const products = ref<Product[]>([])

const savingSite = ref(false)
const savingProduct = ref(false)
const toast = ref<string | null>(null)

const editor = ref<Partial<Product> & { mediaType: MediaType }>({
  title: '',
  description: '',
  coverUrl: null,
  mediaType: 'image',
  mediaUrl: null,
  sortOrder: 0,
})

const isEditing = computed(() => typeof editor.value.id === 'number')

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    site.value = await getAdminSite()
    products.value = await getAdminProducts()
  } catch (e: any) {
    error.value = e?.message ?? '加载失败'
  } finally {
    loading.value = false
  }
})

function showToast(msg: string) {
  toast.value = msg
  window.setTimeout(() => {
    if (toast.value === msg) toast.value = null
  }, 2400)
}

async function saveSite() {
  savingSite.value = true
  try {
    await updateAdminSite(site.value)
    showToast('已保存站点配置')
  } catch (e: any) {
    showToast(e?.message ?? '保存失败')
  } finally {
    savingSite.value = false
  }
}

function startNewProduct() {
  editor.value = {
    title: '',
    description: '',
    coverUrl: null,
    mediaType: 'image',
    mediaUrl: null,
    sortOrder: 0,
  }
}

function startEditProduct(p: Product) {
  editor.value = { ...p }
}

async function saveProduct() {
  if (!editor.value.title?.toString().trim()) {
    showToast('请填写产品标题')
    return
  }
  savingProduct.value = true
  try {
    const saved = await upsertAdminProduct({
      id: editor.value.id,
      title: editor.value.title!.toString(),
      description: editor.value.description?.toString() ?? '',
      coverUrl: editor.value.coverUrl ?? null,
      mediaType: editor.value.mediaType ?? 'image',
      mediaUrl: editor.value.mediaUrl ?? null,
      sortOrder: Number(editor.value.sortOrder ?? 0),
    })
    const idx = products.value.findIndex((x) => x.id === saved.id)
    if (idx >= 0) products.value[idx] = saved
    else products.value.push(saved)
    showToast('已保存产品')
    startNewProduct()
  } catch (e: any) {
    showToast(e?.message ?? '保存失败')
  } finally {
    savingProduct.value = false
  }
}

async function removeProduct(id: number) {
  if (!window.confirm('确认删除该产品吗？')) return
  try {
    await deleteAdminProduct(id)
    products.value = products.value.filter((p) => p.id !== id)
    showToast('已删除')
  } catch (e: any) {
    showToast(e?.message ?? '删除失败')
  }
}

async function uploadTo(field: 'heroImageUrl' | 'promoVideoUrl') {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = field === 'promoVideoUrl' ? 'video/*' : 'image/*'
  input.onchange = async () => {
    const file = input.files?.[0]
    if (!file) return
    try {
      const res = await uploadAdminMedia(file)
      ;(site.value as any)[field] = res.url
      showToast('上传成功（别忘了点保存）')
    } catch (e: any) {
      showToast(e?.message ?? '上传失败')
    }
  }
  input.click()
}

async function uploadToProduct(field: 'coverUrl' | 'mediaUrl') {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = field === 'mediaUrl' && editor.value.mediaType === 'video' ? 'video/*' : 'image/*'
  input.onchange = async () => {
    const file = input.files?.[0]
    if (!file) return
    try {
      const res = await uploadAdminMedia(file)
      ;(editor.value as any)[field] = res.url
      if (field === 'mediaUrl') editor.value.mediaType = res.mediaType
      showToast('上传成功（别忘了点保存产品）')
    } catch (e: any) {
      showToast(e?.message ?? '上传失败')
    }
  }
  input.click()
}

const sortedProducts = computed(() =>
  [...products.value].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
)
</script>

<template>
  <div class="wrap">
    <div class="head card">
      <div>
        <div class="kicker">管理后台</div>
        <div class="title">维护官网展示的图 / 视频 / 文案</div>
      </div>
      <div class="muted">本示例未做登录鉴权（如需可再加）</div>
    </div>

    <div v-if="loading" class="card">加载中…</div>
    <div v-else-if="error" class="card">错误：{{ error }}</div>

    <template v-else>
      <section class="grid cols">
        <div class="card">
          <div class="section-title">站点配置</div>
          <div class="grid">
            <div class="row">
              <label class="label">公司名称</label>
              <input v-model="site.companyName" class="input" placeholder="例如：XX 科技有限公司" />
            </div>
            <div class="row">
              <label class="label">公司介绍</label>
              <textarea v-model="site.companyIntro" class="textarea" placeholder="支持换行" />
            </div>

            <div class="row">
              <label class="label">首页展示图</label>
              <div class="inline">
                <input v-model="site.heroImageUrl" class="input" placeholder="或上传生成 URL" />
                <button class="btn" @click="uploadTo('heroImageUrl')">上传</button>
              </div>
            </div>

            <div class="row">
              <label class="label">宣传视频</label>
              <div class="inline">
                <input v-model="site.promoVideoUrl" class="input" placeholder="或上传生成 URL" />
                <button class="btn" @click="uploadTo('promoVideoUrl')">上传</button>
              </div>
            </div>

            <div class="row">
              <label class="label">联系说明</label>
              <textarea v-model="site.contactText" class="textarea" placeholder="例如：工作日 9:00-18:00" />
            </div>
            <div class="row">
              <label class="label">电话</label>
              <input v-model="site.contactPhone" class="input" />
            </div>
            <div class="row">
              <label class="label">邮箱</label>
              <input v-model="site.contactEmail" class="input" />
            </div>
            <div class="row">
              <label class="label">地址</label>
              <input v-model="site.contactAddress" class="input" />
            </div>

            <div class="actions">
              <button class="btn btn-primary" :disabled="savingSite" @click="saveSite">
                {{ savingSite ? '保存中…' : '保存站点配置' }}
              </button>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="section-title">产品管理</div>
          <div class="grid">
            <div class="row">
              <label class="label">标题 *</label>
              <input v-model="editor.title" class="input" placeholder="例如：产品 A" />
            </div>
            <div class="row">
              <label class="label">描述</label>
              <textarea v-model="editor.description" class="textarea" placeholder="支持换行" />
            </div>
            <div class="row">
              <label class="label">排序（越小越靠前）</label>
              <input v-model.number="editor.sortOrder" class="input" type="number" />
            </div>

            <div class="row">
              <label class="label">封面图</label>
              <div class="inline">
                <input v-model="editor.coverUrl" class="input" placeholder="或上传生成 URL" />
                <button class="btn" @click="uploadToProduct('coverUrl')">上传</button>
              </div>
            </div>

            <div class="row">
              <label class="label">媒体类型</label>
              <select v-model="editor.mediaType" class="select">
                <option value="image">图片</option>
                <option value="video">视频</option>
              </select>
            </div>
            <div class="row">
              <label class="label">媒体（图片或视频）</label>
              <div class="inline">
                <input v-model="editor.mediaUrl" class="input" placeholder="或上传生成 URL" />
                <button class="btn" @click="uploadToProduct('mediaUrl')">上传</button>
              </div>
            </div>

            <div class="actions">
              <button class="btn btn-primary" :disabled="savingProduct" @click="saveProduct">
                {{ savingProduct ? '保存中…' : isEditing ? '保存修改' : '新增产品' }}
              </button>
              <button class="btn" :disabled="savingProduct" @click="startNewProduct">清空</button>
            </div>
          </div>

          <div class="list">
            <div class="list-title">已发布产品（点击可编辑）</div>
            <div v-if="sortedProducts.length === 0" class="muted">暂无产品</div>
            <div v-for="p in sortedProducts" :key="p.id" class="list-item">
              <button class="link" @click="startEditProduct(p)">
                #{{ p.id }} · {{ p.title }} <span class="muted">（排序 {{ p.sortOrder }}）</span>
              </button>
              <button class="btn danger" @click="removeProduct(p.id)">删除</button>
            </div>
          </div>
        </div>
      </section>
    </template>

    <div v-if="toast" class="toast">{{ toast }}</div>
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
  grid-template-columns: 1fr 1fr;
  align-items: start;
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
.inline {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  align-items: center;
}
.actions {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}
.list {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
  display: grid;
  gap: 10px;
}
.list-title {
  font-weight: 900;
}
.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}
.link {
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  text-align: left;
  font-weight: 800;
  color: #0f172a;
}
.danger {
  border-color: #fecaca;
  color: #b91c1c;
}
.toast {
  position: fixed;
  right: 16px;
  bottom: 16px;
  background: rgba(15, 23, 42, 0.92);
  color: #fff;
  padding: 12px 14px;
  border-radius: 12px;
  font-size: 13px;
}
@media (max-width: 900px) {
  .cols {
    grid-template-columns: 1fr;
  }
}
</style>

