import { Relationship } from "./relaionshipInterfaces";
import { TreeRelationship } from "./treeInterfaces";

function getUniqueId<T extends { id: number }>(arr: T[]) {
  let id: number;
  do {
    id = Math.round(Math.random() * Number.MAX_SAFE_INTEGER);
  } while (arr.some(t => t.id === id));
  return id;
}

export function relationshipToTreeRelationship(r: Relationship): TreeRelationship {
  return {
    id: r.id,
    kind: r.stages.at(-1)!.kind,
    partner1: r.partner1,
    partner2: r.partner2
  };
}

export function createRelationship(relationship: Omit<Relationship, "id">): Promise<TreeRelationship> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const relations: Relationship[] = JSON.parse(localStorage.getItem('relations') ?? "[]");
      const newRelation: Relationship = {
        ...relationship,
        id: getUniqueId(relations),
      };
      relations.push(newRelation)
      localStorage.setItem('relations', JSON.stringify(relations));
      resolve(relationshipToTreeRelationship(newRelation));
    }, 1000);
  });
}

export function getRelationship(relationshipId: number): Promise<Relationship | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const relations: Relationship[] = JSON.parse(localStorage.getItem('relations') ?? "[]");
      resolve(relations.find(r => r.id === relationshipId));
    }, 1000);
  });
}

export function updateRelationship(relationship: Relationship): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const relations: Relationship[] = JSON.parse(localStorage.getItem('relations') ?? "[]");
      const i = relations.findIndex(r => r.id === relationship.id);
      relations[i] = relationship;
      localStorage.setItem('relations', JSON.stringify(relations));
      resolve();
    }, 1000);
  });
}

export function deleteRelationship(relationship: Relationship): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const relations: Relationship[] = JSON.parse(localStorage.getItem('relations') ?? "[]");
      const i = relations.findIndex(r => r.id === relationship.id);
      relations.splice(i, 1);
      localStorage.setItem('relations', JSON.stringify(relations));
      resolve();
    }, 1000);
  });
}
