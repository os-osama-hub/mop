// lib/safeSentry.ts
"use client";

import * as Sentry from "@sentry/nextjs";

export const showReport = () => {
  if (typeof window !== "undefined") {
    Sentry.showReportDialog();
  }
};
