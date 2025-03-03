<template>
  <div :class="className">
    <slot></slot>
    <ImageViewer
      v-if="props.preview"
      v-model:active="currentActive"
      v-model:index="currentIndex"
      :srcs="srcList"
      :transfer="props.viewerTransfer"
    >
      <template #default="{ src }">
        <slot v-if="$slots.preview" name="preview" :src="src"></slot>
      </template>
    </ImageViewer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRef, computed, provide } from 'vue'
import { ImageViewer } from '@/components/image-viewer'
import { useNameHelper, useProps, emitEvent } from '@vexip-ui/config'
import { debounceMinor } from '@vexip-ui/utils'
import { imageGroupProps } from './props'
import { GROUP_STATE } from './symbol'

import type { ImageState } from './symbol'

export default defineComponent({
  name: 'ImageGroup',
  components: {
    ImageViewer
  },
  props: imageGroupProps,
  setup(_props) {
    const nh = useNameHelper('image-group')
    const props = useProps('imageGroup', _props, {
      showAll: false,
      preview: false,
      viewerTransfer: false
    })

    const currentActive = ref(false)
    const currentIndex = ref(0)
    const imageStates = reactive(new Set<ImageState>())

    const className = computed(() => {
      return [
        nh.b(),
        nh.ns('image-vars'),
        {
          [nh.bm('preview')]: props.preview
        }
      ]
    })
    const srcList = computed(() => Array.from(imageStates).map(state => state.src))

    const refreshIndex = debounceMinor(() => {
      const total = imageStates.size

      Array.from(imageStates).forEach((item, index) => {
        item.index = index
        item.total = total
      })
    })

    provide(
      GROUP_STATE,
      reactive({
        showAll: toRef(props, 'showAll'),
        preview: toRef(props, 'preview'),
        increaseItem,
        decreaseItem,
        handlePreview
      })
    )

    function increaseItem(item: ImageState) {
      imageStates.add(item)
      refreshIndex()
    }

    function decreaseItem(item: ImageState) {
      imageStates.delete(item)
      refreshIndex()
    }

    function handlePreview(item: ImageState) {
      currentIndex.value = item.index
      currentActive.value = true

      emitEvent(props.onPreview, item.src, Array.from(srcList.value))
    }

    return {
      nh,
      props,

      currentActive,
      currentIndex,

      className,
      srcList
    }
  }
})
</script>
