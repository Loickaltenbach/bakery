import React from "react"
import { Bell, LogOut, Menu, X } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { navigationItems, NavigationItem, SectionAdmin } from './AdminNavigation'

interface AdminSidebarProps {
  sectionActive: SectionAdmin
  sidebarOuverte: boolean
  notifications: number
  onSectionChange: (section: SectionAdmin) => void
  onToggleSidebar: () => void
}

export function AdminSidebar({ 
  sectionActive, 
  sidebarOuverte, 
  notifications,
  onSectionChange, 
  onToggleSidebar 
}: AdminSidebarProps) {
  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${
      sidebarOuverte ? 'w-64' : 'w-16'
    }`}>
      {/* Header sidebar */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {sidebarOuverte && (
          <h2 className="text-lg font-semibold text-gray-800">Administration</h2>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleSidebar}
          className="p-2"
        >
          {sidebarOuverte ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => (
          <Button
            key={item.id}
            variant={sectionActive === item.id ? "default" : "outline"}
            className={`w-full justify-start ${!sidebarOuverte && 'px-2'}`}
            onClick={() => onSectionChange(item.id)}
          >
            <item.icon className="h-4 w-4" />
            {sidebarOuverte && (
              <>
                <span className="ml-3">{item.label}</span>
                {item.id === 'commandes' && notifications > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {notifications}
                  </span>
                )}
              </>
            )}
          </Button>
        ))}
      </nav>

      {/* Footer sidebar */}
      {sidebarOuverte && (
        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <Button variant="outline" className="w-full justify-start">
            <Bell className="h-4 w-4" />
            <span className="ml-3">Notifications</span>
            {notifications > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {notifications}
              </span>
            )}
          </Button>
          <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
            <LogOut className="h-4 w-4" />
            <span className="ml-3">Déconnexion</span>
          </Button>
        </div>
      )}
    </div>
  )
}
