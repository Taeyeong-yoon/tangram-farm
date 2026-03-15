interface FarmTutorialProps {
  open: boolean;
  onClose: () => void;
}

export function FarmTutorial({ open, onClose }: FarmTutorialProps) {
  if (!open) return null;

  return (
    <section className="tutorial-panel">
      <div>
        <p className="eyebrow">처음 시작</p>
        <h3>농장은 이렇게 커져요</h3>
        <ol>
          <li>퍼즐을 풀면 씨앗, 먹이, 코인을 받아요.</li>
          <li>작물은 퍼즐 1회마다 25%씩 자라요.</li>
          <li>동물은 먹이를 직접 줘야 다음 단계로 커요.</li>
        </ol>
      </div>
      <button className="primary-button" onClick={onClose}>
        시작하기
      </button>
    </section>
  );
}
