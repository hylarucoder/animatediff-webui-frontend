import { useOptionsStore } from "@/composables/options.ts"
import { useActiveClip } from "@/composables/clip.ts"
import { Button, Result, Spin } from "ant-design-vue"
import VMenubar from "@/components/VMenubar"
import VMainPlayer from "@/components/VPlayer/VMainPlayer"
import VInspector from "@/components/VInspector"
import VTimeline from "@/components/VTimeline"

export default defineComponent({
  setup() {
    const optionsStore = useOptionsStore()
    const activeBlock = useActiveClip()

    enum TLoadingEnum {
      PENDING = "PENDING",
      SUCCESS = "SUCCESS",
      FAILED = "FAILED",
    }

    const loading = ref<TLoadingEnum>(TLoadingEnum.PENDING)
    const retry = () => {
      return optionsStore
        .init()
        .then(() => {
          loading.value = TLoadingEnum.SUCCESS
        })
        .catch(() => {
          loading.value = TLoadingEnum.FAILED
        })
    }

    retry()

    const btnLoading = ref(false)
    const onClickRetry = () => {
      btnLoading.value = true
      retry().finally(() => {
        btnLoading.value = false
      })
    }

    const cleanBlock = useThrottleFn(() => {
      console.log("Clicked outside of .timetrack-block and .timetrack-block-editor")
      activeBlock.deleteBlock()
    }, 1000)

    // Click event handler
    const handleClickOutside = (event) => {
      const isClickInsideElement =
        event?.target?.closest(".timeline-track-block") || event?.target?.closest(".timeline-track-block-editor")

      if (!isClickInsideElement) {
        cleanBlock()
      }
    }

    // Add event listener
    onMounted(() => {
      document.addEventListener("click", handleClickOutside)
    })

    // Remove event listener
    onUnmounted(() => {
      document.removeEventListener("click", handleClickOutside)
    })

    return () => (
      <div class="flex h-screen w-full items-center justify-center p-0 px-0">
        {loading.value === TLoadingEnum.PENDING && <Spin tip="Loading..." size="large" />}
        {loading.value === TLoadingEnum.FAILED && (
          <Result status="error" title="Loading Failed" sub-title="Please check your network">
            {{
              extra: (
                <Button key="retry" loading={btnLoading.value} onClick={onClickRetry}>
                  Try Again
                </Button>
              ),
            }}
          </Result>
        )}

        {loading.value === TLoadingEnum.SUCCESS && (
          <div class="h-screen w-full bg-white p-0 px-0">
            <VMenubar class="border-1" />
            <div class="border-x-1 border-b-1 flex h-[--workspace-height] justify-between">
              <VMainPlayer />
              <VInspector />
            </div>
            <VTimeline />
          </div>
        )}
      </div>
    )
  },
})
