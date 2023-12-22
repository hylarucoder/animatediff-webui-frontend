import { Button, CheckableTag, Tag, Textarea } from "ant-design-vue"
import * as promptData from "@/assets/tags/zh_CN.json"

export default defineComponent({
  setup() {
    const refInput = ref<HTMLTextAreaElement | null>(null)
    const value = ref("")
    const tabKey = ref(promptData.data[0].name)
    const groupKey = ref(promptData.data[0].groups[0].name)
    const currentTab = computed(() => {
      return promptData.data.find((x) => x.name == tabKey.value)
    })
    const { locale } = useI18n({ useScope: "global" })
    const currentGroup = computed(() => {
      return currentTab.value?.groups.find((x) => x.name == groupKey.value)
    })

    function formatString(input: string) {
      if (!input) {
        return input
      }
      return (
        input
          // Replace underscores with spaces
          .replace(/_/g, " ")
          // Convert to lowercase, then capitalize the first letter of each word
          .toLowerCase()
          .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())
      )
    }

    const format = (en: string, zh_CN: string) => {
      return locale.value == "en" ? formatString(en) || zh_CN : zh_CN
    }
    const addTextAtCursor = (e: KeyboardEvent, textToInsert: string) => {
      if (!refInput.value) {
        return
      }
      const target = e.target
      if (!target) {
        return
      }
      const cursorPosition = (e.target as HTMLTextAreaElement).selectionStart
      value.value = value.value + textToInsert
      nextTick(() => {
        target.selectionStart = cursorPosition
        target.selectionEnd = cursorPosition
      })
      refInput.value.focus()
    }
    const keepFocus = (e) => {
      // 如果点击的是 textarea 之外的地方，阻止失去焦点
      if (e.target !== e.currentTarget) {
        e.preventDefault()
      }
    }

    return () => (
      <div class="mx-auto flex w-full max-w-2xl flex-col">
        <div>
          {locale.value == "en" && (
            <Button
              onClick={() => {
                locale.value = "zh_CN"
              }}
            >
              中文
            </Button>
          )}
          {locale.value == "zh_CN" && (
            <Button
              onClick={() => {
                locale.value = "en"
              }}
            >
              English
            </Button>
          )}
        </div>
        <div class="mt-5">
          <Textarea
            ref={refInput}
            value={value.value}
            onUpdate:value={(v) => {
              value.value = v
            }}
            rows={3}
            style="height: 100px"
            onBlur={(e) => {
              e.preventDefault()
            }}
          />
        </div>
        <div>
          <div class="my-5">
            {promptData.data.map((x) => {
              return (
                <CheckableTag
                  // class="ant-tag-green"
                  onUpdate:checked={(v) => {
                    tabKey.value = x.name
                    groupKey.value = x.groups[0].name
                  }}
                  checked={tabKey.value == x.name}
                  key={x.name}
                  onClick={(e) => {
                    e.preventDefault()
                  }}
                >
                  {format(x.slug, x.name)}
                </CheckableTag>
              )
            })}
          </div>
          <div class="flex flex-wrap pb-3">
            {currentTab.value?.groups.map((x) => {
              return (
                <CheckableTag
                  onUpdate:checked={(v) => {
                    groupKey.value = x.name
                  }}
                  checked={groupKey.value == x.name}
                  key={x.name}
                  onClick={(e) => {
                    e.preventDefault()
                  }}
                >
                  {format(x.slug, x.name)}
                </CheckableTag>
              )
            })}
          </div>
          <div class="flex flex-wrap">
            {Object.entries(currentGroup.value?.tags).map(([key, value]) => {
              return (
                <Tag
                  color="green"
                  onClick={(e) => {
                    e.preventDefault()
                    addTextAtCursor(e, " " + formatString(key) + ",")
                  }}
                  bordered={false}
                  class="mt-1 cursor-pointer"
                  key={key}
                >
                  {format(key, value)}
                </Tag>
              )
            })}
          </div>
        </div>
      </div>
    )
  },
})
