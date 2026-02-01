"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Navbar from "@/components/layouts/navbar"
import Footer from "@/components/layouts/footer"
import { MapPin, CheckCircle, CreditCard, Wallet } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import Link from "next/link"
import { getUserId } from "@/lib/auth"
import RazorpayCheckout from "@/components/payment/razorpay-checkout"

const appreciationData = [
  { month: "Jan", value: 100 },
  { month: "Feb", value: 102 },
  { month: "Mar", value: 105 },
  { month: "Apr", value: 108 },
  { month: "May", value: 110 },
  { month: "Jun", value: 115 },
  { month: "Jul", value: 118 },
  { month: "Aug", value: 122 },
  { month: "Sep", value: 125 },
  { month: "Oct", value: 128 },
  { month: "Nov", value: 132 },
  { month: "Dec", value: 135 },
]

export default function PropertyDetailsPage() {
  const params = useParams()
  // Ensure we handle id as string, useParams returns string | string[]
  const id = Array.isArray(params.id) ? params.id[0] : params.id

  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [investmentAmount, setInvestmentAmount] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "gateway" | null>(null)
  const [paymentOrder, setPaymentOrder] = useState<any>(null)
  const [showRazorpay, setShowRazorpay] = useState(false)

  const [userProfile, setUserProfile] = useState<any>(null)

  useEffect(() => {
    if (!id) return;
    async function loadData() {
      const userId = getUserId()
      if (!userId) {
        setLoading(false)
        return
      }
      
      try {
        const { getProperty, getUserProfile } = await import("@/lib/actions")
        const [propData, userData] = await Promise.all([
          getProperty(id as string),
          getUserProfile(userId)
        ])

        setProperty(propData)
        setUserProfile(userData)

        if (propData) {
          setInvestmentAmount(propData.minInvestment || 35000)
        }
      } catch (error) {
        console.error("Failed to load data", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id])

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-xl text-slate-500">Loading details...</p>
        </div>
        <Footer />
      </>
    )
  }

  if (!property) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-slate-500 mb-4">Property not found</p>
            <Link href="/explore" className="text-blue-600 hover:underline">
              Back to Explore
            </Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const expectedMonthlyReturn = property ? (investmentAmount * property.rentYield) / 12 / 100 : 0
  const expectedAnnualReturn = property ? (investmentAmount * property.rentYield) / 100 : 0
  const expectedAppreciation = property ? (investmentAmount * property.appreciation) / 100 : 0

  const handleInvestClick = () => {
    if (userProfile?.kycStatus !== 'VERIFIED') {
      alert("Please complete KYC verification to invest.")
      window.location.href = '/kyc'
      return
    }
    setPaymentMethod(null)
    setPaymentOrder(null)
    setShowPaymentModal(true)
  }

  const handlePaymentMethodSelect = async (method: "wallet" | "gateway") => {
    setPaymentMethod(method)
    
    if (method === "wallet") {
      if (userProfile?.walletBalance < investmentAmount) {
        alert(`Insufficient Wallet Balance (₹${userProfile.walletBalance.toLocaleString("en-IN")}). Please choose Gateway Payment or add funds.`)
        return
      }
      // Process wallet payment directly
      await processWalletPayment()
    } else if (method === "gateway") {
      // Create payment order for gateway
      await createPaymentOrder()
    }
  }

  const createPaymentOrder = async () => {
    const userId = getUserId()
    if (!userId) {
      alert("Please log in to invest.")
      return
    }

    setIsProcessing(true)
    try {
      const { createPaymentOrder } = await import("@/lib/actions")
      const propertyIdNum = typeof property.id === 'string' ? parseInt(property.id) : property.id
      const result = await createPaymentOrder(
        userId,
        investmentAmount,
        propertyIdNum,
        `Investment in ${property.name}`
      )

      if (result.success && result.orderId) {
        setPaymentOrder(result)
        setShowRazorpay(true)
      } else {
        alert(result.error || "Failed to create payment order")
      }
    } catch (error) {
      console.error(error)
      alert("Failed to initialize payment")
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePaymentSuccess = async (paymentId: string, signature: string) => {
    const userId = getUserId()
    if (!userId || !paymentOrder) {
      alert("Payment verification failed - missing data")
      return
    }

    setIsProcessing(true)
    try {
      const { verifyPayment, invest, getUserProfile } = await import("@/lib/actions")
      const propertyIdNum = typeof property.id === 'string' ? parseInt(property.id) : property.id

      // Verify payment
      const verifyResult = await verifyPayment(
        paymentOrder.orderId,
        paymentId,
        signature,
        userId,
        investmentAmount,
        propertyIdNum
      )

      if (!verifyResult.success) {
        alert(verifyResult.error || "Payment verification failed")
        return
      }

      // After payment verification, process investment
      const investResult = await invest(userId, propertyIdNum, investmentAmount)

      if (investResult.success) {
        setShowPaymentModal(false)
        setShowRazorpay(false)
        setShowSuccess(true)
        setPaymentOrder(null)

        // Refresh profile
        const updatedProfile = await getUserProfile(userId)
        setUserProfile(updatedProfile)

        setTimeout(() => setShowSuccess(false), 5000)
      } else {
        alert(investResult.error || "Investment processing failed. Payment verified but investment not processed. Contact support.")
      }
    } catch (error) {
      console.error(error)
      alert("Error processing payment. Payment verified but investment failed. Contact support.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePaymentFailure = (error: any) => {
    console.error("Payment failed:", error)
    alert(error.message || "Payment failed. Please try again.")
    setShowRazorpay(false)
    setIsProcessing(false)
  }

  const processWalletPayment = async () => {
    const userId = getUserId()
    if (!userId) {
      alert("Please log in to invest.")
      return
    }

    setIsProcessing(true)
    try {
      const { invest, getUserProfile } = await import("@/lib/actions")
      const propertyIdNum = typeof property.id === 'string' ? parseInt(property.id) : property.id
      const result = await invest(userId, propertyIdNum, investmentAmount)

      if (result.success) {
        setShowPaymentModal(false)
        setShowSuccess(true)
        
        // Refresh profile
        const updatedProfile = await getUserProfile(userId)
        setUserProfile(updatedProfile)

        setTimeout(() => setShowSuccess(false), 5000)
      } else {
        alert(result.error || "Investment failed")
      }
    } catch (e) {
      console.error(e)
      alert("An error occurred")
    } finally {
      setIsProcessing(false)
    }
  }

  const tabs = ["overview", "financials", "documents", "spv"]

  return (
    <>
      <Navbar />
      <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
          {/* Hero Image */}
          <div className="w-full h-96 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl mb-8 flex items-center justify-center text-white font-bold text-2xl relative overflow-hidden group">
            {property.image && property.image !== '/images/property-placeholder.jpg' && !property.image.startsWith('/images/prop') ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={property.image} alt={property.name} className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50 group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-blue-600/30"></div>
            )}
            <span className="relative z-10 text-center px-4">{property.city} - {property.name}</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-secondary mb-2">{property.name}</h1>
                <div className="flex items-center gap-2 text-slate-700 mb-6">
                  <MapPin size={20} />
                  <span>{property.city}</span>
                </div>

                {/* Key Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-slate-700 mb-1">Rent Yield</p>
                    <p className="text-2xl font-bold text-blue-600">{property.rentYield}%</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-slate-700 mb-1">Appreciation</p>
                    <p className="text-2xl font-bold text-green-600">{property.appreciation}%</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-slate-700 mb-1">Type</p>
                    <p className="text-lg font-bold text-purple-600">{property.type}</p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="mb-8 border-b border-slate-200">
                <div className="flex gap-8 overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-4 font-semibold capitalize transition-colors whitespace-nowrap ${activeTab === tab
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-slate-700 hover:text-secondary"
                        }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-lg text-secondary mb-3">Property Overview</h3>
                    <p className="text-slate-700 leading-relaxed">
                      This premium {property.type.toLowerCase()} property located in {property.city} offers excellent
                      returns through rental income and property appreciation. Professionally managed through our secure
                      SPV structure.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-secondary mb-3">Investment Highlights</h3>
                    <ul className="space-y-2">
                      {[
                        `${property.rentYield}% annual rental yield`,
                        `${property.appreciation}% historical appreciation`,
                        "Fractional ownership available",
                        "Professional asset management",
                        "Monthly rental distributions",
                      ].map((highlight, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-700">
                          <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === "financials" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-lg text-secondary mb-3">Appreciation Chart</h3>
                    <div className="p-6 bg-white rounded-lg border border-slate-200">
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={appreciationData}>
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
                            dataKey="value"
                            stroke="#4C7EFF"
                            dot={{ fill: "#4C7EFF", r: 4 }}
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-slate-700 mb-1">Annual Rental Return</p>
                      <p className="text-2xl font-bold text-blue-600">
                        ₹{expectedAnnualReturn.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-slate-700 mb-1">Appreciation Value</p>
                      <p className="text-2xl font-bold text-green-600">
                        ₹{expectedAppreciation.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "documents" && (
                <div className="space-y-3">
                  {["SPV Agreement", "Property Title Deed", "Valuation Report", "Investment Terms & Conditions"].map(
                    (doc, i) => (
                      <div
                        key={i}
                        className="p-4 bg-white border border-slate-200 rounded-lg flex justify-between items-center"
                      >
                        <span className="font-medium text-secondary">{doc}</span>
                        <button className="text-blue-600 hover:underline font-semibold">Download</button>
                      </div>
                    ),
                  )}
                </div>
              )}

              {activeTab === "spv" && (
                <div className="space-y-4">
                  <div className="p-6 bg-white rounded-lg border border-slate-200">
                    <h4 className="font-bold text-secondary mb-3">SPV Structure Benefits</h4>
                    <ul className="space-y-2 text-slate-600">
                      <li>✓ Direct legal ownership through SPV</li>
                      <li>✓ Enhanced legal protection</li>
                      <li>✓ Transparent financial reporting</li>
                      <li>✓ Professional asset management</li>
                      <li>✓ Regulatory compliance ensured</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* FAQ Section */}
              <div className="mt-12 p-6 bg-slate-50 rounded-lg">
                <h3 className="font-bold text-lg text-secondary mb-4">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  {[
                    { q: "How often will I receive rental income?", a: "Monthly, directly to your bank account." },
                    { q: "Can I exit my investment?", a: "Yes, through our secondary market platform." },
                    { q: "What are the fees?", a: "Transparent fee structure visible at checkout." },
                  ].map((item, i) => (
                    <div key={i} className="border-b border-slate-200 pb-4 last:border-0">
                      <p className="font-semibold text-secondary mb-2">{item.q}</p>
                      <p className="text-slate-700 text-sm">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar - Investment UI */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="font-bold text-lg text-secondary mb-6">Invest Now</h3>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-secondary mb-3">Investment Amount</label>
                  <input
                    type="range"
                    min={property.minInvestment}
                    max={property.minInvestment * 10}
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <input
                      type="number"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                      className="w-full bg-transparent text-2xl font-bold text-blue-600 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-3 mb-6 p-4 bg-slate-50 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-700">Monthly Return</span>
                    <span className="font-semibold text-secondary">
                      ₹{expectedMonthlyReturn.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-700">Annual Return</span>
                    <span className="font-semibold text-secondary">
                      ₹{expectedAnnualReturn.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-slate-200 pt-3">
                    <span className="text-slate-700">Est. Appreciation</span>
                    <span className="font-semibold text-green-600">
                      ₹{expectedAppreciation.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Funded</span>
                    <span>{Math.round(((property.fundedAmount || 0) / (property.totalValue || property.totalAmount || 1000000)) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(((property.fundedAmount || 0) / (property.totalValue || property.totalAmount || 1000000)) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <button
                  onClick={handleInvestClick}
                  className="w-full mt-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
                >
                  Proceed to Payment
                </button>

                {showSuccess && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm text-center">
                    ✓ Investment Successful! Check Dashboard.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
              <h3 className="text-xl font-bold text-secondary mb-4">Confirm Investment</h3>

              <div className="bg-slate-50 p-4 rounded-lg mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Property</span>
                  <span className="font-semibold">{property.name}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Amount</span>
                  <span className="font-semibold">₹{investmentAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-slate-200 pt-2 mt-2">
                  <span className="text-slate-600 font-medium">Total Payable</span>
                  <span className="font-bold text-blue-600">₹{investmentAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Payment Method Selection */}
              {paymentMethod === null || !paymentOrder ? (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-secondary mb-3">Choose Payment Method</label>
                  <div className="space-y-3">
                    <button
                      onClick={() => handlePaymentMethodSelect("gateway")}
                      disabled={isProcessing}
                      className="w-full p-4 border-2 border-blue-500 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-3 disabled:opacity-50"
                    >
                      <CreditCard size={24} className="text-blue-500" />
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-secondary">Payment Gateway</p>
                        <p className="text-xs text-slate-600">Pay via UPI, Cards, Net Banking</p>
                      </div>
                    </button>
                    <button
                      onClick={() => handlePaymentMethodSelect("wallet")}
                      disabled={isProcessing || (userProfile?.walletBalance || 0) < investmentAmount}
                      className="w-full p-4 border-2 border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Wallet size={24} className="text-slate-500" />
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-secondary">Wallet Balance</p>
                        <p className="text-xs text-slate-600">
                          ₹{(userProfile?.walletBalance || 0).toLocaleString("en-IN")} available
                          {(userProfile?.walletBalance || 0) < investmentAmount && (
                            <span className="text-red-500 ml-1">(Insufficient)</span>
                          )}
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <p className="text-sm text-slate-600 mb-4 text-center">
                    {paymentMethod === "gateway" 
                      ? "Redirecting to payment gateway..." 
                      : "Processing wallet payment..."}
                  </p>
                  {isProcessing && (
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-3">
                {paymentMethod === null || !paymentOrder ? (
                  <>
                    <button
                      onClick={() => setShowPaymentModal(false)}
                      disabled={isProcessing}
                      className="w-full py-3 text-slate-600 font-semibold hover:bg-slate-50 rounded-lg"
                    >
                      Cancel
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        )}

        {/* Razorpay Checkout */}
        {showRazorpay && paymentOrder && (
          <RazorpayCheckout
            amount={paymentOrder.amount}
            orderId={paymentOrder.orderId}
            keyId={paymentOrder.key}
            description={`Investment in ${property.name}`}
            onSuccess={handlePaymentSuccess}
            onFailure={handlePaymentFailure}
            onClose={() => {
              setShowRazorpay(false)
              setPaymentOrder(null)
              setIsProcessing(false)
            }}
          />
        )}
      </main>
      <Footer />
    </>
  )
}
