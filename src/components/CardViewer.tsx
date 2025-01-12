import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card } from "@/src/App";

type Props = {
  deck: Card[];
  drawnCards: Card[];
  drawCard: () => void;
};

export default function CardViewer({ deck, drawnCards, drawCard }: Props) {
  const currentCard = drawnCards[drawnCards.length - 1];

  return (
    <div className="flex flex-col items-center justify-between p-4 bg-gradient-to-b from-gray-100 to-gray-200">
      <div className="flex-1 flex items-center justify-center w-full p-3">
        {currentCard ? (
          <div className="relative w-64 h-96">
            <img
              src={currentCard.imageUrl}
              alt={`Card ${currentCard.id}`}
              className="object-cover"
            />
          </div>
        ) : (
          <div className="text-2xl text-gray-500">Draw a card to start</div>
        )}
      </div>
      <div className="w-full max-w-md space-y-4 mb-8">
        <Button
          onClick={drawCard}
          disabled={deck.length === 0}
          className="w-full text-lg py-6"
        >
          {`Draw Card (${deck.length})`}
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full text-lg py-6">
              View Discard Pile ({drawnCards.length})
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Discard Pile</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[50vh] w-full rounded-md border p-4">
              <div className="grid grid-cols-3 gap-4">
                {drawnCards.slice(0, drawnCards.length - 1).map((card, index) => (
                  <div key={index} className="relative">
                    <img
                      src={card.imageUrl}
                      alt={`Card ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
