"use client"

import Navbar from "@/components/layouts/navbar"
import Footer from "@/components/layouts/footer"
import FeatureCard from "@/components/cards/feature-card"
import { ArrowRight, Building2, TrendingUp, Lock, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function Home() {
    const features = [
        {
            icon: <Building2 size={24} />,
            title: "Fractional Ownership",
            description: "Own fractions of premium properties with just ₹35,000 investment.",
        },
        {
            icon: <TrendingUp size={24} />,
            title: "Monthly Rental Returns",
            description: "Earn consistent monthly rental income from your investments.",
        },
        {
            icon: <BarChart3 size={24} />,
            title: "Property Appreciation",
            description: "Benefit from property value appreciation over time.",
        },
        {
            icon: <Lock size={24} />,
            title: "Secure SPV Structure",
            description: "Assets protected through dedicated SPV structures and legal framework.",
        },
    ]

    const testimonials = [
        {
            name: "Rajesh Kumar",
            role: "Investor",
            content: "LandX made real estate investing accessible and transparent. Highly recommended!",
            avatar: "🧑‍💼",
        },
        {
            name: "Priya Sharma",
            role: "Entrepreneur",
            content: "Great returns and excellent customer service. This is the future of investing.",
            avatar: "👩‍💼",
        },
        {
            name: "Amit Patel",
            role: "Corporate",
            content: "Finally a platform that makes diversification simple and affordable.",
            avatar: "🧑‍💼",
        },
    ]

    const cities = ["Mumbai", "Bangalore", "Delhi", "Hyderabad", "Pune", "Chennai"]

    return (
        <>
            <Navbar />
            <main className="min-h-screen">
                {/* Hero Section */}
                <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="animate-fade-in-up">
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary mb-6 leading-tight">
                                    Invest in Real Estate,{" "}
                                    <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                                        Fractionalized
                                    </span>
                                </h1>
                                <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
                                    Own premium properties across India with investments starting from ₹35,000. Earn rental returns and
                                    benefit from property appreciation.
                                </p>
                                <div className="flex gap-4 flex-wrap">
                                    <Link href="/explore">
                                        <button className="px-8 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all flex items-center gap-2">
                                            Explore Properties <ArrowRight size={20} />
                                        </button>
                                    </Link>
                                    <Link href="/how-it-works">
                                        <button className="px-8 py-3 border-2 border-blue-500 text-blue-500 rounded-lg font-semibold hover:bg-blue-50 transition-all">
                                            Learn More
                                        </button>
                                    </Link>
                                </div>
                            </div>

                            {/* Illustration placeholder */}
                            <div className="hidden lg:flex items-center justify-center">
                                <div className="relative w-96 h-96">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-50 rounded-3xl"></div>
                                    <div className="absolute top-12 right-12 w-32 h-32 bg-blue-400 rounded-2xl opacity-20 animate-bounce"></div>
                                    <div className="absolute bottom-12 left-12 w-40 h-40 bg-blue-300 rounded-3xl opacity-10 animate-pulse"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Building2 size={120} className="text-blue-500 opacity-30" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-slate-50">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl font-bold text-secondary mb-4">Why Choose LandX?</h2>
                            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                                Everything you need for smart real estate investments
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map((feature, i) => (
                                <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                                    <FeatureCard {...feature} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Cities Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl font-bold text-secondary mb-4">Invest Across India</h2>
                            <p className="text-lg text-slate-600">Properties available in premium cities</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {cities.map((city) => (
                                <Link key={city} href={`/explore?city=${city}`}>
                                    <div
                                        className="p-6 bg-white rounded-lg border border-slate-200 text-center hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
                                    >
                                        <p className="font-semibold text-secondary">{city}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl font-bold text-secondary mb-4">What Investors Say</h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {testimonials.map((testimonial, i) => (
                                <div key={i} className="glass rounded-xl p-8">
                                    <div className="flex gap-4 mb-4">
                                        <div className="text-4xl">{testimonial.avatar}</div>
                                        <div>
                                            <h4 className="font-bold text-secondary">{testimonial.name}</h4>
                                            <p className="text-sm text-slate-600">{testimonial.role}</p>
                                        </div>
                                    </div>
                                    <p className="text-slate-600 italic">{testimonial.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-12 text-white text-center">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Start Investing?</h2>
                        <p className="text-lg mb-8 opacity-90">Join thousands of investors building wealth through LandX.</p>
                        <Link href="/explore">
                            <button className="px-10 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-slate-100 transition-colors">
                                Start Investing Now
                            </button>
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
