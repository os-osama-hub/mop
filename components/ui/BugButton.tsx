// components/ReportBugButton.tsx
"use client";

import * as Sentry from "@sentry/nextjs";
import { HiSpeakerphone } from "react-icons/hi";

export default function BugButton() {
  return (
    <button
      onClick={() => Sentry.showReportDialog()}
      className="fixed bottom-4 right-4 z-50 bg-[#1a1a1a] text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 hover:scale-105 transition-transform"
    >
  <HiSpeakerphone />
      Report a Bug
    </button>
  );
}
