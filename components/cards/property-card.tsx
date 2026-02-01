import Link from "next/link"
import { MapPin, TrendingUp, BarChart3, ArrowRight } from "lucide-react"

interface PropertyCardProps {
    id: string
    city: string
    name: string
    type: string
    rentYield: number
    minInvestment: number
    appreciation: number
    image: string
}

export default function PropertyCard({
    id,
    city,
    name,
    type,
    rentYield,
    minInvestment,
    appreciation,
    image,
}: PropertyCardProps) {
    return (
        <div className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-lg transition-all duration-300 flex flex-col h-full group">
            {/* Image Placeholder - since we don't have real images yet */}
            <div className="h-48 bg-slate-200 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium">
                    Property Image
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-blue-600">
                    {type}
                </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-2">
                    <div>
                        <h3 className="font-bold text-lg text-secondary group-hover:text-blue-600 transition-colors">{name}</h3>
                        <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
                            <MapPin size={14} />
                            <span>{city}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 py-4 my-4 border-y border-slate-100">
                    <div className="text-center">
                        <p className="text-xs text-slate-500 mb-1">Rent Yield</p>
                        <p className="font-semibold text-green-600">{rentYield}%</p>
                    </div>
                    <div className="text-center border-x border-slate-100">
                        <p className="text-xs text-slate-500 mb-1">Appreciation</p>
                        <p className="font-semibold text-blue-600">{appreciation}%</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-slate-500 mb-1">Min Invest</p>
                        <p className="font-semibold text-slate-700">₹{(minInvestment / 1000).toFixed(0)}k</p>
                    </div>
                </div>

                <div className="mt-auto pt-2">
                    <Link href={`/property/${id}`}>
                        <button className="w-full bg-slate-50 text-secondary hover:bg-blue-500 hover:text-white border border-slate-200 hover:border-blue-500 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2">
                            View Details <ArrowRight size={16} />
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
