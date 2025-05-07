import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN || "https://1463ed7f7ba0f76e77438169572780ba@o4509253532712960.ingest.de.sentry.io/4509253535137872",
  tracesSampleRate: 1.0, // عدل حسب الحاجة
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
