import StatusBadge from './StatusBadge'

const TestBadges = () => {
  return (
    <div className="flex flex-col gap-4">
        <StatusBadge status="applied" variant="soft" />
        <StatusBadge status="reviewing" variant="soft" />
        <StatusBadge status="interviewing" variant="soft" />
        <StatusBadge status="offer" variant="soft" />
        <StatusBadge status="rejected" variant="soft" />

        <StatusBadge status="applied" variant="solid" />
        <StatusBadge status="reviewing" variant="solid" />
        <StatusBadge status="interviewing" variant="solid" />
        <StatusBadge status="offer" variant="solid" />
        <StatusBadge status="rejected" variant="solid" />
    </div>
  )
}

export default TestBadges