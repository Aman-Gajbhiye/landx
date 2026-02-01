"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/layouts/navbar"
import Footer from "@/components/layouts/footer"
import { ShieldCheck, Upload, AlertCircle } from "lucide-react"
import { getUserId } from "@/lib/auth"

export default function KYCPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        fullName: "",
        dob: "",
        panNumber: "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const userId = getUserId()
        if (!userId) {
            alert("Please log in to complete KYC.")
            router.push("/login")
            return
        }

        setLoading(true)

        try {
            const { submitKYC } = await import("@/lib/actions")
            const result = await submitKYC(userId, formData)

            if (result.success) {
                // Update localStorage user data
                const storedUser = localStorage.getItem("user")
                if (storedUser) {
                    const userObj = JSON.parse(storedUser)
                    localStorage.setItem("user", JSON.stringify({ ...userObj, kycStatus: "VERIFIED" }))
                }
                setStep(3) // Success step
            } else {
                alert("Verification failed. Please try again.")
            }
        } catch (error) {
            console.error(error)
            alert("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Navbar />
            <main className="min-h-screen py-16 px-4 bg-slate-50">
                <div className="max-w-xl mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold text-secondary mb-3">Identity Verification</h1>
                        <p className="text-slate-600">Complete KYC to start investing in premium real estate.</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                        {/* Progress Bar */}
                        <div className="flex border-b border-slate-200">
                            <div className={`flex-1 py-3 text-center text-sm font-semibold ${step >= 1 ? "text-blue-600 bg-blue-50" : "text-slate-400"}`}>
                                1. Personal Details
                            </div>
                            <div className={`flex-1 py-3 text-center text-sm font-semibold ${step >= 2 ? "text-blue-600 bg-blue-50" : "text-slate-400"}`}>
                                2. Documents
                            </div>
                            <div className={`flex-1 py-3 text-center text-sm font-semibold ${step >= 3 ? "text-blue-600 bg-blue-50" : "text-slate-400"}`}>
                                3. Verification
                            </div>
                        </div>

                        <div className="p-8">
                            {step === 1 && (
                                <form onSubmit={(e) => { e.preventDefault(); setStep(2) }} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-secondary mb-2">Full Name (as per PAN)</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="e.g. Rahul Sharma"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-secondary mb-2">Date of Birth</label>
                                        <input
                                            required
                                            type="date"
                                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={formData.dob}
                                            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-secondary mb-2">PAN Number</label>
                                        <input
                                            required
                                            type="text"
                                            maxLength={10}
                                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                                            placeholder="ABCDE1234F"
                                            value={formData.panNumber}
                                            onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                                        />
                                    </div>
                                    <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition">
                                        Continue
                                    </button>
                                </form>
                            )}

                            {step === 2 && (
                                <div className="space-y-6">
                                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition cursor-pointer">
                                        <Upload className="mx-auto text-slate-400 mb-4" size={40} />
                                        <p className="font-semibold text-secondary">Upload PAN Card</p>
                                        <p className="text-xs text-slate-500 mt-2">JPG, PNG or PDF (Max 5MB)</p>
                                    </div>

                                    <div className="bg-blue-50 p-4 rounded-lg flex gap-3 items-start">
                                        <ShieldCheck className="text-blue-600 shrink-0 mt-1" size={20} />
                                        <p className="text-sm text-blue-800">Your data is encrypted and stored securely. We only use this for regulatory compliance.</p>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setStep(1)}
                                            className="flex-1 py-3 text-slate-600 font-semibold hover:bg-slate-50 rounded-lg"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={handleSubmit}
                                            disabled={loading}
                                            className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition flex justify-center items-center"
                                        >
                                            {loading ? "Verifying..." : "Submit Verification"}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="text-center py-8">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <ShieldCheck className="text-green-600" size={40} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-secondary mb-3">You are Verified!</h2>
                                    <p className="text-slate-600 mb-8">Your KYC has been successfully approved. You can now start investing in all available properties.</p>
                                    <button
                                        onClick={() => router.push('/explore')}
                                        className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
                                    >
                                        Start Investing
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
