"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/layouts/navbar"
import Footer from "@/components/layouts/footer"
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts"
import { TrendingUp, Home, Wallet, ArrowUpRight, Plus, CreditCard } from "lucide-react"
import AuthGuard from "@/components/auth/auth-guard"
import { getUserId } from "@/lib/auth"
import RazorpayCheckout from "@/components/payment/razorpay-checkout"

const COLORS = ["#4C7EFF", "#10B981", "#F59E0B"]

export default function DashboardPage() {
    const [investments, setInvestments] = useState<any[]>([])
    const [userProfile, setUserProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [showAddFunds, setShowAddFunds] = useState(false)
    const [amountToAdd, setAmountToAdd] = useState(10000)
    const [isProcessing, setIsProcessing] = useState(false)
    const [addFundsMethod, setAddFundsMethod] = useState<"gateway" | "simulate" | null>(null)
    const [addFundsOrder, setAddFundsOrder] = useState<any>(null)
    const [showAddFundsRazorpay, setShowAddFundsRazorpay] = useState(false)
    const [stats, setStats] = useState({
        totalValue: 0,
        investedValue: 0,
        monthlyRent: 0,
        appreciationValue: 0,
        propertyCount: 0,
        totalReturns: 0,
        roi: 0
    })

    useEffect(() => {
        async function loadData() {
            const userId = getUserId()
            if (!userId) {
                setLoading(false)
                return
            }
            
            try {
                const { getUserInvestments, getUserProfile } = await import("@/lib/actions")
                const [invData, userData] = await Promise.all([
                    getUserInvestments(userId),
                    getUserProfile(userId)
                ])

                setInvestments(invData)
                setUserProfile(userData)

                // Calculate stats
                let totalInvested = 0
                let totalCurrent = 0
                let totalRent = 0

                invData.forEach((inv: any) => {
                    const appreciationFactor = 1 + (inv.property.appreciation / 100)
                    const currentVal = inv.amount * appreciationFactor
                    const monthlyRent = (inv.amount * (inv.property.rentYield / 100)) / 12

                    totalInvested += inv.amount
                    totalCurrent += currentVal
                    totalRent += monthlyRent
                })

                setStats({
                    totalValue: Math.round(totalCurrent),
                    investedValue: Math.round(totalInvested),
                    monthlyRent: Math.round(totalRent),
                    appreciationValue: Math.round(totalCurrent - totalInvested),
                    propertyCount: new Set(invData.map((i: any) => i.propertyId)).size,
                    totalReturns: Math.round((totalCurrent - totalInvested) + totalRent),
                    roi: totalInvested > 0 ? (((totalCurrent - totalInvested) + totalRent) / totalInvested) * 100 : 0
                })

            } catch (error) {
                console.error("Failed to load portfolio", error)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])

    const handleAddFunds = async (method: "gateway" | "simulate") => {
        const userId = getUserId()
        if (!userId) {
            alert("Please log in to add funds.")
            return
        }

        if (amountToAdd < 100) {
            alert("Please enter an amount of at least ₹100")
            return
        }

        setAddFundsMethod(method)

        if (method === "simulate") {
            // Simulate instant wallet top-up (for testing)
            setIsProcessing(true)
            try {
                const { addFunds } = await import("@/lib/actions")
                const result = await addFunds(userId, amountToAdd)
                if (result.success) {
                    const { getUserProfile } = await import("@/lib/actions")
                    const userData = await getUserProfile(userId)
                    setUserProfile(userData)
                    setShowAddFunds(false)
                    setAddFundsMethod(null)
                    setAmountToAdd(10000)
                    alert(`Funds added successfully! Your wallet balance is now ₹${userData.walletBalance.toLocaleString("en-IN")}`)
                } else {
                    alert(result.error || "Failed to add funds. Please try again.")
                    setAddFundsMethod(null)
                }
            } catch (error: any) {
                console.error(error)
                alert(error.message || "Failed to add funds. Please try again.")
                setAddFundsMethod(null)
            } finally {
                setIsProcessing(false)
            }
        } else if (method === "gateway") {
            // Use payment gateway
            setIsProcessing(true)
            try {
                const { createPaymentOrder } = await import("@/lib/actions")
                const result = await createPaymentOrder(userId, amountToAdd, undefined, "Wallet Top-up")

                if (result.success && result.orderId) {
                    setAddFundsOrder(result)
                    setShowAddFundsRazorpay(true)
                } else {
                    alert(result.error || "Failed to create payment order. Please configure Razorpay keys or use Simulate option.")
                    setAddFundsMethod(null)
                    setIsProcessing(false)
                }
            } catch (error: any) {
                console.error(error)
                alert(error.message || "Failed to initialize payment. Please configure Razorpay keys or use Simulate option for testing.")
                setAddFundsMethod(null)
                setIsProcessing(false)
            }
        }
    }

    const handleAddFundsPaymentSuccess = async (paymentId: string, signature: string) => {
        const userId = getUserId()
        if (!userId || !addFundsOrder) {
            alert("Payment verification failed - missing data")
            return
        }

        setIsProcessing(true)
        try {
            const { verifyPayment, getUserProfile } = await import("@/lib/actions")

            const verifyResult = await verifyPayment(
                addFundsOrder.orderId,
                paymentId,
                signature,
                userId,
                amountToAdd
            )

            if (verifyResult.success) {
                setShowAddFunds(false)
                setShowAddFundsRazorpay(false)
                setAddFundsOrder(null)
                setAddFundsMethod(null)

                // Refresh profile
                const updatedProfile = await getUserProfile(userId)
                setUserProfile(updatedProfile)

                alert("Funds added successfully! Your wallet has been topped up.")
            } else {
                alert(verifyResult.error || "Payment verification failed")
            }
        } catch (error) {
            console.error(error)
            alert("Error processing payment. Please contact support.")
        } finally {
            setIsProcessing(false)
        }
    }

    const handleAddFundsPaymentFailure = (error: any) => {
        console.error("Add funds payment failed:", error)
        alert(error.message || "Payment failed. Please try again.")
        setShowAddFundsRazorpay(false)
        setIsProcessing(false)
    }

    const handleWithdrawRent = async () => {
        const userId = getUserId()
        if (!userId) {
            alert("Please log in to withdraw rent.")
            return
        }
        
        if (stats.monthlyRent <= 0) {
            alert("No rental income to withdraw yet.")
            return
        }

        const confirmed = window.confirm(`Withdraw ₹${stats.monthlyRent.toLocaleString("en-IN")} rent to wallet?`)
        if (!confirmed) return

        setIsProcessing(true)
        try {
            const { withdrawRent } = await import("@/lib/actions")
            const result = await withdrawRent(userId, stats.monthlyRent)
            
            if (result.success) {
                 // Refresh data
                 const { getUserProfile } = await import("@/lib/actions")
                 const userData = await getUserProfile(userId)
                 setUserProfile(userData)
                 alert("Rent withdrawn to wallet successfully!")
            }
        } catch (error) {
            console.error(error)
            alert("Failed to withdraw rent.")
        } finally {
            setIsProcessing(false)
        }
    }

    // Group investments by type for Chart

    const portfolioChartData = investments.reduce((acc: any[], inv) => {
        const existing = acc.find(x => x.name === inv.property.type)
        if (existing) {
            existing.value += inv.amount
        } else {
            acc.push({ name: inv.property.type, value: inv.amount })
        }
        return acc
    }, [])

    // Fallback chart data if empty
    const displayChartData = portfolioChartData.length > 0 ? portfolioChartData : [{ name: "No Assets", value: 100 }]
    const chartColors = portfolioChartData.length > 0 ? COLORS : ["#CBD5E1"]

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-xl text-slate-500">Loading portfolio...</p>
                </div>
                <Footer />
            </>
        )
    }

    return (
        <AuthGuard>
            <Navbar />
            <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12">
                        <h1 className="text-3xl sm:text-4xl font-bold text-secondary mb-2">Portfolio Dashboard</h1>
                        <p className="text-slate-700">Track your real estate investments</p>
                    </div>


                    {/* Top Stats */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {/* 1. Wallet Balance */}
                        <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all relative overflow-hidden">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm text-slate-700 mb-1">Wallet Balance</p>
                                    <p className="text-2xl font-bold text-secondary">
                                        ₹{userProfile?.walletBalance?.toLocaleString("en-IN") || 0}
                                    </p>
                                </div>
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <Wallet className="text-blue-500" size={24} />
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setShowAddFunds(true)
                                    setAddFundsMethod(null)
                                    setAddFundsOrder(null)
                                    setAmountToAdd(10000)
                                }}
                                className="w-full py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                            >
                                <Plus size={16} /> Add Funds
                            </button>
                        </div>

                        <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-700 mb-2">Portfolio Value</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-secondary">
                                        ₹{stats.totalValue.toLocaleString("en-IN")}
                                    </p>
                                </div>
                                <div className="p-2 bg-purple-50 rounded-lg">
                                    <Home className="text-purple-500" size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-700 mb-2">Monthly Rent</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-green-600">
                                        ₹{stats.monthlyRent.toLocaleString("en-IN")}
                                    </p>
                                </div>
                                <ArrowUpRight className="text-green-500" size={32} />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-700 mb-2">Appreciation</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                                        ₹{stats.appreciationValue.toLocaleString("en-IN")}
                                    </p>
                                </div>
                                <TrendingUp className="text-blue-500" size={32} />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-700 mb-2">Total Returns</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-emerald-600">
                                        ₹{stats.totalReturns.toLocaleString("en-IN")}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {stats.roi.toFixed(2)}% ROI
                                    </p>
                                </div>
                                <TrendingUp className="text-emerald-500" size={32} />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-700 mb-2">Properties</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-purple-600">{stats.propertyCount}</p>
                                </div>
                                <Home className="text-purple-500" size={32} />
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6 mb-12">
                        {/* Asset Allocation */}
                        <div className="lg:col-span-1 bg-white rounded-xl p-6 border border-slate-200">
                            <h3 className="font-bold text-lg text-secondary mb-6">Asset Allocation</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={displayChartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={2}
                                            dataKey="value"
                                        >
                                            {displayChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-6 space-y-2">
                                {portfolioChartData.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chartColors[i] }}></div>
                                        <span className="text-sm text-slate-700">{item.name}</span>
                                        <span className="text-sm font-semibold text-secondary ml-auto">{((item.value / stats.investedValue) * 100).toFixed(1)}%</span>
                                    </div>
                                ))}
                                {portfolioChartData.length === 0 && <p className="text-center text-slate-400 text-sm">No investments yet</p>}
                            </div>
                        </div>

                        {/* Rent History Chart (Mock for now as backend doesn't store history) */}
                        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200">
                            <h3 className="font-bold text-lg text-secondary mb-6">Rental Income Projection</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={[
                                        { month: "Jan", amount: stats.monthlyRent },
                                        { month: "Feb", amount: stats.monthlyRent },
                                        { month: "Mar", amount: stats.monthlyRent * 1.05 }, // projected growth
                                        { month: "Apr", amount: stats.monthlyRent * 1.05 }
                                    ]}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "#1E293B",
                                                border: "none",
                                                borderRadius: "8px",
                                                color: "#fff",
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="amount"
                                            stroke="#4C7EFF"
                                            dot={{ fill: "#4C7EFF", r: 5 }}
                                            strokeWidth={2}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Holdings Table */}
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-200">
                            <h3 className="font-bold text-lg text-secondary">Your Holdings</h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Property</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Invested</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Current Value</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Monthly Rent</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Return</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {investments.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                                No investments found. <a href="/explore" className="text-blue-600 font-semibold hover:underline">Start Investing</a>
                                            </td>
                                        </tr>
                                    ) : investments.map((inv, i) => {
                                        const appreciationFactor = 1 + (inv.property.appreciation / 100)
                                        const currentValue = Math.round(inv.amount * appreciationFactor)
                                        const monthlyRent = Math.round((inv.amount * (inv.property.rentYield / 100)) / 12)
                                        const gain = currentValue - inv.amount
                                        const gainPercent = (gain / inv.amount) * 100

                                        return (
                                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-semibold text-secondary">{inv.property.name}</p>
                                                        <p className="text-xs text-slate-500">{inv.property.city}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-secondary">₹{inv.amount.toLocaleString("en-IN")}</td>
                                                <td className="px-6 py-4">
                                                    <span className="font-semibold text-secondary">
                                                        ₹{currentValue.toLocaleString("en-IN")}
                                                    </span>
                                                    <p className="text-xs text-green-600 mt-1">
                                                        +₹{gain.toLocaleString("en-IN")} ({gainPercent.toFixed(1)}%)
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4 text-green-600 font-semibold">
                                                    ₹{monthlyRent.toLocaleString("en-IN")}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                                                        +{inv.property.rentYield}%
                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
                            <div>
                                <p className="text-sm text-slate-700 mb-1">Annual Rental Income</p>
                                <p className="text-2xl font-bold text-secondary">
                                    ₹{(stats.monthlyRent * 12).toLocaleString("en-IN")}
                                </p>
                            </div>
                            <button 
                                onClick={handleWithdrawRent}
                                disabled={isProcessing || stats.monthlyRent <= 0}
                                className="px-8 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                {isProcessing ? "Processing..." : "Withdraw Rent"}
                            </button>
                        </div>
                    </div>
                </div>


                {/* Add Funds Modal */}
                {showAddFunds && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => {
                        if (e.target === e.currentTarget && !isProcessing) {
                            setShowAddFunds(false)
                            setAddFundsMethod(null)
                            setAddFundsOrder(null)
                        }
                    }}>
                        <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                            <h3 className="text-lg font-bold text-secondary mb-4">Add Funds to Wallet</h3>

                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-secondary mb-2">Amount</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3 text-slate-500 font-bold">₹</span>
                                    <input
                                        type="number"
                                        value={amountToAdd}
                                        onChange={(e) => {
                                            const val = Number(e.target.value)
                                            if (val >= 100 || val === 0) {
                                                setAmountToAdd(val || 100)
                                            }
                                        }}
                                        min={100}
                                        placeholder="Enter amount"
                                        className="w-full pl-8 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-lg"
                                        disabled={isProcessing || addFundsMethod !== null}
                                    />
                                </div>
                                <p className="text-xs text-slate-500 mt-1">Minimum ₹100</p>
                                {amountToAdd < 100 && amountToAdd > 0 && (
                                    <p className="text-xs text-red-500 mt-1">Amount must be at least ₹100</p>
                                )}
                            </div>

                            {addFundsMethod === null ? (
                                <div className="mb-6 space-y-3">
                                    <button
                                        onClick={() => {
                                            if (amountToAdd >= 100) {
                                                handleAddFunds("gateway")
                                            } else {
                                                alert("Please enter an amount of at least ₹100")
                                            }
                                        }}
                                        disabled={isProcessing || amountToAdd < 100}
                                        className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <CreditCard size={18} />
                                        Pay via Gateway (UPI/Cards)
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (amountToAdd >= 100) {
                                                handleAddFunds("simulate")
                                            } else {
                                                alert("Please enter an amount of at least ₹100")
                                            }
                                        }}
                                        disabled={isProcessing || amountToAdd < 100}
                                        className="w-full py-3 bg-slate-600 text-white rounded-lg font-bold hover:bg-slate-700 transition flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Wallet size={18} />
                                        Simulate Instant Top-up (Test)
                                    </button>
                                    <p className="text-xs text-center text-slate-500 mt-2">
                                        💡 Use "Simulate" for instant testing without payment gateway
                                    </p>
                                </div>
                            ) : (
                                <div className="mb-6">
                                    {isProcessing ? (
                                        <div className="text-center py-4">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                                            <p className="text-sm text-slate-600">
                                                {addFundsMethod === "gateway" 
                                                    ? "Initializing payment gateway..." 
                                                    : "Adding funds to wallet..."}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="text-center py-4">
                                            <p className="text-sm text-slate-600">Selecting payment method...</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="space-y-3">
                                <button
                                    onClick={() => {
                                        if (!isProcessing || addFundsMethod !== "gateway") {
                                            setShowAddFunds(false)
                                            setAddFundsMethod(null)
                                            setAddFundsOrder(null)
                                            setIsProcessing(false)
                                        }
                                    }}
                                    disabled={isProcessing && addFundsMethod === "gateway"}
                                    className="w-full py-3 text-slate-600 font-semibold hover:bg-slate-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed border border-slate-300"
                                >
                                    {isProcessing && addFundsMethod === "gateway" ? "Processing..." : "Cancel"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Razorpay Checkout for Add Funds */}
                {showAddFundsRazorpay && addFundsOrder && (
                    <RazorpayCheckout
                        amount={addFundsOrder.amount}
                        orderId={addFundsOrder.orderId}
                        keyId={addFundsOrder.key}
                        description="Wallet Top-up"
                        onSuccess={handleAddFundsPaymentSuccess}
                        onFailure={handleAddFundsPaymentFailure}
                        onClose={() => {
                            setShowAddFundsRazorpay(false)
                            setAddFundsOrder(null)
                            setAddFundsMethod(null)
                            setIsProcessing(false)
                        }}
                    />
                )}
            </main >
            <Footer />
        </AuthGuard>
    )
}
