import type { TClip } from "@/composables/timeline"

export const useActiveClip = defineStore("activeClip", () => {
  const block = ref<TClip | null>(null)
  const focused = ref(false)
  const refInput = ref(null)
  const activeBlock = (_block: TClip) => {
    block.value = _block
  }
  const blur = (_block: TClip) => {
    refInput.value?.blur()
  }
  const onFocus = () => {
    focused.value = true
  }

  const onBlur = () => {
    focused.value = false
  }
  const deleteBlock = () => {
    block.value = null
  }
  const checkFocused = () => {
    console.log("checkfocus", document.activeElement, refInput.value)
    return document.activeElement === refInput.value
  }
  return {
    refInput,
    onFocus,
    onBlur,
    checkFocused,
    block,
    focused,
    blur,
    activeBlock,
    deleteBlock,
  }
})

export const useHoverClip = defineStore("hoverClip", () => {
  const block = ref<TClip | null>(null)
  const start = ref(0)
  const prompt = ref("")
  const activeBlock = (_block: TClip) => {
    block.value = _block
  }
  const deleteBlock = () => {
    block.value = null
  }
  return {
    block,
    prompt,
    start,
    activeBlock,
    deleteBlock,
  }
})
