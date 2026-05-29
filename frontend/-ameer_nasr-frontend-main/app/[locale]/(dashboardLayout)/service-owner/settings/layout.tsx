type Props = {
  contact: React.ReactNode;
  profile: React.ReactNode;
  security: React.ReactNode;
  business: React.ReactNode;
};

export default function SettingPage({
  contact,
  profile,
  security,
  business,
}: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {profile}
      {contact}
      {business}
      {security}
    </div>
  );
}
