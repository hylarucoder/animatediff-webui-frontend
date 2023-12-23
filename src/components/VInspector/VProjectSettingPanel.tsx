import { Form, FormItem, InputNumber, TabPane, Tabs } from "ant-design-vue"
import VPromptInput from "@/components/VPromptInput.tsx"
import VPreviewSelect from "@/components/VPreviewSelect.tsx"

export default defineComponent({
  setup() {
    const optionsStore = useOptionsStore()
    const { optLoras, optCheckpoints } = storeToRefs(optionsStore)
    const formStore = useStoreForm()
    const { checkpoint, prompt, negativePrompt, seed, fps, loras } = storeToRefs(formStore)

    const activeKey = ref("1")

    return () => (
      <Tabs
        activeKey={activeKey.value}
        onUpdate:activeKey={(v: any) => {
          activeKey.value = v
        }}
        class="relative z-0"
      >
        <TabPane key="1" tab="Setting" class="max-w-[500px]">
          <Form layout="vertical" class="form-compact mt-4">
            <FormItem label="Prompt">
              <VPromptInput
                v-model:value={prompt.value}
                onUpdate:value={(value) => {
                  prompt.value = value
                }}
              />
            </FormItem>
            <FormItem label="Negative Prompt">
              <VPromptInput
                value={negativePrompt.value}
                onUpdate:value={(value) => {
                  negativePrompt.value = value
                }}
              />
            </FormItem>
            <Form layout="vertical">
              <FormItem label="Checkpoint">
                <VPreviewSelect
                  value={checkpoint.value}
                  onUpdate:value={(value) => {
                    checkpoint.value = value
                  }}
                  options={optCheckpoints.value}
                />
              </FormItem>
            </Form>
            <Form layout="vertical">
              <FormItem label="LoRAs">
                {loras.value.map((opt, idx) => (
                  <div key={idx} class="mb-2 flex">
                    <VPreviewSelect
                      value={opt.name || ""}
                      onUpdate:value={(value) => {
                        opt.name = value
                      }}
                      class="w-[120px] min-w-[120px]"
                      options={optLoras.value}
                    />
                    <InputNumber
                      value={opt.weight}
                      onUpdate:value={(value: any) => {
                        opt.weight = value
                      }}
                      min={0}
                      max={2}
                      step={0.1}
                      class="ml-2"
                    />
                  </div>
                ))}
              </FormItem>
            </Form>
          </Form>
        </TabPane>
        <TabPane key="2" tab="Advanced">
          <Form layout="vertical" class="form-compact mt-4">
            <FormItem label="Seed">
              <InputNumber
                value={seed.value}
                onUpdate:value={(v: any) => {
                  seed.value = v
                }}
                step={1}
              />
            </FormItem>
            <FormItem label="FPS">
              <InputNumber
                value={fps.value}
                onUpdate:value={(v: any) => {
                  fps.value = v
                }}
                step={1}
                min={4}
                max={16}
              />
            </FormItem>
          </Form>
        </TabPane>
      </Tabs>
    )
  },
})
