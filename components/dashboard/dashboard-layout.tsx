"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Briefcase, GraduationCap, LogOut, Menu, User, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email)
      }
    }

    getUser()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    toast.success("Signed out successfully")
    router.push("/")
    router.refresh()
  }

  return (
      <div className="flex h-screen flex-col bg-background">
        <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background px-4 md:px-6">
          <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Toggle Menu</span>
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Application Tracker</h1>
          </div>
          <div className="flex items-center gap-4">
            {userEmail && (
                <div className="hidden items-center gap-2 md:flex">
                  <User className="h-4 w-4" />
                  <span className="text-sm">{userEmail}</span>
                </div>
            )}
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </header>
        <div className="flex flex-1 overflow-hidden">
          {/* Mobile sidebar */}
          {isMobileMenuOpen && (
              <div className="fixed inset-0 z-40 md:hidden">
                <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
                <div className="fixed inset-y-0 left-0 z-40 w-64 bg-background">
                  <div className="flex h-16 items-center border-b px-4">
                    <h2 className="text-lg font-semibold">Menu</h2>
                    <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setIsMobileMenuOpen(false)}>
                      <X className="h-5 w-5" />
                      <span className="sr-only">Close</span>
                    </Button>
                  </div>
                  <div className="py-4">
                    <nav className="grid gap-2 px-2">
                      <Link
                          href="/dashboard"
                          className={cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                              pathname === "/dashboard" ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                          )}
                          onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Briefcase className="h-5 w-5" />
                        Employment Applications
                      </Link>
                      <Link
                          href="/dashboard/education"
                          className={cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                              pathname === "/dashboard/education" ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                          )}
                          onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <GraduationCap className="h-5 w-5" />
                        Education Applications
                      </Link>
                    </nav>
                  </div>
                  {userEmail && (
                      <div className="absolute bottom-0 w-full border-t p-4 md:hidden">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="h-4 w-4" />
                          <span className="text-sm truncate">{userEmail}</span>
                        </div>
                      </div>
                  )}
                </div>
              </div>
          )}

          {/* Desktop sidebar */}
          <div className="hidden w-64 flex-shrink-0 border-r bg-background md:block">
            <div className="flex h-full flex-col">
              <div className="flex-1 overflow-auto py-2">
                <nav className="grid gap-1 px-2">
                  <Link
                      href="/dashboard"
                      className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                          pathname === "/dashboard" ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                      )}
                  >
                    <Briefcase className="h-5 w-5" />
                    Employment Applications
                  </Link>
                  <Link
                      href="/dashboard/education"
                      className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                          pathname === "/dashboard/education" ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                      )}
                  >
                    <GraduationCap className="h-5 w-5" />
                    Education Applications
                  </Link>
                </nav>
              </div>
            </div>
          </div>

          <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
  )
}
