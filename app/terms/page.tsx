"use client"

import Navbar from "@/components/layouts/navbar"
import Footer from "@/components/layouts/footer"

export default function TermsPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-secondary mb-8">Terms of Service</h1>
                    <div className="prose max-w-none text-slate-600">
                        <p>Welcome to LandX. By accessing our website, you agree to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
                        <h3 className="text-xl font-semibold text-secondary mt-6 mb-2">Use License</h3>
                        <p>Permission is granted to temporarily download one copy of the materials (information or software) on LandX's website for personal, non-commercial transitory viewing only.</p>
                        <h3 className="text-xl font-semibold text-secondary mt-6 mb-2">Disclaimer</h3>
                        <p>The materials on LandX's website are provided on an 'as is' basis. LandX makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
