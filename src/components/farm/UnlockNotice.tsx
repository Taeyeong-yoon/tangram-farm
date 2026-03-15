import type { UnlockEvent } from "@/types/farm.types";

interface UnlockNoticeProps {
  events: UnlockEvent[];
  onDismiss: (id: string) => void;
}

export function UnlockNotice({ events, onDismiss }: UnlockNoticeProps) {
  if (events.length === 0) return null;

  return (
    <div className="unlock-list" aria-live="polite">
      {events.map((event) => (
        <div className="unlock-card" key={event.id}>
          <div>
            <p className="eyebrow">새로 열림</p>
            <strong>{event.label}</strong>
            <p>{event.description}</p>
          </div>
          <button className="ghost-button" onClick={() => onDismiss(event.id)}>
            확인
          </button>
        </div>
      ))}
    </div>
  );
}
