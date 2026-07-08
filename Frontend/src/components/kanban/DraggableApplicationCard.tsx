import ApplicationCard from "../../features/applications/components/ApplicationCard"
import type { JobApplication } from "../../types/types"
import { useSortable } from "@dnd-kit/react/sortable"

type DraggableApplicationCardProps = {
    app: JobApplication,
    index: number,
    className?: string
}

const DraggableApplicationCard = ({app, index, className}: DraggableApplicationCardProps) => {
    const { ref } = useSortable({
        id: app.id,
        index,
        group: app.status,
        type: "application",
        accept: "application"
    })
  return (
    <div ref={ref} className={className}><ApplicationCard app={app} variant="compact" /></div>
  )
}

export default DraggableApplicationCard