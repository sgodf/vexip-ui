<template>
  <Row tag="header" class="header" :column-flex="{ align: 'middle' }">
    <Column flex="0">
      <Linker to="https://www.vexipui.com">
        <h1 class="index">
          <img class="index__logo" src="/vexip-ui.svg" alt="vexip-ui.svg" />
          <span class="index__title"> Vexip SFC Playground </span>
        </h1>
        <Tag class="lib-version" size="small">
          {{ libVersion }}
        </Tag>
      </Linker>
    </Column>
    <Column flex="auto"></Column>
    <Column flex="0">
      <button
        v-show="transferTo"
        class="action"
        style="margin-right: 0;"
        @click="settingActive = true"
      >
        <Icon :scale="1.3">
          <Gear></Gear>
        </Icon>
      </button>
      <Portal :to="transferTo">
        <div class="section">
          <div v-for="(meta, pkg) in repoMeta" :key="pkg" class="action">
            <span class="repo-name">
              {{ meta.name }}
            </span>
            <Select
              :value="meta.active"
              :options="meta.versions"
              transparent
              :loading="meta.loading"
              @toggle="initRepoVersions(meta)"
              @change="changeVersion(pkg, $event)"
            ></Select>
          </div>
        </div>
        <div class="section">
          <button class="action" :title="locale.theme" @click="toggleDark">
            <Icon v-if="isDarkTheme" :scale="1.3">
              <Moon></Moon>
            </Icon>
            <Icon v-else :scale="1.3">
              <Sun></Sun>
            </Icon>
          </button>
          <button class="action" :title="locale.share" @click="copyLink">
            <Icon :scale="1.3">
              <ShareNodes></ShareNodes>
            </Icon>
          </button>
          <button class="action" :title="locale.download" @click="download">
            <Icon :scale="1.3">
              <Download></Download>
            </Icon>
          </button>
          <button class="action" :title="locale.format" @click="formatCodes">
            <Icon :scale="1.3">
              <CheckDouble></CheckDouble>
            </Icon>
          </button>
          <Dropdown v-model:visible="cdnPanelVisible" class="action" trigger="click">
            <button class="action" :title="locale.cdn" style="margin-right: 0;">
              <Icon :scale="1.3">
                <Rocket></Rocket>
              </Icon>
            </button>
            <template #drop>
              <DropdownList class="cdn-panel">
                <RadioGroup v-model:value="currentCdn" vertical size="small">
                  <Radio v-for="cdn in cdnOptions" :key="cdn" :label="cdn"></Radio>
                </RadioGroup>
                <Button
                  type="primary"
                  size="small"
                  style="margin-top: 6px;"
                  @click="applyCdn"
                >
                  {{ locale.apply }}
                </Button>
              </DropdownList>
            </template>
          </Dropdown>
          <button class="action" :title="locale.reset" @click="reset">
            <Icon :scale="1.3">
              <ArrowRotateLeft></ArrowRotateLeft>
            </Icon>
          </button>
          <Linker
            class="github-link"
            title="Github"
            to="//github.com/vexip-ui/vexip-ui/tree/main/playground"
          >
            <Icon :scale="1.4">
              <GithubB></GithubB>
            </Icon>
          </Linker>
        </div>
      </Portal>
    </Column>
  </Row>
  <Drawer v-model:active="settingActive" transfer>
    <div id="setting"></div>
  </Drawer>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { Confirm, Message } from 'vexip-ui'
import {
  Gear,
  Moon,
  Sun,
  ShareNodes,
  Download,
  Rocket,
  CheckDouble,
  ArrowRotateLeft,
  GithubB
} from '@vexip-ui/icons'
import { cdnTemplates, getCdn, setCdn } from '../cdn'
import { locale } from '../locale'
import { downloadProject } from '../download/download'
import { prettierCode } from '../format'

import type { PropType } from 'vue'
import type { ReplStore } from '../store'

interface RepoMeta {
  owner: string,
  repo: string,
  name: string,
  versions: string[],
  active: string,
  loading: boolean,
  loaded: boolean
}

const props = defineProps({
  store: {
    type: Object as PropType<ReplStore>,
    required: true
  },
  versions: {
    type: Object as PropType<Record<string, string>>,
    default: () => ({})
  }
})

const isDarkTheme = ref(document.documentElement.classList.contains('dark'))
const libVersion = `Repl@${__REPL_VERSION__}`

const computedStyle = getComputedStyle(document.documentElement)
const media = computedStyle.getPropertyValue('--vxp-break-point-lg').trim()
const query = matchMedia(`only screen and ${media}`)

const transferTo = ref('')
const settingActive = ref(false)

query.addEventListener('change', () => {
  transferTo.value = query!.matches ? '' : '#setting'
  settingActive.value = !!transferTo.value && settingActive.value
})

const repoMeta: Record<string, RepoMeta> = reactive({
  'vexip-ui': {
    owner: 'vexip-ui',
    repo: 'vexip-ui',
    name: 'Vexip UI',
    versions: [props.versions['vexip-ui'] || __VERSION__],
    active: props.versions['vexip-ui'] || __VERSION__,
    loading: false,
    loaded: false
  },
  vue: {
    owner: 'vuejs',
    repo: 'core',
    name: 'Vue',
    versions: [props.versions.vue || __VUE_VERSION__],
    active: props.versions.vue || __VUE_VERSION__,
    loading: false,
    loaded: false
  }
})

