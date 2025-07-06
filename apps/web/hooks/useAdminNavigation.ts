import { useState } from 'react'

export function useAdminNavigation() {
  const [sectionActive, setSectionActive] = useState<string>('dashboard')
  const [sidebarOuverte, setSidebarOuverte] = useState<boolean>(true)
  const [notifications] = useState<number>(3)

  const toggleSidebar = () => {
    setSidebarOuverte(!sidebarOuverte)
  }

  const navigateTo = (section: string) => {
    setSectionActive(section)
  }

  return {
    sectionActive,
    setSectionActive,
    sidebarOuverte,
    setSidebarOuverte,
    notifications,
    toggleSidebar,
    navigateTo
  }
}
