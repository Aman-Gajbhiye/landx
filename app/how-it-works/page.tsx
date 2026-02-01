"use client"

import Navbar from "@/components/layouts/navbar"
import Footer from "@/components/layouts/footer"

export default function HowItWorksPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-secondary mb-8">How It Works</h1>
                    <div className="space-y-8">
                        <section>
                            <h2 className="text-2xl font-semibold text-secondary mb-4">1. Browse Properties</h2>
                            <p className="text-slate-600">Explore our curated list of premium real estate properties. We select high-growth assets across top cities.</p>
                        </section>
                        <section>
                            <h2 className="text-2xl font-semibold text-secondary mb-4">2. Invest Fractionally</h2>
                            <p className="text-slate-600">Buy fractions of a property starting with as little as ₹35,000. You become a co-owner of the asset.</p>
                        </section>
                        <section>
                            <h2 className="text-2xl font-semibold text-secondary mb-4">3. Earn Regular Returns</h2>
                            <p className="text-slate-600">Receive monthly rental income directly into your bank account. Monitor your portfolio via the dashboard.</p>
                        </section>
                        <section>
                            <h2 className="text-2xl font-semibold text-secondary mb-4">4. Exit with Appreciation</h2>
                            <p className="text-slate-600">Sell your fractions on our secondary market or wait for the property sale to realize capital appreciation.</p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
