import { useEffect, useRef } from "react";
import { useSubscriptionStore } from "../../store/subscriptionStore";
import type { RawSubscribedModules } from "../../utils/productClassifier";

export function useBootSubscription(
  subscribedModules: RawSubscribedModules | null | undefined,
  authLoading: boolean,
) {
  const setSubscription = useSubscriptionStore((s) => s.setSubscription);
  const clearSubscription = useSubscriptionStore((s) => s.clearSubscription);
  const loadedRef = useRef<string>("");

  useEffect(() => {
    if (authLoading) return;

    if (!subscribedModules) {
      clearSubscription();
      loadedRef.current = "";
      return;
    }

    const key = JSON.stringify(subscribedModules);
    if (loadedRef.current === key) return; 

    setSubscription(subscribedModules);
    loadedRef.current = key;
  }, [authLoading, subscribedModules]);
}