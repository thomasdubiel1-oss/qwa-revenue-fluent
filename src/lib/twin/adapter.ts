import { executiveSnapshotFixture } from "./fixtures";
import type { ExecutiveSnapshotRepository } from "./types";

/** Replace this adapter with a server repository without changing dashboard components. */
export const simulatedExecutiveRepository: ExecutiveSnapshotRepository = {
  async getSnapshot() {
    return structuredClone(executiveSnapshotFixture);
  },
  async getJourney(id) {
    const journey = executiveSnapshotFixture.journeys.find((item) => item.id === id);
    return journey ? structuredClone(journey) : null;
  },
};
