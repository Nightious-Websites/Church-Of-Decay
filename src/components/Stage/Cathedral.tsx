import { type RefObject } from 'react';
import { cathedralSvgInnerHtml } from './cathedralSvg';

interface Props {
  /** The scene element holds the parallax transform; the ref is owned by
   *  Stage so `useParallaxScene` can update it without a querySelector. */
  sceneRef: RefObject<HTMLDivElement | null>;
}

/**
 * The cathedral SVG backdrop rendered as raw HTML. Kept imperative via
 * `dangerouslySetInnerHTML` because converting the 480 lines of
 * defs/filter/mask/use markup to JSX would buy nothing — no part of the
 * SVG is reactive.
 */
export function Cathedral({ sceneRef }: Props) {
  return (
    <div className="cathedral" aria-hidden="true">
      <div
        ref={sceneRef}
        className="scene"
        dangerouslySetInnerHTML={{ __html: cathedralSvgInnerHtml }}
      />
    </div>
  );
}
