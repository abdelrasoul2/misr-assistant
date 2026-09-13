import AdSlot from "./AdSlot";

interface AdSidebarProps {
  className?: string;
}

export default function AdSidebar({ className = "" }: AdSidebarProps) {
  return (
    <aside className={"space-y-4 " + className}>
      <AdSlot slotId="sidebar-top" format="rectangle" />
      <AdSlot slotId="sidebar-mid" format="rectangle" />
    </aside>
  );
}
