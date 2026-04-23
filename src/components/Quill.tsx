import { type RefObject } from 'react';
import { useQuillProximity } from '../hooks/useQuillProximity';

interface Props {
  quillRef: RefObject<HTMLDivElement | null>;
  ledgerStageRef: RefObject<HTMLDivElement | null>;
}

/**
 * The cursor-following bone quill. Rendered as a sibling of the stage so
 * its `position: fixed` is anchored to the viewport, not the parallaxed
 * scene. The transform is written imperatively by `useQuillProximity` each
 * frame the pointer moves.
 */
export function Quill({ quillRef, ledgerStageRef }: Props) {
  useQuillProximity(quillRef, ledgerStageRef);
  return (
    <div ref={quillRef} className="quill" aria-hidden="true">
      <img src="/assets/quill_cursor.png" width={90} height={90} alt="" />
    </div>
  );
}
