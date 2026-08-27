import type { StoryboardPackage } from "../storyboard";
import { HOME_HERO_STORYBOARD } from "./home-hero";

/** Every written storyboard package, keyed by manifest media id. */
export const STORYBOARDS: Record<string, StoryboardPackage> = {
  [HOME_HERO_STORYBOARD.mediaId]: HOME_HERO_STORYBOARD,
};

export function getStoryboard(mediaId: string): StoryboardPackage | undefined {
  return STORYBOARDS[mediaId];
}

export { HOME_HERO_STORYBOARD };
