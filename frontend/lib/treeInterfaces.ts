import { Parenthood } from "./parenthoodInterfaces";
import { Relationship } from "./relaionshipInterfaces"

export interface Tree {
  id: number;
  uid: number;
  name: string;
  people: TreePerson[];
  relationships: Relationship[];
  parenthoods: Parenthood[];
}

export interface TreePerson {
  id: number;
  name: string | null;
  surname: string | null;
  sex: "F" | "M" | null;
  image: string | null;
  birthDate: string;
  deathDate: string;
  x: number;
  y: number;
}
