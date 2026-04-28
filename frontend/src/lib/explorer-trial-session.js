/** sessionStorage key: user dismissed Explorer trial banner for current browser tab session */
export const EXPLORER_TRIAL_BANNER_HIDE_KEY = "sp_hide_explorer_trial_banner";

/** Call after successful sign-in so the trial banner shows again (until user dismisses). */
export function resetExplorerTrialBannerVisibility() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(EXPLORER_TRIAL_BANNER_HIDE_KEY);
    window.dispatchEvent(new CustomEvent("sp-explorer-trial-banner-reset"));
  } catch {
    /* ignore */
  }
}
