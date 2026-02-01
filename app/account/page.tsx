"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/layouts/navbar"
import Footer from "@/components/layouts/footer"
import { CheckCircle, Clock, Download, Edit2, Save, X } from "lucide-react"
import AuthGuard from "@/components/auth/auth-guard"
import { getUserId } from "@/lib/auth"

const kycStatus = {
    email: { status: "verified", label: "Email Verified" },
    phone: { status: "verified", label: "Phone Verified" },
    pan: { status: "verified", label: "PAN Verified" },
    address: { status: "pending", label: "Address Pending" },
}

const transactions = [
    {
        id: "TXN001",
        date: "2024-12-01",
        type: "Investment",
        property: "Prestige Corporate Tower",
        amount: 50000,
        status: "Completed",
    },
    {
        id: "TXN002",
        date: "2024-11-15",
        type: "Rent Distribution",
        property: "Green Valley Residences",
        amount: 1200,
        status: "Completed",
    },
    {
        id: "TXN003",
        date: "2024-11-01",
        type: "Investment",
        property: "Tech Park Hub",
        amount: 55000,
        status: "Completed",
    },
    {
        id: "TXN004",
        date: "2024-10-15",
        type: "Rent Distribution",
        property: "Prestige Corporate Tower",
        amount: 1050,
        status: "Completed",
    },
]

const documents = [
    { name: "KYC Document", date: "2024-12-01", size: "2.4 MB" },
    { name: "Investment Agreement", date: "2024-12-01", size: "1.8 MB" },
    { name: "Tax Certificate 2024", date: "2024-12-01", size: "0.9 MB" },
]

