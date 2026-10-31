"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  ANALYTICS_CONSENT_EVENT,
  cleanAnalyticsText,
  trackAnalyticsEvent,
  trackMeaningfulEngagement,
} from "@/lib/analytics";

const VISIBLE_TIME_TARGET_MS = 30_000;
const SCROLL_THRESHOLDS = [50, 75, 90] as const;

function ctaLocation(element: HTMLElement) {
  if (element.dataset.ctaLocation) return element.dataset.ctaLocation;
  if (element.closest("header")) return "header";
  if (element.closest("footer")) return "footer";
  if (element.closest("[data-footer-guide-cta]")) return "footer_guide";
  if (element.closest(".circle-sticky-cta")) return "mobile_sticky";
  return "page_content";
}

export function EngagementTracker() {
  const pathname = usePathname();

  useEffect(() => {
    let visibleMilliseconds = 0;
    let visibleStartedAt = document.visibilityState === "visible" ? Date.now() : null;
    let visibleTimer: number | null = null;
    let visibleTimeRecorded = false;
    const recordedScrollThresholds = new Set<number>();
    const recordedForms = new Set<string>();

    function recordVisibleTime() {
      if (visibleStartedAt === null) return;
      visibleMilliseconds += Date.now() - visibleStartedAt;
      visibleStartedAt = null;
    }

    function scheduleVisibleTime() {
      if (
        visibleTimeRecorded ||
        visibleTimer !== null ||
        document.visibilityState !== "visible"
      ) {
        return;
      }

      visibleStartedAt = Date.now();
      const remaining = Math.max(
        0,
        VISIBLE_TIME_TARGET_MS - visibleMilliseconds,
      );
      visibleTimer = window.setTimeout(() => {
        recordVisibleTime();
        visibleTimer = null;
        visibleTimeRecorded = true;
        trackAnalyticsEvent("visible_30s", { visible_seconds: 30 });
        trackMeaningfulEngagement("visible_30s", { visible_seconds: 30 });
      }, remaining);
    }

    function pauseVisibleTime() {
      if (visibleTimer !== null) {
        window.clearTimeout(visibleTimer);
        visibleTimer = null;
      }
      recordVisibleTime();
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") scheduleVisibleTime();
      else pauseVisibleTime();
    }

    function handleScroll() {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollableHeight <= 0) return;

      const percent = Math.min(
        100,
        Math.round((window.scrollY / scrollableHeight) * 100),
      );
      for (const threshold of SCROLL_THRESHOLDS) {
        if (percent < threshold || recordedScrollThresholds.has(threshold)) {
          continue;
        }

        const sent = trackAnalyticsEvent("scroll_depth", {
          scroll_percent: threshold,
        });
        if (!sent) continue;

        recordedScrollThresholds.add(threshold);
        trackMeaningfulEngagement(`scroll_${threshold}`, {
          scroll_percent: threshold,
        });
      }
    }

    function handleClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;

      let destination: URL;
      try {
        destination = new URL(link.href, window.location.href);
      } catch {
        return;
      }
      if (destination.protocol !== "http:" && destination.protocol !== "https:") {
        return;
      }

      const linkText = cleanAnalyticsText(
        link.innerText ||
          link.textContent ||
          link.getAttribute("aria-label") ||
          "unlabeled_link",
      );
      const linkProperties = {
        link_url: cleanAnalyticsText(destination.href),
        link_text: linkText,
        link_domain: destination.hostname,
        destination_path: cleanAnalyticsText(
          `${destination.pathname}${destination.search}`,
        ),
      };

      if (link.dataset.analyticsCta === "true") {
        const ctaProperties = {
          ...linkProperties,
          cta_name: cleanAnalyticsText(link.dataset.ctaName || linkText),
          cta_location: ctaLocation(link),
          cta_variant: link.dataset.ctaVariant || "primary",
        };
        trackAnalyticsEvent("cta_click", ctaProperties);
        trackMeaningfulEngagement("cta_click", ctaProperties);
      }

      if (destination.origin === window.location.origin) {
        trackAnalyticsEvent("internal_link_click", linkProperties);
        trackMeaningfulEngagement("internal_link_click", linkProperties);
      }
    }

    function handleFormInteraction(event: FocusEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const form = target.closest<HTMLFormElement>(
        "form[data-analytics-form-name]",
      );
      const formName = form?.dataset.analyticsFormName;
      if (!form || !formName || recordedForms.has(formName)) return;

      const sent = trackAnalyticsEvent("form_interaction_start", {
        form_name: formName,
      });
      if (!sent) return;

      recordedForms.add(formName);
      trackMeaningfulEngagement("form_interaction_start", {
        form_name: formName,
      });
    }

    scheduleVisibleTime();
    handleScroll();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("click", handleClick, true);
    document.addEventListener("focusin", handleFormInteraction);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener(ANALYTICS_CONSENT_EVENT, handleScroll);

    return () => {
      pauseVisibleTime();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("focusin", handleFormInteraction);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener(ANALYTICS_CONSENT_EVENT, handleScroll);
    };
  }, [pathname]);

  return null;
}
