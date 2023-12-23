import { Tabs, TabPane } from "ant-design-vue"
import VPlayer from "@/components/VPlayer/VPlayer"

export default defineComponent({
  setup() {
    const activeKey = ref("1")

    return () => (
      <div class="w-full overflow-auto border-x-[1px] border-b-[1px] border-zinc-100">
        <Tabs
          activeKey={activeKey.value}
          onUpdate:activeKey={(v: any) => {
            activeKey.value = v
          }}
          class="tab-main relative z-10"
        >
          <TabPane key="1" tab="Player" class="relative h-full w-full">
            <VPlayer />
          </TabPane>
          <TabPane key="2" tab="Media" class="">
            {/* <VFinder */}
            {/*   id="media-finder" */}
            {/*   adapter="local" */}
            {/*   class="z-1100 h-[600px] w-full bg-white" */}
            {/*   url="http://localhost:8000/api/finder" */}
            {/* /> */}
          </TabPane>
        </Tabs>
      </div>
    )
  },
})
