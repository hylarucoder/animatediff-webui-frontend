import { Button, Popover, Radio, RadioGroup, Slider, Spin } from "ant-design-vue"
import type { PropType } from "vue"
import { formatDurationHHMMSS } from "@/utils/date.ts"

const VCameraControlItem = defineComponent({
  props: {
    value: {
      type: Number,
      required: true,
    },
    icon: {
      type: String as PropType<string>,
      required: true,
    },
    layout: {
      type: String as PropType<"left" | "right">,
      required: true,
    },
  },
  emits: ["update:value"],
  setup(props, { slots, emit }) {
    // Use `toRefs` to create a reactive reference for each prop
    const refValue = ref(props.value)
    watch(
      () => props.value,
      (v) => {
        refValue.value = v
      },
    )
    return () => (
      <div class="flex w-1/2">
        {props.layout === "left" ? (
          <>
            <div class="mr-2 flex items-center justify-center">
              <span class={[props.icon, "h-5 w-5 text-sm leading-6 text-zinc-600"]} />
            </div>
            <Slider
              style="width: 100px"
              onUpdate:value={(x) => {
                emit("update:value", x)
              }}
              value={refValue.value}
              min={0}
              max={1}
              step={0.1}
              reverse
            />
          </>
        ) : (
          <>
            <Slider
              onUpdate:value={(x) => {
                emit("update:value", x)
              }}
              style="width: 100px"
              value={refValue.value}
              min={0}
              max={1}
              step={0.1}
            />
            <div class="ml-2 flex items-center justify-center">
              <span class={[props.icon, "h-5 w-5 text-sm leading-6 text-zinc-600"]} />
            </div>
          </>
        )}
      </div>
    )
  },
})

