type Props = React.PropsWithChildren;

export default function SearchPanel({ children }: Props) {
  return (
    <div className="rounded shadow-xs border border-gray-200 px-2 py-2.5 flex flex-col lg:flex-row gap-4 flex-wrap items-center justify-between">
      {children}
    </div>
  );
}

export function SearchPanelLeft({ children }: Props) {
  return (
    <div className="lg:flex-8 flex flex-wrap [&>*]:flex-1 gap-4 w-full">
      {children}
    </div>
  );
}

export function SearchPanelRight({ children }: Props) {
  return <div className="flex-1 w-full">{children}</div>;
}
