/** Explorer free tier: 7 days from account creation (or from stored end date). */
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

type UserLike = {
  subscriptionPlan?: string;
  explorerTrialEndsAt?: Date | null;
  createdAt?: Date;
};

export function getExplorerTrialEndDate(user: UserLike): Date | null {
  const plan = user.subscriptionPlan ?? "explorer";
  if (plan !== "explorer") return null;
  if (user.explorerTrialEndsAt) return new Date(user.explorerTrialEndsAt);
  if (user.createdAt) return new Date(new Date(user.createdAt).getTime() + WEEK_MS);
  return null;
}

/** ISO string for API payloads, or null if not on Explorer or no date. */
export function getExplorerTrialEndIso(user: UserLike): string | null {
  const d = getExplorerTrialEndDate(user);
  return d ? d.toISOString() : null;
}

/** Learner always has access; Explorer only while trial end is in the future (or no end computed). */
export function hasActiveLearningAccess(user: UserLike): boolean {
  const plan = user.subscriptionPlan ?? "explorer";
  if (plan === "learner") return true;
  const end = getExplorerTrialEndDate(user);
  if (!end) return true;
  return end.getTime() > Date.now();
}
