import Link from "next/link"
import { ExternalLink } from 'lucide-react'

export function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="container flex flex-col items-center justify-center gap-4 py-6 md:flex-row md:py-8">
                <p className="text-center text-sm text-muted-foreground md:text-left">
                    &copy; {new Date().getFullYear()} Application Tracking Dashboard. All rights reserved.
                </p>
                <div className="flex items-center gap-1">
                    <span className="text-sm text-muted-foreground">Built by</span>
                    <Link
                        href="https://seif-dx.vercel.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                        Seif-DX
                        <ExternalLink className="h-3 w-3" />
                    </Link>
                </div>
            </div>
        </footer>
    )
}
