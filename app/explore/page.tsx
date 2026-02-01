"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Navbar from "@/components/layouts/navbar"
import Footer from "@/components/layouts/footer"
import PropertyCard from "@/components/cards/property-card"
import { Filter } from "lucide-react"

type PropertyType = "All" | "Residential" | "Commercial" | "Mixed Use"
type YieldRange = "All" | "5-6%" | "6-7%" | "7-8%" | "8-9%"
type InvestmentRange = "All" | "₹30k-50k" | "₹50k-75k" | "₹75k-100k" | "₹100k+"

function ExploreContent() {
    const searchParams = useSearchParams()
    const cityParam = searchParams.get("city")

    const [selectedCity, setSelectedCity] = useState("All")
    const [selectedType, setSelectedType] = useState<PropertyType>("All")
    const [selectedYield, setSelectedYield] = useState<YieldRange>("All")
    const [selectedInvestment, setSelectedInvestment] = useState<InvestmentRange>("All")

    const [properties, setProperties] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    // Load properties from the database
    useEffect(() => {
        async function loadProperties() {
            try {
                const data = await import("@/lib/actions").then(mod => mod.getProperties())
                // specific mapping if needed, e.g. ID to string
                const formatted = data.map((p: any) => ({
                    ...p,
                    id: p.id.toString(),
                }))
                setProperties(formatted)
                
                // Set city from URL if present and available
                if (cityParam) {
                    const availableCities = ["All", ...new Set(formatted.map((p: any) => p.city as string))]
                    if (availableCities.includes(cityParam)) {
                        setSelectedCity(cityParam)
                    }
                }
            } catch (error) {
                console.error("Failed to load properties", error)
            } finally {
                setLoading(false)
            }
        }
        loadProperties()
    }, [cityParam]) // Re-run if param changes (though usually just on mount)

    const cities = ["All", ...new Set(properties.map((p) => p.city as string))]
    const propertyTypes: PropertyType[] = ["All", "Residential", "Commercial", "Mixed Use"]
    const yieldRanges: YieldRange[] = ["All", "5-6%", "6-7%", "7-8%", "8-9%"]
    const investmentRanges: InvestmentRange[] = ["All", "₹30k-50k", "₹50k-75k", "₹75k-100k", "₹100k+"]

    const filteredProperties = properties.filter((prop) => {
        if (selectedCity !== "All" && prop.city !== selectedCity) return false
        if (selectedType !== "All" && prop.type !== selectedType) return false

        if (selectedYield !== "All") {
            const [min, max] = selectedYield.slice(0, -1).split("-").map(Number)
            if (prop.rentYield < min || prop.rentYield > max) return false
        }

        if (selectedInvestment !== "All") {
            const ranges: Record<InvestmentRange, [number, number]> = {
                All: [0, Number.POSITIVE_INFINITY],
                "₹30k-50k": [30000, 50000],
                "₹50k-75k": [50000, 75000],
                "₹75k-100k": [75000, 100000],
                "₹100k+": [100000, Number.POSITIVE_INFINITY],
            }
            const [min, max] = ranges[selectedInvestment]
            if (prop.minInvestment < min || prop.minInvestment > max) return false
        }

        return true
    })

    return (
        <>
            <Navbar />
            <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12">
                        <h1 className="text-3xl sm:text-4xl font-bold text-secondary mb-2">Explore Properties</h1>
                        <p className="text-slate-700">Discover premium real estate investment opportunities</p>
                    </div>

                    {/* Filters */}
                    <div className="mb-12 p-6 bg-white rounded-xl border border-slate-200">
                        <div className="flex items-center gap-2 mb-6">
                            <Filter size={20} className="text-blue-500" />
                            <h3 className="font-bold text-secondary">Filters</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* City Filter */}
                            <div>
                                <label className="block text-sm font-semibold text-secondary mb-2">City</label>
                                <select
                                    value={selectedCity}
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {cities.map((city) => (
                                        <option key={city} value={city}>
                                            {city}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Property Type Filter */}
                            <div>
                                <label className="block text-sm font-semibold text-secondary mb-2">Property Type</label>
                                <select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value as PropertyType)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {propertyTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Yield Filter */}
                            <div>
                                <label className="block text-sm font-semibold text-secondary mb-2">Rent Yield</label>
                                <select
                                    value={selectedYield}
                                    onChange={(e) => setSelectedYield(e.target.value as YieldRange)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {yieldRanges.map((range) => (
                                        <option key={range} value={range}>
                                            {range}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Investment Filter */}
                            <div>
                                <label className="block text-sm font-semibold text-secondary mb-2">Min Investment</label>
                                <select
                                    value={selectedInvestment}
                                    onChange={(e) => setSelectedInvestment(e.target.value as InvestmentRange)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {investmentRanges.map((range) => (
                                        <option key={range} value={range}>
                                            {range}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Properties Grid */}
                    <div>
                        <p className="text-sm text-slate-700 mb-6">Showing {filteredProperties.length} properties</p>
                        {loading ? (
                            <div className="py-20 text-center text-slate-500">Loading properties...</div>
                        ) : filteredProperties.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProperties.map((property) => (
                                    <PropertyCard key={property.id} {...property} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-slate-700 text-lg">No properties match your filters.</p>
                                <button
                                    onClick={() => {
                                        setSelectedCity("All")
                                        setSelectedType("All")
                                        setSelectedYield("All")
                                        setSelectedInvestment("All")
                                    }}
                                    className="mt-4 px-6 py-2 text-blue-500 font-semibold hover:underline"
                                    >
                                    Reset Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}

export default function ExplorePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ExploreContent />
        </Suspense>
    )
}
