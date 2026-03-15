import type { GrowthEvent } from "@/types/farm.types";

interface GrowthModalProps {
  events: GrowthEvent[];
  onDismiss: (id: string) => void;
}

export function GrowthModal({ events, onDismiss }: GrowthModalProps) {
  if (events.length === 0) return null;

  return (
    <div className="floating-stack" aria-live="polite">
      {events.map((event) => (
        <div className="floating-card" key={event.id}>
          <div>
            <p className="eyebrow">성장 소식</p>
            <strong>{event.nameKo}</strong>
            <p>{event.description}</p>
          </div>
          <button className="ghost-button" onClick={() => onDismiss(event.id)}>
            닫기
          </button>
        </div>
      ))}
    </div>
  );
}