export default defineComponent({
  setup() {
    const optionsStore = useOptionsStore()
    const { optAspectRadios } = optionsStore
    const formStore = useStoreForm()
    const { aspectRatio, cameraControl } = storeToRefs(formStore)

    const videoPlayerStore = useVideoPlayer()
    const { videoRef, waiting, src, currentTime, playing, duration } = storeToRefs(videoPlayerStore)
    const { loadVideo, play, pause, toggle } = videoPlayerStore
    const videoExportStore = useVideoPipeline()
    const { task } = storeToRefs(videoExportStore)

    const downloadUrl = () => {
      const url = src.value
      window.open(url, "_blank")
    }

    const size = computed(() => {
      const a = {
        "16:9": "768x432",
        "4:3": "768x576",
        "1:1": "600x600",
        "3:4": "576x768",
        "9:16": "432x768",
      }[aspectRatio.value].split("x")
      return {
        width: a[0],
        height: a[1],
      }
    })

    const togglePlaying = () => {
      playing.value = !playing.value
    }
    const canPlay = computed(() => {
      return src.value !== ""
    })

    return () => (
      <div class="relative flex h-full w-full flex-col overflow-hidden">
        <div class="flex items-center justify-center">
          <div v-show={task.value.status === TStatus.PENDING}>
            <div
              class="bg-amber-50"
              style={{
                width: size.value.width + "px",
                height: size.value.height + "px",
              }}
            >
              {aspectRatio}
            </div>
          </div>
          <div v-show={task.value.status === TStatus.ERROR}>error</div>
          <Spin v-show={task.value.status === TStatus.RUNNING}> generating video</Spin>
          <div v-show={task.value.status === TStatus.SUCCESS}>
            <video ref={videoRef} id="video" crossorigin="anonymous" class="max-h-[600px] w-full" />
          </div>
        </div>

        <div class="space-between absolute bottom-0 left-0 h-[--player-bar-height] w-full border-t-[1px] border-zinc-100 bg-white py-1 pl-5 pr-1">
          <div class="flex justify-between">
            <div class="flex space-x-2 font-mono text-zinc-600">
              <span class="leading-8">{formatDurationHHMMSS(currentTime.value)}</span>
              <span class="leading-8"> / </span>
              <span class="leading-8">{formatDurationHHMMSS(duration.value)}</span>
            </div>
            <div>
              <Button disabled={!canPlay.value} onClick={togglePlaying} class="flex items-center justify-center">
                {playing.value ? (
                  <span class="i-lucide-pause h-4 w-4 text-zinc-600" />
                ) : (
                  <span class="i-lucide-play h-4 w-4 text-zinc-600" />
                )}
              </Button>
            </div>
            <div class="flex space-x-2">
              <Button
                disabled={!canPlay.value}
                onClick={() => {
                  toggle()
                }}
                class="flex items-center justify-center"
              >
                <span class="i-lucide-fullscreen h-4 w-4 text-zinc-600" />
              </Button>
              <Button
                disabled={!canPlay.value}
                onClick={() => {
                  downloadUrl()
                }}
                class="flex items-center justify-center"
              >
                <span class="i-lucide-download h-4 w-4 text-zinc-600" />
              </Button>
              <Popover placement="topLeft">
                {{
                  default: () => <Button class="w-[60px] text-zinc-600">{aspectRatio.value}</Button>,
                  content: () => (
                    <div class="max-w-[180px]">
                      <h4 class="text-md mb-1 mt-0">Aspect Ratio</h4>
                      <RadioGroup
                        onUpdate:value={(v) => {
                          aspectRatio.value = v
                        }}
                        value={aspectRatio.value}
                      >
                        {optAspectRadios.map((ar) => (
                          <Radio key={ar.value} class="font-mono text-zinc-800" value={ar.value} label={ar.label}>
                            {ar.value}
                          </Radio>
                        ))}
                      </RadioGroup>
                    </div>
                  ),
                }}
              </Popover>
              <Popover placement="topLeft">
                {{
                  default: () => (
                    <Button class="flex items-center justify-center text-zinc-600">
                      <span class="i-lucide-switch-camera h-4 w-4 text-zinc-600"></span>
                    </Button>
                  ),
                  content: () => (
                    <div class="max-w-[300px]">
                      <h4 class="text-md mb-1 mt-0">Camera Control</h4>
                      <div class="mt-1 flex justify-between space-x-3">
                        <VCameraControlItem
                          value={cameraControl.value.panLeft}
                          onUpdate:value={(x) => {
                            cameraControl.value.panLeft = x
                          }}
                          layout="left"
                          icon="i-lucide-arrow-left"
                        />
                        <VCameraControlItem
                          value={cameraControl.value.panRight}
                          onUpdate:value={(x) => {
                            cameraControl.value.panRight = x
                          }}
                          layout="right"
                          icon="i-lucide-arrow-right"
                        />
                      </div>

                      <div class="flex justify-between space-x-3">
                        <VCameraControlItem
                          value={cameraControl.value.tileDown}
                          onUpdate:value={(x) => {
                            cameraControl.value.tileDown = x
                          }}
                          layout="left"
                          icon="i-lucide-arrow-down"
                        />
                        <VCameraControlItem
                          value={cameraControl.value.tileUp}
                          onUpdate:value={(x) => {
                            cameraControl.value.tileUp = x
                          }}
                          layout="right"
                          icon="i-lucide-arrow-up"
                        />
                      </div>
                      <div class="flex justify-between space-x-3">
                        <VCameraControlItem
                          value={cameraControl.value.rollingClockwise}
                          onUpdate:value={(x) => {
                            cameraControl.value.rollingClockwise = x
                          }}
                          layout="left"
                          icon="i-lucide-rotate-ccw"
                        />
                        <VCameraControlItem
                          value={cameraControl.value.rollingAnticlockwise}
                          onUpdate:value={(x) => {
                            cameraControl.value.rollingAnticlockwise = x
                          }}
                          layout="right"
                          icon="i-lucide-rotate-cw"
                        />
                      </div>
                      <div class="flex justify-between space-x-3">
                        <VCameraControlItem
                          onUpdate:value={(x) => {
                            cameraControl.value.zoomIn = x
                          }}
                          layout="left"
                          value={cameraControl.value.zoomIn}
                          icon="i-lucide-zoom-in"
                        />
                        <VCameraControlItem
                          onUpdate:value={(x) => {
                            cameraControl.value.zoomOut = x
                          }}
                          layout="right"
                          value={cameraControl.value.zoomOut}
                          icon="i-lucide-zoom-out"
                        />
                      </div>
                    </div>
                  ),
                }}
              </Popover>
            </div>
          </div>
        </div>
      </div>
    )
  },
})
