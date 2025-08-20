// page.tsx (server wrapper)
import TasksPage from './TasksPage'

interface PageProps {
  params: { key: string }
}

export default function PageWrapper({ params }: PageProps) {
  return <TasksPage projectKey={params.key} />
}
