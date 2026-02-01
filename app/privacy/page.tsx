"use client"

import Navbar from "@/components/layouts/navbar"
import Footer from "@/components/layouts/footer"

export default function PrivacyPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-secondary mb-8">Privacy Policy</h1>
                    <div className="prose max-w-none text-slate-600">
                        <p>Your privacy is important to us. It is LandX's policy to respect your privacy regarding any information we may collect from you across our website.</p>
                        <h3 className="text-xl font-semibold text-secondary mt-6 mb-2">Information We Collect</h3>
                        <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.</p>
                        <h3 className="text-xl font-semibold text-secondary mt-6 mb-2">How We Store Data</h3>
                        <p>We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.</p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
