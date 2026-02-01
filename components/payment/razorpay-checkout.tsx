"use client"

import { useEffect, useState } from "react"

interface RazorpayCheckoutProps {
    amount: number
    orderId: string
    keyId: string
    currency?: string
    description?: string
    onSuccess: (paymentId: string, signature: string) => void
    onFailure: (error: any) => void
    onClose?: () => void
}

declare global {
    interface Window {
        Razorpay: any
    }
}

export default function RazorpayCheckout({
    amount,
    orderId,
    keyId,
    currency = "INR",
    description = "Payment",
    onSuccess,
    onFailure,
    onClose
}: RazorpayCheckoutProps) {
    const [razorpayLoaded, setRazorpayLoaded] = useState(false)

    useEffect(() => {
        // Load Razorpay script
        if (window.Razorpay) {
            setRazorpayLoaded(true)
            openRazorpay()
            return
        }

        const script = document.createElement("script")
        script.src = "https://checkout.razorpay.com/v1/checkout.js"
        script.async = true
        script.onload = () => {
            setRazorpayLoaded(true)
            openRazorpay()
        }
        script.onerror = () => {
            onFailure(new Error("Failed to load Razorpay SDK"))
        }
        document.body.appendChild(script)

        return () => {
            // Cleanup
            if (document.body.contains(script)) {
                document.body.removeChild(script)
            }
        }
    }, [])

    useEffect(() => {
        if (razorpayLoaded && window.Razorpay) {
            openRazorpay()
        }
    }, [razorpayLoaded, orderId])

    const openRazorpay = () => {
        if (!window.Razorpay) {
            return
        }

        const options = {
            key: keyId,
            amount: amount,
            currency: currency,
            name: "LandX",
            description: description,
            order_id: orderId,
            handler: function (response: any) {
                if (response.razorpay_payment_id && response.razorpay_signature) {
                    onSuccess(response.razorpay_payment_id, response.razorpay_signature)
                } else {
                    onFailure(new Error("Invalid payment response"))
                }
            },
            prefill: {
                name: "",
                email: "",
                contact: ""
            },
            notes: {
                orderId: orderId
            },
            theme: {
                color: "#3B82F6"
            },
            modal: {
                ondismiss: function() {
                    if (onClose) {
                        onClose()
                    }
                }
            }
        }

        try {
            const razorpay = new window.Razorpay(options)
            razorpay.open()
        } catch (error: any) {
            onFailure(error)
        }
    }

    return null
}
