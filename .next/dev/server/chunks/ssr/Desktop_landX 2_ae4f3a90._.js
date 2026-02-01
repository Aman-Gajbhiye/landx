module.exports = [
"[project]/Desktop/landX 2/lib/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"0059ed7375f9a78f1243d45ee1c258b6827dcd4240":"getProperties","4019cce03c1de3f4c68e3659af30c1cb5600955fa7":"getUserProfile","4046d29437966a0ddf15f6c8972824c2c42ac17823":"getUserInvestments","40e0b680a0e7c5a09f80cd3106035b2d098e19847e":"getProperty","6024de9d26b9a3f28fa773cf311355925ca56bc171":"addFunds","607a230ad746394dda3e8952104d1a000858170d53":"submitKYC","70237dbbc8de219de0c7757c6fdcedf231b121d424":"invest"},"",""] */ __turbopack_context__.s([
    "addFunds",
    ()=>addFunds,
    "getProperties",
    ()=>getProperties,
    "getProperty",
    ()=>getProperty,
    "getUserInvestments",
    ()=>getUserInvestments,
    "getUserProfile",
    ()=>getUserProfile,
    "invest",
    ()=>invest,
    "submitKYC",
    ()=>submitKYC
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$landX__2$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/landX 2/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$landX__2$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/landX 2/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$landX__2$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/landX 2/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
const API_URL = 'http://localhost:4000/api';
async function getProperties() {
    try {
        const res = await fetch(`${API_URL}/properties`, {
            cache: 'no-store'
        });
        if (!res.ok) throw new Error('Failed to fetch properties');
        return res.json();
    } catch (error) {
        console.error('Error fetching properties:', error);
        return [];
    }
}
async function getProperty(id) {
    try {
        const res = await fetch(`${API_URL}/properties/${id}`, {
            cache: 'no-store'
        });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        console.error('Error fetching property:', error);
        return null;
    }
}
async function submitKYC(userId, formData) {
    try {
        const res = await fetch(`${API_URL}/kyc`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId
            })
        });
        if (!res.ok) throw new Error('KYC submission failed');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$landX__2$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/kyc');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$landX__2$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/dashboard');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$landX__2$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/explore');
        return {
            success: true
        };
    } catch (error) {
        console.error('Error submitting KYC:', error);
        return {
            success: false,
            error: 'Failed to submit KYC'
        };
    }
}
async function addFunds(userId, amount) {
    try {
        const res = await fetch(`${API_URL}/wallet/add-funds`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId,
                amount
            })
        });
        if (!res.ok) throw new Error('Failed to add funds');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$landX__2$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/dashboard');
        return {
            success: true
        };
    } catch (error) {
        console.error('Error adding funds:', error);
        return {
            success: false,
            error: 'Failed to add funds'
        };
    }
}
async function getUserProfile(userId) {
    try {
        const res = await fetch(`${API_URL}/users/${userId}`, {
            cache: 'no-store'
        });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        console.error('Error fetching profile:', error);
        return null;
    }
}
async function invest(userId, propertyId, amount) {
    try {
        const res = await fetch(`${API_URL}/invest`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId,
                propertyId,
                amount
            })
        });
        const data = await res.json();
        if (!res.ok) {
            return {
                success: false,
                error: data.error || 'Failed to invest'
            };
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$landX__2$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/dashboard');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$landX__2$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/explore');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$landX__2$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/property/${propertyId}`);
        return {
            success: true,
            investment: data.investment
        };
    } catch (error) {
        console.error('Error investing:', error);
        return {
            success: false,
            error: 'Failed to invest'
        };
    }
}
async function getUserInvestments(userId) {
    try {
        const res = await fetch(`${API_URL}/investments?userId=${userId}`, {
            cache: 'no-store'
        });
        if (!res.ok) return [];
        return res.json();
    } catch (error) {
        console.error('Error fetching user investments:', error);
        return [];
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$landX__2$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getProperties,
    getProperty,
    submitKYC,
    addFunds,
    getUserProfile,
    invest,
    getUserInvestments
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$landX__2$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getProperties, "0059ed7375f9a78f1243d45ee1c258b6827dcd4240", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$landX__2$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getProperty, "40e0b680a0e7c5a09f80cd3106035b2d098e19847e", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$landX__2$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(submitKYC, "607a230ad746394dda3e8952104d1a000858170d53", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$landX__2$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(addFunds, "6024de9d26b9a3f28fa773cf311355925ca56bc171", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$landX__2$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getUserProfile, "4019cce03c1de3f4c68e3659af30c1cb5600955fa7", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$landX__2$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(invest, "70237dbbc8de219de0c7757c6fdcedf231b121d424", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$landX__2$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getUserInvestments, "4046d29437966a0ddf15f6c8972824c2c42ac17823", null);
}),
"[project]/Desktop/landX 2/.next-internal/server/app/dashboard/page/actions.js { ACTIONS_MODULE0 => \"[project]/Desktop/landX 2/lib/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$landX__2$2f$lib$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/landX 2/lib/actions.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
}),
"[project]/Desktop/landX 2/.next-internal/server/app/dashboard/page/actions.js { ACTIONS_MODULE0 => \"[project]/Desktop/landX 2/lib/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "0059ed7375f9a78f1243d45ee1c258b6827dcd4240",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$landX__2$2f$lib$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getProperties"],
    "4019cce03c1de3f4c68e3659af30c1cb5600955fa7",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$landX__2$2f$lib$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserProfile"],
    "4046d29437966a0ddf15f6c8972824c2c42ac17823",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$landX__2$2f$lib$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserInvestments"],
    "40e0b680a0e7c5a09f80cd3106035b2d098e19847e",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$landX__2$2f$lib$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getProperty"],
    "6024de9d26b9a3f28fa773cf311355925ca56bc171",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$landX__2$2f$lib$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["addFunds"],
    "607a230ad746394dda3e8952104d1a000858170d53",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$landX__2$2f$lib$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["submitKYC"],
    "70237dbbc8de219de0c7757c6fdcedf231b121d424",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$landX__2$2f$lib$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["invest"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$landX__2$2f2e$next$2d$internal$2f$server$2f$app$2f$dashboard$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$Desktop$2f$landX__2$2f$lib$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/Desktop/landX 2/.next-internal/server/app/dashboard/page/actions.js { ACTIONS_MODULE0 => "[project]/Desktop/landX 2/lib/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$landX__2$2f$lib$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/landX 2/lib/actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=Desktop_landX%202_ae4f3a90._.js.map