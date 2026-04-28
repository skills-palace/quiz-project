import { store } from "./store";
import { setAuth } from "./slices/app-slice";

/**
 * Hydrate auth slice from localStorage. Lives outside the slice to avoid a
 * circular import: store → app-slice → store.
 */
export function authenticate() {
  const auth = localStorage.auth;
  try {
    const parseUser = JSON.parse(auth);

    store.dispatch(
      setAuth({
        status: "auth",
        user: {
          username: parseUser.username,
          subscriptionPlan: parseUser.subscriptionPlan,
          explorerTrialEndsAt: parseUser.explorerTrialEndsAt,
        },
      })
    );
  } catch (error) {
    localStorage.removeItem("auth");
    store.dispatch(
      setAuth({
        status: "noauth",
        user: {},
      })
    );
  }
}
