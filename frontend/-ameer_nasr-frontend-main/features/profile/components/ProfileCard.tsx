import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";

type Props = {
  children: React.ReactNode;
};

export function ProfileCard({ children }: Props) {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-100 p-6 space-y-6">
      {children}
    </div>
  );
}

export function ProfileCardHeader({ children }: Props) {
  return <div className="space-y-2">{children}</div>;
}

export function ProfileCardTitle({ children }: Props) {
  return (
    <Heading size="h5" as="h3">
      {children}
    </Heading>
  );
}
export function ProfileCardSubtitle({ children }: Props) {
  return <p className="text-sm text-gray-900">{children}</p>;
}

export function ProfileCardFooter({ children }: Props) {
  return <div>{children}</div>;
}

export function ProfileCardButton({ children }: Props) {
  return <Button>{children}</Button>;
}
