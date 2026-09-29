import type { Metadata } from "next";
import { FavoritesBrowser } from "@/app/favorites/favorites-browser";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Saved",
  description: "Items you starred in this browser.",
};

export default function FavoritesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Saved"
        title="Starred for the next session"
        intro="Stars stay in this browser under english-corner-favorites. They are not an account."
      />
      <FavoritesBrowser />
    </div>
  );
}
