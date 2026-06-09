import Container from "@/components/layout/Container";
import Heading from "@/components/Heading";

export const metadata = {
  title: "Settings — AfunoTec",
  description: "Preferences, notifications and security for your AfunoTec account.",
};

const SECTIONS: ReadonlyArray<{ title: string; description: string }> = [
  {
    title: "Preferences",
    description:
      "Language, currency and timezone used across the site and your booking confirmations.",
  },
  {
    title: "Notifications",
    description:
      "Email, SMS and push notifications for booking updates, deals and AfunoTec news.",
  },
  {
    title: "Privacy",
    description:
      "Marketing consent, cookie choices and personalised recommendations.",
  },
  {
    title: "Security",
    description:
      "Password, two-factor authentication and active sessions on your account.",
  },
];

export default function SettingsPage() {
  return (
    <Container className="py-10">
      <Heading as="h1" size="h2" className="mb-6">
        Settings
      </Heading>

      <div className="space-y-4">
        {SECTIONS.map((section) => (
          <article
            key={section.title}
            className="rounded-xl border border-gray-200 bg-white p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              {section.title}
            </h2>
            <p className="text-sm text-gray-600">{section.description}</p>
            <p className="mt-4 text-sm text-gray-400 italic">
              Controls become editable once your account is connected.
            </p>
          </article>
        ))}
      </div>
    </Container>
  );
}
