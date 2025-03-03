### 预设类型

```ts
type ImageObjectFit = 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
type ImageSkeletonProps = Pick<
  SkeletonProps,
  'tag' | 'activated' | 'iconScale' | 'imageIcon'
> & {
  class?: ClassType,
  StyleType?: StyleType
}
```

### Image 属性

| 名称            | 类型                            | 说明                                           | 默认值    | 始于 |
| --------------- | ------------------------------- | ---------------------------------------------- | --------- | ---- |
| src             | `string`                        | 图片源                                         | `''`      | -    |
| fallback-src    | `string`                        | 图片源加载失败时的回退源                       | `''`      | -    |
| alt             | `string`                        | 图片描述                                       | `''`      | -    |
| fit             | `ImageObjectFit`                | 设置图片如何填充，同 `CSS` 的 `object-fit`     | `'cover'` | -    |
| width           | `string \| number`              | 图片的宽度                                     | `''`      | -    |
| height          | `string \| number`              | 图片的高度                                     | `''`      | -    |
| img-attrs       | `Record<string, any>`           | 设置内部 `<img>` 的属性                        | `{}`      | -    |
| lazy            | `string`                        | 是否开启懒加载                                 | `false`   | -    |
| root            | `unknown`                       | 同 `IntersectionObserver` 的 `root` 选项       | `null`    | -    |
| root-margin     | `string`                        | 同 `IntersectionObserver` 的 `rootMargin` 选项 | `''`      | -    |
| preview         | `boolean`                       | 是否可预览                                     | `false`   | -    |
| skeleton        | `boolean \| ImageSkeletonProps` | 加载时是否填充骨架                             | `false`   | -    |
| placeholder     | `string`                        | 加载时的占位内容                               | `''`      | -    |
| error-tip       | `string`                        | 加载错误时的提示内容                           | `''`      | -    |
| radius          | `number`                        | 设置图片的圆角半径                             | `0`       | -    |
| border          | `boolean \| string`             | 是否有边框，支持传入一个颜色值指定边框颜色     | `false`   | -    |
| preview-src     | `string`                        | 图片的预览源                                   | `''`      | -    |
| viewer-transfer | `boolean \| string`             | 设置查看器的 `transfer` 属性                   | `false`   | -    |

### Image 事件

| 名称    | 说明                             | 参数             | 始于 |
| ------- | -------------------------------- | ---------------- | ---- |
| load    | 图片加载完成时触发，返回事件对象 | `(event: Event)` | -    |
| error   | 图片加载失败时触发，返回事件对象 | `(event: Event)` | -    |
| preview | 预览图片时触发，返回使用的预览源 | `(src: string)`  | -    |

### Image 插槽

| 名称        | 说明                       | 参数              | 始于 |
| ----------- | -------------------------- | ----------------- | ---- |
| placeholder | 图片加载时的占位内容的插槽 | -                 | -    |
| error       | 图片加载错误时的内容插槽   | -                 | -    |
| preview     | 图片预览时显示的内容插槽   | `{ src: string }` | -    |

### ImageGroup 属性

| 名称            | 类型                | 说明                         | 默认值  | 始于 |
| --------------- | ------------------- | ---------------------------- | ------- | ---- |
| show-all        | `boolean`           | 是否显示所有的图片           | `false` | -    |
| preview         | `boolean`           | 是否可预览                   | `false` | -    |
| viewer-transfer | `boolean \| string` | 设置查看器的 `transfer` 属性 | `false` | -    |

### ImageGroup 事件

| 名称    | 说明                                         | 参数                               | 始于 |
| ------- | -------------------------------------------- | ---------------------------------- | ---- |
| preview | 预览图片时触发，返回使用的预览源和预览源列表 | `(src: string, srcList: string[])` | -    |

### ImageGroup 插槽

| 名称    | 说明                     | 参数              | 始于 |
| ------- | ------------------------ | ----------------- | ---- |
| default | 图片组的内容插槽         | -                 | -    |
| preview | 图片预览时显示的内容插槽 | `{ src: string }` | -    |

### ImageViewer 属性

| 名称     | 类型                 | 说明                                                          | 默认值  | 始于 |
| -------- | -------------------- | ------------------------------------------------------------- | ------- | ---- |
| active   | `boolean`            | 设置图片查看器是否显示，可以使用 `v-model` 双向绑定           | `false` | -    |
| index    | `number`             | 当前查看的图片的索引，可以使用 `v-model` 双向绑定             | `0`     | -    |
| srcs     | `string \| string[]` | 查看图片的源列表                                              | `''`    | -    |
| transfer | `boolean \| string`  | 设置图片查看器的渲染位置，设置为 `true` 时默认渲染至 `<body>` | `false` | -    |

### ImageViewer 事件

| 名称   | 说明                                                   | 参数                           | 始于 |
| ------ | ------------------------------------------------------ | ------------------------------ | ---- |
| toggle | 图片查看器的激活状态改变时触发，返回当前的激活状态     | `(active: boolean)`            | -    |
| change | 查看的图片发生改变时触发，返回当前查看的图片的索引和源 | `(index: number, src: string)` | -    |
| prev   | 查看上一张图片时触发，返回当前查看的图片的索引和源     | `(index: number, src: string)` | -    |
| next   | 查看下一张图片时触发，返回当前查看的图片的索引和源     | `(index: number, src: string)` | -    |
| close  | 当用关闭功能触发关闭时触发，无返回值                   | -                              | -    |
| show   | 当图片查看器打开，过渡效果结束后触发，无返回值         | -                              | -    |
| hide   | 当图片查看器关闭，过渡效果结束后触发，无返回值         | -                              | -    |

### ImageViewer 插槽

| 名称    | 说明             | 参数                    | 始于 |
| ------- | ---------------- | ----------------------- | ---- |
| default | 查看的内容插槽   | -                       | -    |
| prev    | 上一张按钮的插槽 | `{ disabled: boolean }` | -    |
| next    | 下一张按钮的插槽 | `{ disabled: boolean }` | -    |
| close   | 关闭按钮的插槽   | -                       | -    |
