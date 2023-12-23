import { Button, Form, FormItem, InputNumber, Modal, Progress, Radio, RadioGroup } from "ant-design-vue"
import VProgressMini from "./VProgressMini"

export default defineComponent({
  emits: ["closeModal"],
  setup(props, { emit }) {
    const storeVideoExport = useVideoPipeline()
    const { task, isActive } = storeToRefs(storeVideoExport)
    const optionsStore = useOptionsStore()
    const { optPerformances } = optionsStore
    const formStore = useStoreForm()
    const { sizeOpts, size, duration, performance } = storeToRefs(formStore)

    const handleCloseModal = () => {
      emit("closeModal")
      // storeVideoExport.cancelExport()
    }
    const handleInterruputModal = () => {
      storeVideoExport.cancelExport()
    }
    const status = computed(() => {
      if (task.value.status == "ERROR") {
        return "error"
      }
      return task.value.completed >= 100 ? "success" : "active"
    })
    watch(status, (value, oldValue) => {
      if (value == "success" && oldValue == "active") {
      }
    })
    const refBtn = ref<HTMLElement | null>(null)
    const isHovered = useElementHover(refBtn)
    const lastTask = computed(() => {
      if (task.value.subtasks.length == 0) {
        return null
      }
      return task.value.subtasks[task.value.subtasks.length - 1]
    })

    return () => (
      <Modal centered open title="Export" onCancel={handleCloseModal} maskClosable={false}>
        {{
          default: () => (
            <div class="flex h-[400px] w-[500px] select-none">
              <div class="flex w-1/2 pr-5 pt-2">
                <div class="flex h-full w-full items-center justify-center bg-zinc-300">
                  <div class="flex-col">
                    <Progress type="circle" percent={task.value.completed} status={status.value} />
                  </div>
                </div>
              </div>
              <div class="flex w-1/2">
                <Form layout="vertical">
                  <FormItem label="Performance" required>
                    <RadioGroup value={performance.value} onUpdate:value={(val) => (performance.value = val)}>
                      {optPerformances.map((opt) => (
                        <Radio key={opt.value} value={opt.value} label={opt.label}>
                          {opt.label}
                        </Radio>
                      ))}
                    </RadioGroup>
                  </FormItem>
                  <FormItem label="Duration(s)" required>
                    <InputNumber
                      value={duration.value}
                      class="text-left"
                      onUpdate:value={(val: any) => (duration.value = val)}
                    />
                  </FormItem>
                  <FormItem label="Output Size" required>
                    <RadioGroup value={size.value} onUpdate:value={(val) => (size.value = val)}>
                      {sizeOpts.value.map((opt) => (
                        <Radio key={opt.value} value={opt.value} label={opt.label}>
                          {opt.label}
                        </Radio>
                      ))}
                    </RadioGroup>
                  </FormItem>
                </Form>
              </div>
            </div>
          ),
          footer: () => (
            <div class="flex justify-between">
              <div ref="refStatusBar" class="h-[30px] w-[230px] overflow-y-scroll px-1">
                {lastTask.value && (
                  <div key={lastTask.value.description} class="flex px-2 text-left">
                    <VProgressMini completed={lastTask.value.completed} description={lastTask.value.description} />
                  </div>
                )}
              </div>
              <div class="w-[100px]" ref={refBtn}>
                {(isHovered.value && isActive.value) || task.value.interruptProcessing ? (
                  <Button
                    loading={task.value.interruptProcessing}
                    class="w-[100px]"
                    type="primary"
                    danger
                    key="back"
                    onClick={handleInterruputModal}
                  >
                    Interrupt
                  </Button>
                ) : (
                  <Button
                    class="w-[100px]"
                    key="submit"
                    type="primary"
                    loading={isActive.value}
                    onClick={() => {
                      storeVideoExport.submitExport()
                    }}
                  >
                    Export
                  </Button>
                )}
                {/*如果没有hover, 则展示, 如果*/}
              </div>
            </div>
          ),
        }}
      </Modal>
    )
  },
})
