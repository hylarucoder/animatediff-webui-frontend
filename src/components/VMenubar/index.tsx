import { Button, FormItem, Select, SelectOption } from "ant-design-vue"
import VModalExport from "@/components/VModalExport"

export default defineComponent({
  setup() {
    const formStore = useStoreForm()
    const { preset, project } = storeToRefs(formStore)
    const { loadPreset } = formStore
    const optionsStore = useOptionsStore()
    const { optPresets, optProjects, options } = storeToRefs(optionsStore)
    const videoExportStore = useVideoPipeline()
    const { modalVisible } = storeToRefs(videoExportStore)

    const changePresets = (value: string) => {
      const _preset = options.value.presets.find((p) => p.name === value)
      if (!_preset) {
        return
      }
      loadPreset(_preset)
    }

    console.log("preset", optPresets.value)

    return () => (
      <div class="relative flex h-[--header-height] w-full justify-between border-b-[1px] border-zinc-100 px-5">
        <div class="ant-form-item-no-mb form-item-no-feedback flex flex-1 items-center space-x-3 py-2 align-middle">
          <FormItem label="Preset">
            <Select
              options={optPresets.value}
              value={preset.value}
              showSearch
              style={{ width: "200px" }}
              onUpdate:value={(v: any) => changePresets(v)}
            >
              <SelectOption>aa</SelectOption>
            </Select>
          </FormItem>
          <FormItem label="Project">
            <Select
              value={project.value}
              showSearch
              options={optProjects.value}
              style={{ width: "200px" }}
              onUpdate:value={(value: any) => (project.value = value)}
            />
          </FormItem>
        </div>

        <div class="flex items-center justify-center space-x-3">
          {modalVisible.value && <VModalExport onCloseModal={() => videoExportStore.hideModal()} />}
          <Button onClick={() => videoExportStore.showModal()}> Export</Button>
        </div>
      </div>
    )
  },
})
