import { Button, FormItem, Input } from "ant-design-vue"

export default defineComponent({
  setup() {
    return () => (
      <div class="min-h-full p-5">
        <FormItem label="Controlnet">
          <Input />
        </FormItem>
        <Button>Preview</Button>
      </div>
    )
  },
})
