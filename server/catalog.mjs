import { packageDetails, project } from "../src/project.js";

const eventsById = new Map(project.events.map((event) => [event.id, event.title]));
const catalogItems = new Map();

for (const selectedPackage of project.packages) {
  const eventType = eventsById.get(selectedPackage.eventId);
  const details = packageDetails[selectedPackage.id];
  for (const item of details?.variants || []) {
    catalogItems.set(item.id, {
      id: item.id,
      name: item.name,
      price: item.price,
      eventType,
    });
  }
}

export function getCatalogItem(id) {
  return catalogItems.get(id) || null;
}
