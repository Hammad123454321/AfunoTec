type Props = {
  contact: React.ReactNode;
  profile: React.ReactNode;
  security: React.ReactNode;
  social: React.ReactNode;
};

export default function SettingPage({
  contact,
  profile,
  security,
  social,
}: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {profile}
      {contact}
      {social}
      {security}
    </div>
  );
}
