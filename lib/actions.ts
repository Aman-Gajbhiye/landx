'use server'

import { revalidatePath } from 'next/cache'

const API_URL = 'http://localhost:4000/api'

export async function getProperties() {
    try {
        const res = await fetch(`${API_URL}/properties`, { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to fetch properties')
        return res.json()
    } catch (error) {
        console.error('Error fetching properties:', error)
        return []
    }
}

export async function getProperty(id: string) {
    try {
        const res = await fetch(`${API_URL}/properties/${id}`, { cache: 'no-store' })
        if (!res.ok) return null
        return res.json()
    } catch (error) {
        console.error('Error fetching property:', error)
        return null
    }
}

// Simplified KYC submission
export async function submitKYC(userId: number, formData: any) {
    try {
        const res = await fetch(`${API_URL}/kyc`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })
        })

        if (!res.ok) throw new Error('KYC submission failed')

        revalidatePath('/kyc')
        revalidatePath('/dashboard')
        revalidatePath('/explore')
        return { success: true }
    } catch (error) {
        console.error('Error submitting KYC:', error)
        return { success: false, error: 'Failed to submit KYC' }
    }
}

// Wallet Functions
export async function addFunds(userId: number, amount: number) {
    try {
        const res = await fetch(`${API_URL}/wallet/add-funds`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, amount })
        })

        if (!res.ok) throw new Error('Failed to add funds')

        revalidatePath('/dashboard')
        return { success: true }
    } catch (error) {
        console.error('Error adding funds:', error)
        return { success: false, error: 'Failed to add funds' }
    }
}

export async function withdrawRent(userId: number, amount: number) {
    try {
        const res = await fetch(`${API_URL}/wallet/withdraw-rent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, amount })
        })

        if (!res.ok) throw new Error('Failed to withdraw rent')

        revalidatePath('/dashboard')
        return { success: true }
    } catch (error) {
        console.error('Error withdrawing rent:', error)
        return { success: false, error: 'Failed to withdraw rent' }
    }
}

export async function getUserProfile(userId: number) {
    try {
        const res = await fetch(`${API_URL}/users/${userId}`, { cache: 'no-store' })
        if (!res.ok) return null
        return res.json()
    } catch (error) {
        console.error('Error fetching profile:', error)
        return null
    }
}

export async function invest(userId: number, propertyId: number, amount: number) {
    try {
        const res = await fetch(`${API_URL}/invest`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, propertyId, amount })
        })

        const data = await res.json()

        if (!res.ok) {
            return { success: false, error: data.error || 'Failed to invest' }
        }

        revalidatePath('/dashboard')
        revalidatePath('/explore')
        revalidatePath(`/property/${propertyId}`)

        return { success: true, investment: data.investment }
    } catch (error) {
        console.error('Error investing:', error)
        return { success: false, error: 'Failed to invest' }
    }
}

export async function getUserInvestments(userId: number) {
    try {
        const res = await fetch(`${API_URL}/investments?userId=${userId}`, { cache: 'no-store' })
        if (!res.ok) return []
        return res.json()
    } catch (error) {
        console.error('Error fetching user investments:', error)
        return []
    }
}

export async function updateUserProfile(userId: number, data: { name?: string; email?: string }) {
    try {
        const res = await fetch(`${API_URL}/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })

        if (!res.ok) {
            const errorData = await res.json()
            throw new Error(errorData.error || 'Failed to update profile')
        }

        const updatedUser = await res.json()
        revalidatePath('/account')
        revalidatePath('/dashboard')
        return { success: true, user: updatedUser }
    } catch (error: any) {
        console.error('Error updating profile:', error)
        return { success: false, error: error.message || 'Failed to update profile' }
    }
}

export async function createPaymentOrder(userId: number, amount: number, propertyId?: number, description?: string) {
    try {
        const res = await fetch(`${API_URL}/payments/create-order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, amount, propertyId, description })
        })

        if (!res.ok) {
            const errorData = await res.json()
            throw new Error(errorData.error || 'Failed to create payment order')
        }

        return await res.json()
    } catch (error: any) {
        console.error('Error creating payment order:', error)
        return { success: false, error: error.message || 'Failed to create payment order' }
    }
}

export async function verifyPayment(orderId: string, paymentId: string, signature: string, userId: number, amount: number, propertyId?: number) {
    try {
        const res = await fetch(`${API_URL}/payments/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId, paymentId, signature, userId, amount, propertyId })
        })

        if (!res.ok) {
            const errorData = await res.json()
            throw new Error(errorData.error || 'Payment verification failed')
        }

        const data = await res.json()
        revalidatePath('/dashboard')
        revalidatePath('/account')
        if (propertyId) {
            revalidatePath(`/property/${propertyId}`)
        }
        return data
    } catch (error: any) {
        console.error('Error verifying payment:', error)
        return { success: false, error: error.message || 'Payment verification failed' }
    }
}
