import VProjectSettingPanel from "./VProjectSettingPanel.tsx" // Assumed import
import VPromptPanel from "./VPromptPanel.tsx"

export default defineComponent({
  setup() {
    const layout = useStoreLayout()
    const activeClip = useActiveClip()
    const { block } = storeToRefs(activeClip)
    const { projectSetting } = storeToRefs(layout)

    return () => (
      <div class="relative w-[400px] overflow-auto border-b-[1px] border-r-[1px] border-zinc-100 px-5">
        {projectSetting.value && <VProjectSettingPanel />}
        {block.value && <VPromptPanel class="absolute left-0 top-0 z-10 bg-white" />}
      </div>
    )
  },
})