export default function AccountPage() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isEditingProfile, setIsEditingProfile] = useState(false)
    const [editFormData, setEditFormData] = useState({ name: "", email: "" })
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        async function loadProfile() {
            const userId = getUserId()
            if (!userId) {
                setLoading(false)
                return
            }
            
            try {
                const { getUserProfile } = await import("@/lib/actions")
                const userData = await getUserProfile(userId)
                setUser(userData)
                setEditFormData({ name: userData?.name || "", email: userData?.email || "" })
            } catch (error) {
                console.error("Failed to load profile", error)
            } finally {
                setLoading(false)
            }
        }
        loadProfile()
    }, [])

    const kycComplete = user?.kycStatus === "VERIFIED"

    // Derive kycStatus object from real data
    const dynamicKycStatus = {
        email: { status: "verified", label: "Email Verified" },
        phone: { status: "verified", label: "Phone Verified" },
        pan: { status: kycComplete ? "verified" : "pending", label: "PAN Verified" },
        address: { status: kycComplete ? "verified" : "pending", label: "Address Verified" },
    }

    const handleEditProfile = () => {
        setIsEditingProfile(true)
        setEditFormData({ name: user?.name || "", email: user?.email || "" })
    }

    const handleCancelEdit = () => {
        setIsEditingProfile(false)
        setEditFormData({ name: user?.name || "", email: user?.email || "" })
    }

    const handleSaveProfile = async () => {
        const userId = getUserId()
        if (!userId) {
            alert("Please log in to update profile.")
            return
        }

        setIsSaving(true)
        try {
            const { updateUserProfile } = await import("@/lib/actions")
            const result = await updateUserProfile(userId, editFormData)
            
            if (result.success) {
                setUser(result.user)
                // Update localStorage
                const storedUser = localStorage.getItem("user")
                if (storedUser) {
                    const userObj = JSON.parse(storedUser)
                    localStorage.setItem("user", JSON.stringify({ ...userObj, ...result.user }))
                }
                setIsEditingProfile(false)
                alert("Profile updated successfully!")
            } else {
                alert(result.error || "Failed to update profile")
            }
        } catch (error) {
            console.error(error)
            alert("Failed to update profile")
        } finally {
            setIsSaving(false)
        }
    }

    const handleCompleteKYC = () => {
        router.push("/kyc")
    }

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-xl text-slate-500">Loading account...</p>
                </div>
                <Footer />
            </>
        )
    }

    return (
        <AuthGuard>
            <Navbar />
            <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-12">
                        <h1 className="text-3xl sm:text-4xl font-bold text-secondary mb-2">Account Settings</h1>
                        <p className="text-slate-700">Manage your profile and documents</p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6 mb-12">
                        {/* KYC Status */}
                        <div className="lg:col-span-1 bg-white rounded-xl p-6 border border-slate-200">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-lg text-secondary">KYC Status</h3>
                                {kycComplete && <CheckCircle className="text-green-500" size={24} />}
                            </div>

                            <div className="space-y-3">
                                {Object.entries(dynamicKycStatus).map(([key, { status, label }]) => (
                                    <div key={key} className="flex items-center gap-3">
                                        {status === "verified" ? (
                                            <CheckCircle className="text-green-500" size={20} />
                                        ) : (
                                            <Clock className="text-yellow-500" size={20} />
                                        )}
                                        <span className="text-sm text-slate-700 flex-1">{label}</span>
                                        <span
                                            className={`text-xs font-semibold px-2 py-1 rounded ${status === "verified" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                                                }`}
                                        >
                                            {status === "verified" ? "Done" : "Pending"}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {!kycComplete && (
                                <button
                                    onClick={handleCompleteKYC}
                                    className="w-full mt-6 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                                >
                                    Complete KYC
                                </button>
                            )}
                        </div>

                        {/* Profile Info */}
                        <div className="lg:col-span-1 bg-white rounded-xl p-6 border border-slate-200">
                            <h3 className="font-bold text-lg text-secondary mb-6">Profile Information</h3>
                            {isEditingProfile ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs text-slate-700 mb-1 block">Full Name</label>
                                        <input
                                            type="text"
                                            value={editFormData.name}
                                            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-700 mb-1 block">Email</label>
                                        <input
                                            type="email"
                                            value={editFormData.email}
                                            onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-700 mb-1">Wallet Balance</p>
                                        <p className="font-semibold text-secondary">₹{user?.walletBalance?.toLocaleString("en-IN") || 0}</p>
                                    </div>
                                    <div className="flex gap-2 mt-6">
                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={isSaving}
                                            className="flex-1 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            <Save size={16} />
                                            {isSaving ? "Saving..." : "Save"}
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            disabled={isSaving}
                                            className="flex-1 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            <X size={16} />
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs text-slate-700 mb-1">Full Name</p>
                                            <p className="font-semibold text-secondary">{user?.name || "User"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-700 mb-1">Email</p>
                                            <p className="font-semibold text-secondary">{user?.email || "email@example.com"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-700 mb-1">Wallet Balance</p>
                                            <p className="font-semibold text-secondary">₹{user?.walletBalance?.toLocaleString("en-IN") || 0}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleEditProfile}
                                        className="w-full mt-6 py-2 border border-blue-500 text-blue-500 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Edit2 size={16} />
                                        Edit Profile
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Payment Methods */}
                        <div className="lg:col-span-1 bg-white rounded-xl p-6 border border-slate-200">
                            <h3 className="font-bold text-lg text-secondary mb-6">Payment Methods</h3>
                            <div className="space-y-3">
                                <div className="p-3 bg-slate-50 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-semibold text-secondary">Bank Account</p>
                                        <p className="text-xs text-slate-700">****1234</p>
                                    </div>
                                    <CheckCircle className="text-green-500" size={20} />
                                </div>
                                <button className="w-full py-2 border border-slate-300 text-secondary rounded-lg font-semibold hover:bg-slate-50 transition-colors text-sm">
                                    Add Payment Method
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Transaction History */}
                    <div className="bg-white rounded-xl border border-slate-200 mb-12 overflow-hidden">
                        <div className="p-6 border-b border-slate-200">
                            <h3 className="font-bold text-lg text-secondary">Transaction History</h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Date</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Type</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Amount</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Status</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Receipt</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {user?.transactions?.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                                No transactions found.
                                            </td>
                                        </tr>
                                    ) : user?.transactions?.map((txn: any) => (
                                        <tr key={txn.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-secondary">{new Date(txn.date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`text-sm font-semibold px-3 py-1 rounded-full ${txn.type === "DEPOSIT" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                                                        }`}
                                                >
                                                    {txn.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-semibold text-secondary">
                                                ₹{Math.abs(txn.amount).toLocaleString("en-IN")}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-semibold px-3 py-1 bg-green-100 text-green-700 rounded-full">
                                                    {txn.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button className="text-blue-600 hover:underline text-sm font-semibold">Download</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Documents */}
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-200">
                            <h3 className="font-bold text-lg text-secondary">Documents</h3>
                        </div>

                        <div className="divide-y divide-slate-200">
                            {documents.map((doc, i) => (
                                <div key={i} className="p-6 flex justify-between items-center hover:bg-slate-50 transition-colors">
                                    <div>
                                        <p className="font-semibold text-secondary">{doc.name}</p>
                                        <p className="text-sm text-slate-700 mt-1">
                                            {doc.date} • {doc.size}
                                        </p>
                                    </div>
                                    <button className="flex items-center gap-2 text-blue-600 hover:underline font-semibold">
                                        <Download size={18} />
                                        Download
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </AuthGuard>
    )
}
