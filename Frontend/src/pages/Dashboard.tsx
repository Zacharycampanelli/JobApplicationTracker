import Button from "../components/ui/Button"
import TestInputs from "../components/ui/TestInputs"

const Dashboard = () => {
  return (
    <>
<Button>Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Delete</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button disabled>Disabled</Button>
<TestInputs />
      </>
  )
}

export default Dashboard