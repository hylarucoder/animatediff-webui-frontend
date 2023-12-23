import type { PropType } from "vue"
import { Button, Textarea } from "ant-design-vue"
import VPromptBuilder from "@/components/VPromptBuilder"

export default defineComponent({
  props: {
    value: {
      type: String as PropType<string>,
      default: "",
    },
    autoFocus: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
  emits: ["update:value"],
  setup(props, { emit }) {
    const value = computed({
      get: () => props.value,
      set: (newValue) => emit("update:value", newValue),
    })
    const visible = ref(false)

    const inputRef = ref<HTMLElement | null>(null)

    onMounted(() => {
      if (props.autoFocus && inputRef.value) {
        inputRef.value.focus()
      }
    })

    const addWeight = (event: KeyboardEvent) => {
      const cursorPosition = (event.target as HTMLTextAreaElement).selectionStart
      const newVal = calculateWeightPrompt(value.value, cursorPosition, true)
      emit("update:value", newVal)
      const target = event.target
      if (!target) {
        return
      }
      nextTick(() => {
        target.selectionStart = cursorPosition
        target.selectionEnd = cursorPosition
      })
    }

    const subWeight = (event: KeyboardEvent) => {
      const cursorPosition = (event.target as HTMLTextAreaElement).selectionStart
      const newVal = calculateWeightPrompt(value.value, cursorPosition, false)
      emit("update:value", newVal)
      const target = event.target
      if (!target) {
        return
      }
      nextTick(() => {
        target.selectionStart = cursorPosition
        target.selectionEnd = cursorPosition
      })
    }

    const calculateWeightPrompt = (text: string, cursorPosition, isAdd) => {
      // 找到光标所在的词
      const words = text.match(/(\(.*?\)|[^,]+)/g).map((word) => word.trim())
      let cursorWordIndex = null
      let start = 0

      for (let i = 0; i < words.length; i++) {
        const word = words[i]
        if (start <= cursorPosition && cursorPosition <= start + word.length) {
          cursorWordIndex = i
          break
        }
        start += word.length + 2 // 加上一个分隔符的长度和两侧的空格
      }

      // 对光标所在的词加权、减权或移除权重
      if (cursorWordIndex !== null) {
        let word = words[cursorWordIndex]

        // 检查 word 是否具有权重
        const hasWeight = word.startsWith("(") && word.endsWith(")")
        if (hasWeight) {
          // 解析权重
          const wordBase = word.slice(1, word.lastIndexOf(":"))
          let weight = parseFloat(word.slice(word.lastIndexOf(":") + 1, -1))

          // 加权或减权
          if (isAdd && weight < 1.5) {
            weight = Math.min(weight + 0.1, 1.5)
          } else if (!isAdd && weight > 0.5) {
            weight = Math.max(weight - 0.1, 0.5)
          }

          // 更新 word
          word = `(${wordBase}:${weight.toFixed(1)})`
        } else if (isAdd) {
          // 加权
          word = `(${word}:1.1)`
        } else {
          // 减权
          word = `(${word}:0.9)`
        }

        // 将更新后的词重新插入到文本中
        words[cursorWordIndex] = word
        return words.join(", ")
      }
      return text
    }
    return () => (
      <div class="relative">
        <Textarea
          ref={inputRef}
          value={value.value}
          onUpdate:value={(v) => {
            value.value = v
          }}
          rows={4}
          onKeydown={(event) => {
            if (event.shiftKey && event.key === "ArrowUp") {
              event.preventDefault()
              addWeight(event)
            } else if (event.shiftKey && event.key === "ArrowDown") {
              event.preventDefault()
              subWeight(event)
            }
          }}
        />
        <div class="absolute bottom-1 right-1">
          <Button
            onClick={() => {
              visible.value = true
            }}
          >
            {{
              icon: <span class="i-mdi-magic h-4 w-4 text-zinc-500 hover:text-zinc-800"></span>,
            }}
          </Button>
          {visible.value && (
            <VPromptBuilder
              onClose={() => {
                visible.value = false
              }}
              onOk={(v) => {
                value.value = v
                visible.value = false
              }}
              value={value.value}
            />
          )}
        </div>
      </div>
    )
  },
})
