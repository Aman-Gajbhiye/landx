"use client"

import { useRouter } from "next/navigation"
import { useEffect, Suspense } from "react"
import Navbar from "@/components/layouts/navbar"
import Footer from "@/components/layouts/footer"
import AuthGuard from "@/components/auth/auth-guard"

function PaymentContent() {
    const router = useRouter()

    useEffect(() => {
        // Redirect to explore
        router.push("/explore")
    }, [router])

    return (
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <p className="text-xl text-slate-500">Redirecting...</p>
            </div>
        </main>
        <Footer />
    )
}

export default function PaymentPage() {
    return (
        <AuthGuard>
            <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-xl text-slate-500">Loading...</p>
                </div>
            }>
                <PaymentContent />
            </Suspense>
        </AuthGuard>
    )
}