const versions = computed(() => {
  const versions: Record<string, string> = {}

  for (const pkg of Object.keys(repoMeta)) {
    versions[pkg] = repoMeta[pkg].active
  }

  return versions
})

const cdnOptions = Object.keys(cdnTemplates)
const cdnPanelVisible = ref(false)
const currentCdn = ref(getCdn())

onMounted(() => {
  window.addEventListener('blur', handleWindowBlur)

  requestAnimationFrame(() => {
    transferTo.value = query!.matches ? '' : '#setting'
  })
})

async function initRepoVersions(meta: RepoMeta) {
  if (!meta.loaded) {
    meta.loading = true
    meta.versions = await fetchVersions(meta.owner, meta.repo)
    meta.loaded = true
    meta.loading = false
  }
}

async function fetchVersions(owner: string, repo: string, maxCount = 15) {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/releases?per_page=${maxCount}`
  )
  const releases = (await response.json()) as any[]
  const versions = releases
    .map(r => (/^v/.test(r.tag_name) ? r.tag_name.slice(1) : r.tag_name))
    .filter(r => !r.includes('-'))

  return versions as string[]
}

function handleWindowBlur() {
  if (document.activeElement?.tagName === 'IFRAME') {
    document.dispatchEvent(new MouseEvent('click'))
  }
}

function toggleDark() {
  const cls = document.documentElement.classList
  cls.toggle('dark')
  isDarkTheme.value = cls.contains('dark')
  localStorage.setItem('vexip-sfc-playground-prefer-dark', String(isDarkTheme.value))
}

async function copyLink() {
  await navigator.clipboard.writeText(location.href)
  Message.success({
    content: 'Sharable URL has been copied to clipboard.',
    background: !isDarkTheme.value
  })
}

async function download() {
  const result = await Confirm.open({
    content: locale.doDownload,
    confirmType: 'primary',
    confirmText: locale.download,
    cancelText: locale.cancel
  })

  if (result) {
    downloadProject(props.store)
  }
}

function reset() {
  location.href = location.origin
}

function changeVersion(pkg: string, version: string) {
  repoMeta[pkg].active = version

  props.store.setVersions(versions.value)
  history.replaceState({}, '', `${buildSearch()}${location.hash}`)
}

function applyCdn() {
  cdnPanelVisible.value = false
  setCdn(currentCdn.value)
}

function buildSearch() {
  if (Object.keys(versions.value).length) {
    return `?${Object.entries(versions.value)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')}`
  }

  return ''
}

async function formatCodes() {
  const files = props.store.state.files

  for (const file of Object.values(files)) {
    if (!file.hidden) {
      file.code = await prettierCode(file.filename, file.code)
    }
  }
}
</script>

<style lang="scss">
@use '../style.scss' as *;

.header {
  z-index: 10;
  height: var(--nav-height);
  padding: 0 1em;
  font-size: 13px;
  color: var(--vxp-content-color-base);
  background-color: var(--vxp-bg-color-base);
  border-bottom: 1px solid transparent;
  box-shadow: 0 0 4px rgba(0, 0, 0, 30%);
  transition:
    var(--vxp-transition-background),
    var(--vxp-transition-border),
    var(--vxp-transition-shadow);

  .dark & {
    --border: #383838;

    border-bottom-color: var(--vxp-border-color-base);
    box-shadow: none;
  }

  .index {
    display: inline-block;
    margin: 0;
    font-size: 1.5em;
    font-weight: 500;
    line-height: var(--nav-height);
    white-space: nowrap;
    vertical-align: middle;
    user-select: none;

    &__logo {
      position: relative;
      top: -2px;
      height: 24px;
      vertical-align: middle;
    }

    &__title {
      display: none;
      margin-left: 12px;
      color: var(--base);
      transition: var(--vxp-transition-background);

      @include query-media('sm') {
        display: inline-block;
      }
    }
  }

  .lib-version {
    margin: 4px 0 0 12px;
  }

  .section {
    display: flex;
  }

  .ssr-switch {
    margin-right: 20px;
  }

  .action,
  .github-link {
    color: var(--vxp-content-color-secondary);

    &:hover,
    &:focus {
      color: var(var(--vxp-content-color-base));
    }
  }

  .action {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin-right: 10px;
    cursor: pointer;
    background-color: transparent;
    border: 0;
    outline: 0;
  }

  .repo-name {
    margin-right: 6px;
    color: var(--vxp-color-success-base);
    white-space: nowrap;
  }

  .vxp-column {
    height: 100%;
  }
}

.cdn-panel {
  display: flex;
  flex-direction: column;
  padding: 5px 16px 12px;

  .vxp-radio {
    width: 100%;
    padding: 6px 0;
    margin: 0;
  }
}

#setting {
  display: flex;
  flex-direction: column;

  .section {
    display: flex;
    justify-content: center;
    padding: 6px;
  }

  .ssr-switch {
    margin-right: 20px;
  }

  .action,
  .github-link {
    color: var(--vxp-content-color-secondary);

    &:hover,
    &:focus {
      color: var(var(--vxp-content-color-base));
    }
  }

  .action {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin-right: 10px;
    cursor: pointer;
    background-color: transparent;
    border: 0;
    outline: 0;

    &:last-child {
      margin-right: 0;
    }
  }

  .repo-name {
    margin-right: 6px;
    color: var(--vxp-color-success-base);
    white-space: nowrap;
  }
}
</style>
