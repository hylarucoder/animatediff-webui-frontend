import { CONTROLNETS } from "@/consts.ts"
import { Checkbox, CheckboxGroup, Form, FormItem } from "ant-design-vue"

export default defineComponent({
  setup() {
    const labelCol = { style: { width: "100px" } }
    const wrapperCol = { span: 14 }

    const cleanLabel = (label: string) => {
      return label.replaceAll("controlnet_", "")
    }

    const timelineStore = useStoreTimeline()
    const { timeline } = storeToRefs(timelineStore)

    return () => (
      <div class="w-[400px]">
        <Form layout="vertical" model={timeline.value} labelCol={labelCol} wrapperCol={wrapperCol}>
          <FormItem label="controlnet">
            <CheckboxGroup
              value={timeline.value.controlnet}
              onUpdate:value={(v: any) => {
                timeline.value.controlnet = v
              }}
            >
              {CONTROLNETS.map((cn) => (
                <Checkbox value={cn} name="controlnet">
                  {cleanLabel(cn)}
                </Checkbox>
              ))}
            </CheckboxGroup>
          </FormItem>
          <FormItem label="ip-adapter">
            <CheckboxGroup
              onUpdate:value={(v: any) => {
                timeline.value.ipAdapter = v
              }}
              value={timeline.value.ipAdapter}
            >
              <Checkbox value="ipadapter" name="type">
                IPAdapter
              </Checkbox>
            </CheckboxGroup>
          </FormItem>
        </Form>
      </div>
    )
  },
})
