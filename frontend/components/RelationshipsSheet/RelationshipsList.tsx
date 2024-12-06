/* eslint-disable @next/next/no-img-element */
"use client"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { TreePerson } from "@/lib/treeInterfaces";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { relationshipKindToString } from "@/lib/utils";
import { Plus, User } from "lucide-react";
import { Relationship } from "@/lib/relaionshipInterfaces";

interface Props {
  isOpened: boolean;
  relationships: Relationship[];
  people: TreePerson[];
  onRelationshipClick: (r: number | "new") => void;
  onClose: () => void;
}

export function RelationshipsList({ isOpened, relationships, people, onRelationshipClick, onClose }: Props) {
  const relCards = relationships.map((rel) => {
    const partner1 = people.find((p) => p.id === rel.partner1)!;
    const partner2 = people.find((p) => p.id === rel.partner2)!;

    return (
      <Button key={rel.id} onClick={() => onRelationshipClick(rel.id)} variant="outline" className="w-full p-4 flex-col justify-between">
        <PartnerImage person={partner1} />
        <PartnerImage person={partner2} />
        <h4 className="text-sm text-muted-foreground text-center w-full">
          {partner1.name} {partner1.surname} i {partner2.name} {partner2.surname}
        </h4>
        <p>{relationshipKindToString[rel.kind]}</p>
      </Button>
    )
  })

  return (
    <Sheet open={isOpened} modal={false}>
      <SheetContent className="flex flex-col px-0 w-96" side="left">
        <SheetHeader className="mx-6">
          <SheetTitle>Związki</SheetTitle>
          <SheetDescription>Przeglądaj, dodawaj, usuwaj i edytuj związki</SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 p-6" type="auto">
          <Button onClick={() => onRelationshipClick("new")} variant="outline" className="w-full h-40 flex flex-col items-center justify-center">
            <Plus className="size-8" />
            Dodaj związek
          </Button>
          {relCards}
          <ScrollBar orientation="vertical" />
        </ScrollArea>

        <SheetFooter className="mx-6">
          <Button onClick={onClose} className="flex-1">
            Zamknij
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

interface PartnerImage {
  person: TreePerson
}

function PartnerImage({ person }: PartnerImage) {
  const image = person.imageUrl ? 
    <img src={person.imageUrl} alt="Person image" className="size-full object-cover"/> :
    <User className="size-full" />;

  return (
    <div className="w-full aspect-square overflow-hidden flex items-center justify-center">
      { image }
    </div>
  )
}