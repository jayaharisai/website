import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { PrimaryButton } from "@/components/primary-button";
import "@/components/shared/layout.css";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main id="main-content" className="page-container page-container--md">
      <PageHeader
        title="Page not found"
        description="The page you are looking for doesn't exist or has moved."
      />
      <div>
        <PrimaryButton href="/">Back home</PrimaryButton>
      </div>
    </main>
  );
}
