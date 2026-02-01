module.exports = [
"[project]/lib/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"000e67e8dcbd0c2e0f0dc39b71d4153f19d00db378":"getProperties","4043e4cf325034b94ff3880c9568cfcaa3b3f889a0":"getUserInvestments","4051bd4505312ea60047d5964f09d6aac50239f7c1":"getUserProfile","40f0dce49d39c4c435a187205e8b444cd541d639aa":"getProperty","601cb012f4f1004444a3b9dde97a0b48fa63647abc":"addFunds","606d8d59d2d107a4c066e9304255b52e0ecde82c2e":"submitKYC","70a344671d1a7887505c626cc2490635876ff31821":"invest"},"",""] */ __turbopack_context__.s([
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
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
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/kyc');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/dashboard');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/explore');
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
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/dashboard');
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
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/dashboard');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/explore');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/property/${propertyId}`);
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
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getProperties,
    getProperty,
    submitKYC,
    addFunds,
    getUserProfile,
    invest,
    getUserInvestments
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getProperties, "000e67e8dcbd0c2e0f0dc39b71d4153f19d00db378", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getProperty, "40f0dce49d39c4c435a187205e8b444cd541d639aa", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(submitKYC, "606d8d59d2d107a4c066e9304255b52e0ecde82c2e", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(addFunds, "601cb012f4f1004444a3b9dde97a0b48fa63647abc", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getUserProfile, "4051bd4505312ea60047d5964f09d6aac50239f7c1", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(invest, "70a344671d1a7887505c626cc2490635876ff31821", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getUserInvestments, "4043e4cf325034b94ff3880c9568cfcaa3b3f889a0", null);
}),
"[project]/.next-internal/server/app/property/[id]/page/actions.js { ACTIONS_MODULE0 => \"[project]/lib/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/actions.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
}),
"[project]/.next-internal/server/app/property/[id]/page/actions.js { ACTIONS_MODULE0 => \"[project]/lib/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "000e67e8dcbd0c2e0f0dc39b71d4153f19d00db378",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getProperties"],
    "4043e4cf325034b94ff3880c9568cfcaa3b3f889a0",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserInvestments"],
    "4051bd4505312ea60047d5964f09d6aac50239f7c1",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserProfile"],
    "40f0dce49d39c4c435a187205e8b444cd541d639aa",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getProperty"],
    "601cb012f4f1004444a3b9dde97a0b48fa63647abc",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["addFunds"],
    "606d8d59d2d107a4c066e9304255b52e0ecde82c2e",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["submitKYC"],
    "70a344671d1a7887505c626cc2490635876ff31821",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["invest"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$property$2f5b$id$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$lib$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/property/[id]/page/actions.js { ACTIONS_MODULE0 => "[project]/lib/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_552ff2cd._.js.map