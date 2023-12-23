import VClip from "@/components/VTimeline/Clip.tsx"
import { TClip } from "@/composables/timeline.ts"

export default defineComponent({
  setup() {
    const timelineStore = useStoreTimeline()
    const { unitWidth, promptBlocks } = storeToRefs(timelineStore)
    const { alignBlock, addPromptBlocks, hasPromptBlocks, removePromptBlocks } = timelineStore

    const activeBlockStore = useActiveClip()
    const { block: activeBlock } = storeToRefs(activeBlockStore)

    const virtualBlockStore = useHoverClip()
    const { block: virtualBlock } = storeToRefs(virtualBlockStore)

    const refTimelineTrack = ref<HTMLElement | null>(null)

    const getAlignedStart = (x: number) => {
      return Math.floor(Math.floor(x / unitWidth.value) * unitWidth.value) * 5
    }

    const updateVirtualBlock = (x: number) => {
      const start = getAlignedStart(x)
      if (x <= 0) {
        virtualBlockStore.deleteBlock()
        return
      }
      if (hasPromptBlocks(start)) {
        virtualBlockStore.deleteBlock()
        return
      }
      virtualBlockStore.activeBlock({
        start,
        duration: 125,
        prompt: "",
      })
    }

    const { elementX, isOutside } = useMouseInElement(refTimelineTrack)

    watch([elementX, isOutside], ([x, outside]) => {
      if (!outside) {
        updateVirtualBlock(x)
      } else {
        virtualBlockStore.deleteBlock()
      }
    })

    const confirmVirtualBlock = () => {
      const start = getAlignedStart(elementX.value)
      addPromptBlocks({
        start,
        duration: 125,
        prompt: "",
      })
      virtualBlockStore.deleteBlock()
    }

    onKeyStroke("Backspace", () => {
      if (!activeBlock || activeBlockStore.focused) {
        return
      }
      if (activeBlock.value?.start) {
        removePromptBlocks(activeBlock.value?.start)
        activeBlockStore.deleteBlock()
      }
    })

    const onBlockSelect = (block: TClip) => {
      activeBlockStore.activeBlock(block)
      virtualBlockStore.deleteBlock()
    }

    const isDragging = ref(false)

    const dragStart = () => {
      isDragging.value = true
    }

    const dragEnd = (block: TClip, newStart: number) => {
      const start = Math.floor((newStart * 5) / 125) * 125
      alignBlock(block.start, start)
      isDragging.value = false
    }

    return () => (
      <div
        ref={refTimelineTrack}
        class="min-w-screen relative flex h-[--timeline-track-height] rounded border-b-[1px] border-zinc-200 text-white"
      >
        {promptBlocks.value.map((block: TClip, index) => (
          <VClip
            key={index}
            isVirtual={false}
            unitWidth={unitWidth.value}
            block={block}
            onBlockSelect={onBlockSelect}
            onDragEnd={dragEnd}
            onDragStart={dragStart}
          />
        ))}
        {virtualBlock.value && !isDragging.value && (
          <VClip
            isVirtual={true}
            unitWidth={unitWidth.value}
            block={virtualBlock.value}
            onClick={confirmVirtualBlock}
          />
        )}
      </div>
    )
  },
})
