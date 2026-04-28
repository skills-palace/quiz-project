"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasActiveLearningAccess = exports.getExplorerTrialEndIso = exports.getExplorerTrialEndDate = void 0;
/** Explorer free tier: 7 days from account creation (or from stored end date). */
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
function getExplorerTrialEndDate(user) {
    var _a;
    const plan = (_a = user.subscriptionPlan) !== null && _a !== void 0 ? _a : "explorer";
    if (plan !== "explorer")
        return null;
    if (user.explorerTrialEndsAt)
        return new Date(user.explorerTrialEndsAt);
    if (user.createdAt)
        return new Date(new Date(user.createdAt).getTime() + WEEK_MS);
    return null;
}
exports.getExplorerTrialEndDate = getExplorerTrialEndDate;
/** ISO string for API payloads, or null if not on Explorer or no date. */
function getExplorerTrialEndIso(user) {
    const d = getExplorerTrialEndDate(user);
    return d ? d.toISOString() : null;
}
exports.getExplorerTrialEndIso = getExplorerTrialEndIso;
/** Learner always has access; Explorer only while trial end is in the future (or no end computed). */
function hasActiveLearningAccess(user) {
    var _a;
    const plan = (_a = user.subscriptionPlan) !== null && _a !== void 0 ? _a : "explorer";
    if (plan === "learner")
        return true;
    const end = getExplorerTrialEndDate(user);
    if (!end)
        return true;
    return end.getTime() > Date.now();
}
exports.hasActiveLearningAccess = hasActiveLearningAccess;
