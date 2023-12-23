import { formatProxyMedia, getTaskStatus, interruptTask, submitTask } from "@/client"
import { message } from "ant-design-vue"

export enum TStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  LOADING = "LOADING",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}

type TSubtask = {
  status: TStatus
  description: string
  completed: number
  total: number
}

type TOverallPipeline = {
  pid: number
  status: TStatus
  completed: number
  total: number
  videoPath: string
  interruptProcessing: boolean
  processingInterrupted: boolean
  subtasks: TSubtask[]
}

const defaultTask: TOverallPipeline = {
  pid: 0,
  status: TStatus.PENDING,
  completed: 0,
  total: 100,
  videoPath: "",
  subtasks: [],
  interruptProcessing: false,
  processingInterrupted: true,
}

export const useVideoPipeline = defineStore("videoPipeline", () => {
  const modalVisible = ref(false)
  const formStore = useStoreForm()
  const timelineStore = useStoreTimeline()
  const { promptBlocks } = timelineStore
  const videoPlayerStore = useVideoPlayer()
  const pipeline = ref<TOverallPipeline>(defaultTask)
  const showModal = () => {
    modalVisible.value = true
  }
  const hideModal = () => {
    modalVisible.value = false
  }

  const { pause, resume, isActive } = useIntervalFn(async () => {
    try {
      const res = (await getTaskStatus({
        pid: pipeline.value.pid,
      })) as TOverallPipeline
      console.log("resssw", res)
      if (!res?.pid) {
        console.log("error no pid", res)
        pipeline.value.status = TStatus.ERROR
        pause()
        return
      }
      pipeline.value.pid = res.pid
      pipeline.value.status = res.status
      pipeline.value.completed = res.completed
      pipeline.value.total = res.total
      pipeline.value.subtasks = res.subtasks.filter((x) => x.completed > 0)
      pipeline.value.interruptProcessing = res.interruptProcessing
      pipeline.value.processingInterrupted = res.processingInterrupted
      if (res.status == "ERROR") {
        console.log("status error pause", res.status)
        pause()
        return
      }

      if (!res?.videoPath) {
        return
      }
      pipeline.value.videoPath = res.videoPath
      videoPlayerStore.loadVideo(formatProxyMedia(res.videoPath))
      hideModal()
      // player.reloadVideo()
      pause()
    } catch (e) {}
  }, 2000)
  onMounted(() => pause())

  const submitExport = async () => {
    pipeline.value.pid = 0
    pipeline.value.status = TStatus.PENDING
    pipeline.value.completed = 0
    pipeline.value.total = 100
    pipeline.value.videoPath = ""

    const data = {
      project: formStore.project,
      performance: formStore.performance,
      aspectRatio: formStore.aspectRatio,
      prompt: formStore.prompt,
      negativePrompt: formStore.negativePrompt,
      checkpoint: formStore.checkpoint,
      loras: formStore.loras,
      motion: formStore.motion,
      cameraControl: formStore.cameraControl,
      highRes: formStore.highRes,
      fps: formStore.fps,
      duration: formStore.duration,
      seed: formStore.seed,
      promptBlocks: promptBlocks.map((x) => {
        return {
          start: x.start,
          prompt: x.prompt,
        }
      }),
    }
    try {
      const res = await submitTask(data)
      pipeline.value.pid = res.pipeline.pid
      resume()
    } catch (e) {
      console.log("generate error", e)
      message.error(e.message)
      pipeline.value.status = TStatus.ERROR
    }
  }

  const cancelExport = async () => {
    const data = {
      pid: pipeline.value.pid,
    }
    try {
      await interruptTask(data)
    } catch (e) {
      console.log("generate error", e)
      message.error(e.message)
    }
  }

  return {
    task: pipeline,
    isActive,
    modalVisible,
    cancelExport,
    submitExport,
    showModal,
    hideModal,
  }
})
