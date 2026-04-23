import { useRef, type ReactNode } from 'react';
import { useParallaxScene } from '../../hooks/useParallaxScene';
import { Cathedral } from './Cathedral';

interface Props {
  entered: boolean;
  children: ReactNode;
}

/**
 * The post-entrance viewport: cathedral backdrop + fog + `<main>`. Fades in
 * from opacity 0 via the `.revealed` class driven by the `entered` prop.
 *
 * The `#stage` id and the `#stage main` selector are load-bearing for
 * `applySettings` (which writes the hue-rotate filter onto `main`, not
 * `#stage`, to avoid spawning a containing block that would break the
 * fixed parallax scene).
 */
export function Stage({ entered, children }: Props) {
  const sceneRef = useRef<HTMLDivElement>(null);
  useParallaxScene(sceneRef);

  return (
    <div id="stage" className={entered ? 'revealed' : ''}>
      <Cathedral sceneRef={sceneRef} />
      <div className="fog" />
      <main>{children}</main>
    </div>
  );
}
