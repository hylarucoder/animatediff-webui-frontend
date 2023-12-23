import VTimelineToolbar from "@/components/VTimeline/Toolbar.tsx"
import VTimelineTrackLeftPanel from "@/components/VTimeline/SidePanel.tsx"
import VTimelineTracks from "@/components/VTimeline/TracksContainer.tsx"

export default defineComponent({
  setup() {
    const timeline = useStoreTimeline()

    timeline.initBlocks()
    return () => (
      <div class="relative h-[--timeline-height] w-full border-x-[1px] border-b-[1px] border-zinc-100 bg-zinc-50 p-0">
        {/* VTimeToolbar */}
        <VTimelineToolbar />
        <div class="flex w-full  overflow-scroll">
          {/* VTimelineTrackLeftPanel */}
          <VTimelineTrackLeftPanel />
          {/* VTimelineTracks */}
          <VTimelineTracks />
        </div>
      </div>
    )
  },
})
