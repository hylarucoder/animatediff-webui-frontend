import { Popover, Slider } from "ant-design-vue"
import VTimelineLayoutPopover from "./Toolbar/PickTracks.tsx"

export default defineComponent({
  setup() {
    // Any reactive state or computed properties would go here

    return () => (
      <div class="flex h-[--timeline-toolbar-height] w-screen items-center justify-between border-b-[1px] border-zinc-200 px-2 pb-2 pt-2">
        <Popover placement="topLeft">
          {{
            content: () => <VTimelineLayoutPopover />,
            default: () => (
              <div class="flex items-center">
                <span class="i-lucide-layout h-4 w-4 text-zinc-600" />
              </div>
            ),
          }}
        </Popover>
        <div class="flex items-center justify-center">
          <span class="i-lucide-minus h-4 w-4 text-zinc-600" />
          <Slider class="ml-2 mr-2 w-[100px]" />
          <span class="i-lucide-plus h-4 w-4 text-zinc-600" />
        </div>
      </div>
    )
  },
})
