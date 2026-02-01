'use client'

export function getUserId(): number | null {
    if (typeof window === 'undefined') return null
    const userStr = localStorage.getItem('user')
    if (!userStr) return null
    try {
        const user = JSON.parse(userStr)
        return user.id || null
    } catch {
        return null
    }
}

export function getUser(): any | null {
    if (typeof window === 'undefined') return null
    const userStr = localStorage.getItem('user')
    if (!userStr) return null
    try {
        return JSON.parse(userStr)
    } catch {
        return null
    }
}

export function isAuthenticated(): boolean {
    return getUserId() !== null
}

