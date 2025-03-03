import { defineComponent, ref, toRef, computed, watch, onBeforeMount } from 'vue'
import { Avatar } from '@/components/avatar'
import { Dropdown } from '@/components/dropdown'
import { DropdownList } from '@/components/dropdown-list'
import { DropdownItem } from '@/components/dropdown-item'
import { Icon } from '@/components/icon'
import { Menu } from '@/components/menu'
import { Switch } from '@/components/switch'
import { useNameHelper, useProps, useLocale, useIcons, emitEvent } from '@vexip-ui/config'
import { useMounted } from '@vexip-ui/hooks'
import { isClient } from '@vexip-ui/utils'
import { layoutHeaderProps } from './props'
import { computeSeriesColors, useLayoutState } from './helper'

import type { MenuExposed } from '@/components/menu'
import type { LayoutConfig, LayoutHeaderAction, LayoutSignType } from './symbol'

export default defineComponent({
  name: 'LayoutHeader',
  props: layoutHeaderProps,
  emits: ['update:sign-type', 'update:color', 'update:user-dropped', 'update:dark-mode'],
  setup(_props, { slots, emit, expose }) {
    const props = useProps('layout', _props, {
      locale: null,
      tag: 'header',
      logo: '',
      signName: '',
      user: {
        default: () => ({ name: '' }),
        static: true
      },
      userDropped: false,
      avatarCircle: false,
      config: () => ['nav', 'theme', 'color'] as LayoutConfig[],
      actions: () => [],
      signType: 'aside',
      colors: () => ['#339af0', '#f03e3e', '#be4bdb', '#7950f2', '#1b9e44', '#f76707'],
      color: '',
      menus: {
        default: () => [],
        static: true
      },
      menuProps: null,
      darkMode: null
    })

    const nh = useNameHelper('layout')
    const icons = useIcons()
    const locale = useLocale('layout', toRef(props, 'locale'))
    const layoutState = useLayoutState()
    const currentSignType = ref<LayoutSignType>(props.signType)
    const currentUserDropped = ref(props.userDropped)

    const menu = ref<MenuExposed>()

    const { isMounted } = useMounted()

    const rootEl = computed(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      isMounted.value
      return isClient ? document.documentElement : null
    })
    const currentColor = ref(props.color || props.colors?.[0] || getBaseColor())
    const isDark = ref(false)

    const className = computed(() => {
      return [
        nh.be('header'),
        {
          [nh.bs('vars')]: !layoutState.isLayout,
          [nh.bem('header', 'inherit')]: layoutState.isLayout || props.inherit,
          [nh.bem('header', 'away')]: !layoutState.affixMatched,
          [nh.bem('header', 'affixed')]: layoutState.affixed
        }
      ]
    })
    const userActions = computed(() => {
      if (!props.actions?.length) {
        return [
          {
            label: 'signOut',
            name: locale.value.signOut,
            icon: icons.value.signOut.icon,
            iconProps: icons.value.signOut
          }
        ] as LayoutHeaderAction[]
      }

      return props.actions
    })
    const hasLeft = computed(() => {
      return !!(props.logo || props.signName || slots.left)
    })
    const hasMenu = computed(() => {
      return !!(props.menus?.length || props.menuProps?.router)
    })

    expose({ menu, expandMenuByLabel })

    watch(
      () => props.signType,
      value => {
        currentSignType.value = value
      }
    )
    watch(
      () => props.color,
      value => {
        currentColor.value = value || props.colors?.[0] || getBaseColor()
      }
    )
    watch(
      () => props.userDropped,
      value => {
        currentUserDropped.value = value
      }
    )
    watch(currentColor, computeSeriesColors)
    watch(
      () => props.darkMode,
      value => {
        isDark.value = value ?? rootEl.value?.classList.contains('dark') ?? false
      },
      { immediate: true }
    )

    onBeforeMount(() => {
      computeSeriesColors(currentColor.value)
    })

    function getBaseColor() {
      if (rootEl.value) {
        return getComputedStyle(rootEl.value).getPropertyValue('--vxp-color-primary-base')
      }

      return '#339af0'
    }

    function handleUserActionSelect(label: string, meta: Record<string, any>) {
      emitEvent(props.onUserAction, label, meta)
    }

    function handleSignTypeChange(type: LayoutSignType) {
      const queue: Array<() => void> = [
        () => {
          layoutState.locked = true
        },
        () => {
          currentSignType.value = type

          emitEvent(props.onNavChange, type)
          emit('update:sign-type', type)
        },
        () => {
          layoutState.locked = false
        }
      ]

      const run = () => {
        queue.shift()?.()
        queue.length && requestAnimationFrame(run)
      }

      run()
    }

    function toggleReduce(target = !layoutState.reduced) {
      layoutState.reduced = target

      emitEvent(props.onReducedChange, target)
    }

    function handleColorChange(color: string) {
      currentColor.value = color

      emitEvent(props.onColorChange, color)
      emit('update:color', color)
    }

    function handleSignClick(event: MouseEvent) {
      emitEvent(props.onSignClick, event)
    }

    function toggleUserDrop(target = !currentUserDropped.value) {
      currentUserDropped.value = target

      emitEvent(props.onDropChange, target)
      emit('update:user-dropped', target)
    }

    function handleMenuSelect(label: string, meta: Record<string, any>) {
      toggleUserDrop(false)
      emitEvent(props.onMenuSelect, label, meta)
    }

    function expandMenuByLabel(label: string) {
      menu.value?.expandItemByLabel(label)
    }

    function toggleTheme(darkMode: boolean) {
      isDark.value = darkMode

      emitEvent(props.onToggleTheme, darkMode)
      emit('update:dark-mode', darkMode)

      if (!isClient) return

      requestAnimationFrame(() => {
        if (rootEl.value) {
          if (darkMode) {
            rootEl.value.classList.add('dark')
          } else {
            rootEl.value.classList.remove('dark')
          }
        }
      })
    }

    function getSlotParams() {
      return {
        reduced: layoutState.reduced,
        toggleReduce,
        handleColorChange,
        toggleUserDrop
      }
    }

    function renderCheck() {
      return <Icon {...icons.value.check}></Icon>
    }

    function renderLayoutConfig() {
      return (
        <div class={nh.be('config-unit')}>
          <div
            class={[nh.be('brief-block'), nh.bem('brief-block', 'aside')]}
            onClick={() => handleSignTypeChange('aside')}
          >
            {currentSignType.value === 'aside' && renderCheck()}
          </div>
          <div class={nh.be('brief-block')} onClick={() => handleSignTypeChange('header')}>
            {currentSignType.value === 'header' && renderCheck()}
          </div>
        </div>
      )
    }

    function renderThemeConfig() {
      return (
        <div class={nh.be('config-unit')}>
          <Switch
            value={isDark.value}
            class={[nh.be('theme-mode'), isDark.value && nh.bem('theme-mode', 'dark')]}
            aria-label={'theme'}
            onChange={toggleTheme}
          >
            {{
              icon: () =>
                isDark.value
                  ? (
                  <Icon {...icons.value.dark}></Icon>
                    )
                  : (
                  <Icon {...icons.value.light}></Icon>
                    )
            }}
          </Switch>
        </div>
      )
    }

    function renderColorConfig() {
      if (!props.colors?.length) {
        return null
      }

      return (
        <div class={nh.be('config-unit')}>
          {props.colors.map(color => (
            <div
              class={nh.be('major-color')}
              style={{
                backgroundColor: color
              }}
              onClick={() => handleColorChange(color)}
            >
              {currentColor.value === color && renderCheck()}
            </div>
          ))}
        </div>
      )
    }

    return () => {
      const CustomTag = (props.tag || 'header') as any

      return (
        <CustomTag class={className.value}>
          {hasLeft.value && (
            <div class={nh.be('header-left')}>
              {slots.left
                ? (
                    slots.left(getSlotParams())
                  )
                : props.signType === 'header'
                  ? (
                <div class={nh.be('sign')} onClick={handleSignClick}>
                  {props.logo && (
                    <div class={nh.be('logo')}>
                      <img src={props.logo} alt={'Logo'} />
                    </div>
                  )}
                  {props.signName && <span class={nh.be('sign-name')}>{props.signName}</span>}
                </div>
                    )
                  : null}
            </div>
          )}
          <div class={nh.be('header-main')}>
            {slots.default
              ? (
                  slots.default(getSlotParams())
                )
              : hasMenu.value
                ? (
              <Menu
                ref={menu}
                {...(props.menuProps || {})}
                horizontal
                transfer
                options={props.menus}
                onSelect={handleMenuSelect}
              ></Menu>
                  )
                : null}
          </div>
          {slots.right && <div class={nh.be('header-right')}>{slots.right(getSlotParams())}</div>}
          {slots.user
            ? (
                slots.user(getSlotParams())
              )
            : (
            <Dropdown
              class={nh.be('user')}
              transfer
              placement={'bottom-end'}
              visible={currentUserDropped.value}
              trigger={'custom'}
              onClickOutside={() => toggleUserDrop(false)}
            >
              {{
                default: () => {
                  if (slots.avatar) {
                    return slots.avatar(getSlotParams())
                  }

                  if (typeof props.user?.avatar === 'string') {
                    return (
                      <Avatar
                        src={props.user.avatar}
                        circle={props.avatarCircle}
                        onClick={() => toggleUserDrop()}
                      >
                        {{
                          icon: () => <Icon {...icons.value.user}></Icon>
                        }}
                      </Avatar>
                    )
                  }

                  return (
                    <Avatar circle={props.avatarCircle} onClick={() => toggleUserDrop()}>
                      {{
                        icon: () => (
                          <Icon
                            {...icons.value.user}
                            icon={props.user.avatar || icons.value.user.icon}
                          ></Icon>
                        )
                      }}
                    </Avatar>
                  )
                },
                drop: () => (
                  <DropdownList>
                    {props.user?.name && (
                      <li class={nh.be('user-profile')}>
                        <span class={nh.be('user-name')}>{props.user.name}</span>
                        {props.user.email && (
                          <span class={nh.be('user-email')}>{props.user.email}</span>
                        )}
                      </li>
                    )}
                    {props.config?.length
                      ? (
                      <li class={nh.be('config')}>
                        {props.config.includes('nav') &&
                          layoutState.navConfig && [
                            <div class={nh.be('config-label')}>{locale.value.signType}</div>,
                            renderLayoutConfig()
                        ]}
                        {props.config.includes('theme') && [
                          <div class={nh.be('config-label')}>{locale.value.themeMode}</div>,
                          renderThemeConfig()
                        ]}
                        {props.config.includes('color') && [
                          <div class={nh.be('config-label')}>{locale.value.majorColor}</div>,
                          renderColorConfig()
                        ]}
                      </li>
                        )
                      : null}
                    {userActions.value.map(action => (
                      <DropdownItem
                        class={nh.be('user-action')}
                        label={action.label}
                        disabled={action.disabled}
                        divided={action.divided}
                        onSelect={() => handleUserActionSelect(action.label, action.meta || {})}
                      >
                        {action.icon && (
                          <Icon
                            {...action.iconProps}
                            icon={action.icon}
                            style={{ marginRight: '6px' }}
                          ></Icon>
                        )}
                        {action.name || action.label}
                      </DropdownItem>
                    ))}
                  </DropdownList>
                )
              }}
            </Dropdown>
              )}
        </CustomTag>
      )
    }
  }
})
