import Container from "@/components/layout/Container";
import Heading from "@/components/Heading";

/**
 * Public-shell Profile page. Shows the basic layout + sections the
 * design calls for; data wiring happens in M3 once the auth + users
 * APIs are live (see development plan).
 */
export const metadata = {
  title: "Profile — AfunoTec",
  description: "Manage your AfunoTec profile information.",
};

export default function ProfilePage() {
  return (
    <Container className="py-10">
      <Heading as="h1" size="h2" className="mb-6">
        Profile
      </Heading>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        {/* Sidebar — placeholder list of profile-related links */}
        <aside className="rounded-xl border border-gray-200 bg-white p-4 h-fit">
          <ul className="space-y-2 text-sm">
            <li className="font-semibold text-gray-900">Account</li>
            <li className="text-gray-600">My Bookings</li>
            <li className="text-gray-600">Wishlist</li>
            <li className="text-gray-600">Gift cards</li>
            <li className="text-gray-600">Promo codes</li>
            <li className="text-gray-600">Settings</li>
          </ul>
        </aside>

        <section className="space-y-6">
          <ProfileCard
            title="Personal details"
            description="Name, email, phone and locale used on your bookings."
          />
          <ProfileCard
            title="Identity documents"
            description="Passport / national ID kept for express check-in."
          />
          <ProfileCard
            title="Loyalty & rewards"
            description="Tier, points and exclusive offers from AfunoTec partners."
          />
        </section>
      </div>
    </Container>
  );
}

function ProfileCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">{title}</h2>
      <p className="text-sm text-gray-600">{description}</p>
      <p className="mt-4 text-sm text-gray-400 italic">
        Loading your details — comes online once your account is connected.
      </p>
    </article>
  );
}
