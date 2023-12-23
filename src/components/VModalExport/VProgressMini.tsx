import { Progress } from "ant-design-vue"

export default defineComponent({
  props: {
    description: {
      type: String,
      required: true,
    },
    completed: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const status = computed(() => {
      return props.completed >= 100 ? "success" : "active"
    })
    return () => (
      <>
        <div class="flex w-[200px] items-center text-left">
          <span class="line-clamp-1 text-[10px]">{props.description}</span>
        </div>
        <Progress class="pgr-sm" show-info={false} strokeWidth={5} percent={props.completed} status={status.value} />
      </>
    )
  },
})
