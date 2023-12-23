import VTimelineTrack from "@/components/VTimeline/Track.tsx"
import VTimelineTracksHeader from "@/components/VTimeline/TracksHeader.tsx"

export default defineComponent({
  setup() {
    const timelineStore = useStoreTimeline()
    const { refTimeline } = storeToRefs(timelineStore)

    return () => (
      <div ref={refTimeline} class="relative w-full">
        <VTimelineTracksHeader />

        <div class="relative w-full space-y-[1px]">
          <VTimelineTrack />
          {/* The commented-out section can be converted like this:
          {optTimelines.map((timeline, index) => (
            <div key={index} class="flex h-[40px] rounded border-b-[1px] text-white">
              {timeline.blocks.map((block, key) => (
                <VTimelineBlock
                  key={key}
                  is-virtual={false}
                  unit-width={unitWidth}
                  block={block}
                />
              ))}
            </div>
          ))} */}
        </div>
      </div>
    )
  },
})
