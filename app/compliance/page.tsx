"use client"

import Navbar from "@/components/layouts/navbar"
import Footer from "@/components/layouts/footer"

export default function CompliancePage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-secondary mb-8">Regulatory Compliance</h1>
                    <div className="prose max-w-none text-slate-600">
                        <p>LandX is committed to full compliance with all applicable financial regulations and real estate laws.</p>
                        <h3 className="text-xl font-semibold text-secondary mt-6 mb-2">KYC/AML</h3>
                        <p>We adhere to strict Know Your Customer (KYC) and Anti-Money Laundering (AML) standards. All investors are absolutely required to complete identity verification before investing.</p>
                        <h3 className="text-xl font-semibold text-secondary mt-6 mb-2">SPV Structure</h3>
                        <p>Each property is held in a separate Special Purpose Vehicle (SPV), ensuring that your investments are ring-fenced and secure. The SPV is a private limited company where investors hold shares in proportion to their investment.</p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
