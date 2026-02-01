import type React from "react"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="glass rounded-xl p-6 hover:shadow-lg transition-all duration-300">
      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-lg text-secondary mb-2">{title}</h3>
      <p className="text-slate-700 text-sm leading-relaxed">{description}</p>
    </div>
  )
}
