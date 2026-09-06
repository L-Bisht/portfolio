import { useEffect, useState } from "react";

/**
 * useScrollSpy
 *
 * Watches a set of section IDs via IntersectionObserver and returns the ID of
 * whichever section currently occupies the most visible area near the top of
 * the viewport.  Falls back to the first section when nothing intersects.
 *
 * @param sectionIds  - ordered list of DOM element IDs to observe
 * @param rootMargin  - IO rootMargin string (default biases toward the upper third)
 */
export function useScrollSpy(
  sectionIds: string[],
  rootMargin = "-10% 0px -75% 0px"
): string {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? "");

  useEffect(() => {
    if (sectionIds.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the first intersecting entry in document order
        for (const id of sectionIds) {
          const entry = entries.find((e) => e.target.id === id);
          if (entry?.isIntersecting) {
            setActiveId(id);
            return;
          }
        }
      },
      { rootMargin }
    );

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds, rootMargin]);

  return activeId;
}
