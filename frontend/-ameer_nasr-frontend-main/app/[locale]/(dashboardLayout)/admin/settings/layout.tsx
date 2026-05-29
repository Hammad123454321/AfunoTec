type Props = {
  contact: React.ReactNode;
  profile: React.ReactNode;
  security: React.ReactNode;
  invite: React.ReactNode;
};

export default function SettingPage({
  contact,
  profile,
  security,
  invite,
}: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {profile}
      {contact}
      {invite}
      {security}
    </div>
  );
}
