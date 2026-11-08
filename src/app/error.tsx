"use client";

import { PageHeader } from "@/components/page-header";
import { PrimaryButton } from "@/components/primary-button";
import "@/components/shared/layout.css";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <main id="main-content" className="page-container page-container--md">
      <PageHeader
        title="Something went wrong"
        description="An unexpected error occurred. You can try again, or head back home."
      />
      <div>
        <PrimaryButton onClick={reset}>Try again</PrimaryButton>
      </div>
    </main>
  );
}
