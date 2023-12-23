export default defineComponent({
  setup() {
    const timelineStore = useStoreTimeline()
    const { duration, refRuler, unitWidth, fps, isMouseOutside, rulerPos } = storeToRefs(timelineStore)
    const videoPlayerStore = useVideoPlayer()
    const playAxis = usePlayAxis()
    const { style, x: timeStartPx, el, isDragging } = storeToRefs(playAxis)

    const seek = useThrottleFn(() => {
      videoPlayerStore.seek(timeStartPx.value / 200)
    }, 500)

    watch([timeStartPx, isDragging], ([, isDraggingNow]) => {
      if (isDraggingNow) {
        seek()
      }
    })
    const onClickRuler = (e) => {
      console.log(e)
    }

    return () => (
      <div>
        <div ref={el} style={style.value} class="absolute z-10 h-full w-[20px]">
          <div class="absolute top-[-10px] flex h-[100px] cursor-move flex-col items-center">
            <span class="i-lucide-diamond ml-[-10px] h-6 w-6 text-red-500"></span>
            <div class="ml-[-10px] h-full w-[2px]  bg-red-500" />
          </div>
        </div>
        {!isMouseOutside.value && (
          <div style={{ left: `${rulerPos.value - 5}px` }} class="z-90 absolute h-full w-[20px]">
            <div class="pointer-events-none absolute top-[-10px] flex h-[100px] cursor-move flex-col items-center">
              <span class="i-lucide-diamond h-6 w-6 text-zinc-400"></span>
              <div class="h-full w-[2px] bg-zinc-400" />
            </div>
          </div>
        )}
        <div
          ref={refRuler}
          class="timeline min-w-screen relative h-[40px] select-none border-b-[1px] border-zinc-200"
          onClick={(e) => {
            e.preventDefault() /* Replace with your actual click handler */
          }}
        >
          {Array.from({ length: duration.value * fps.value }, (_, i) => (
            <div
              key={i}
              class="absolute z-[100]"
              style={{
                left: `${i * unitWidth.value}px`,
                width: `${unitWidth.value}px`,
              }}
            >
              {i % fps.value === 0 ? (
                <span class="text-ms block select-none font-semibold text-gray-600">{i / fps.value}s</span>
              ) : (
                <span
                  class="block select-none text-[10px] font-semibold text-gray-400"
                  style={{ width: `${unitWidth.value}px` }}
                >
                  |
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  },
})
