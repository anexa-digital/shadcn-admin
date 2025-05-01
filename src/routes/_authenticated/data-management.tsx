import { createFileRoute } from '@tanstack/react-router'
import DataManagementPage from '@/features/data-management'

export const Route = createFileRoute('/_authenticated/data-management')({
  component: DataManagementPage,
}) 