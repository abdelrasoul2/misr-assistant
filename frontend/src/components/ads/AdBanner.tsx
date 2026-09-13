import AdSlot from "./AdSlot";

interface AdBannerProps {
  className?: string;
}

export default function AdBanner({ className = "" }: AdBannerProps) {
  return (
    <div className={"max-w-6xl mx-auto px-4 " + className}>
      <AdSlot slotId="landing-banner" format="horizontal" className="my-6" />
    </div>
  );
}
