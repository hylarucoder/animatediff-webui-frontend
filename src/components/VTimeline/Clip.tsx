import type { TClip } from "@/composables/timeline.ts"

export default defineComponent({
  props: {
    block: {
      type: Object as () => TClip,
      required: true,
    },
    isVirtual: Boolean,
    unitWidth: Number,
  },
  emits: ["blockSelect", "dragStart", "dragEnd", "click"],
  setup(props, { emit }) {
    const left = computed(() => Math.floor(props.block.start / 5))
    const selected = ref(false)

    const refBlock = ref<HTMLDivElement>()

    onClickOutside(refBlock, () => {
      selected.value = false
    })

    const onClickBlock = (block: TClip) => {
      selected.value = true
      if (!props.isVirtual) {
        emit("blockSelect", block)
      } else {
        emit("click")
      }
    }

    const onDragEnd = (e: DragEvent) => {
      const target = e.target as HTMLElement
      const parentElement = target.parentElement

      if (!parentElement) {
        console.error("No parent element found")
        return
      }

      const rect = parentElement.getBoundingClientRect()
      const relativeMousePosition = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }

      target.classList.add("dragend-animation")

      // Uncomment the following line if you want to remove the class after a delay
      // setTimeout(() => { target.classList.remove("dragend-animation") }, 500);

      emit("dragEnd", props.block, relativeMousePosition.x)
    }

    onMounted(() => {
      // Handle any setup that needs to occur once the component is mounted
    })

    return () => (
      <div
        ref={refBlock}
        class={{
          "timeline-track-block absolute m-0 flex h-[40px] items-center justify-center p-0 text-center": true,
          "border-[1px]": selected.value && !props.isVirtual,
        }}
        style={{
          width: `${props.unitWidth}px`,
          left: `${left.value}px`,
        }}
        draggable
        onDragstart={() => emit("dragStart", props.block.start)}
        onDragend={onDragEnd}
        onClick={() => onClickBlock(props.block)}
      >
        <div
          class={{
            "mx-[1px] h-full text-xs": true,
            "bg-amber-500": !props.isVirtual,
            "bg-amber-300": props.isVirtual,
          }}
          style={{
            height: "calc(100% - 4px)",
            width: "calc(100% - 4px)",
          }}
        >
          T
        </div>
      </div>
    )
  },
})
