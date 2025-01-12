import React, { useState, useCallback } from "react";
import JSZip from "jszip";
import { Upload, Shuffle, CircleDashed } from "lucide-react";
import CardViewer from "@/src/components/CardViewer";

export interface Card {
  id: number;
  imageUrl: string;
}

function App() {
  const [deck, setDeck] = useState<Card[]>([]);
  const [drawnCards, setDrawnCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cardsLoaded, setCardsLoaded] = useState(false);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const zip = new JSZip();
      const contents = await zip.loadAsync(file);
      const cardPromises: Promise<Card>[] = [];
      let cardId = 0;

      contents.forEach((relativePath, zipEntry) => {
        if (!zipEntry.dir && zipEntry.name.match(/\.(png|jpg|jpeg)$/i)) {
          const promise = zipEntry.async("blob").then((blob) => ({
            id: cardId++,
            imageUrl: URL.createObjectURL(blob),
          }));
          cardPromises.push(promise);
        }
      });

      const cards = await Promise.all(cardPromises);
      setDeck(cards);
      setDrawnCards([]);
      setCardsLoaded(true);
    } catch (error) {
      console.error("Error loading zip file:", error);
      alert("Error loading the card deck. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const shuffleDeck = useCallback(() => {
    setDeck((currentDeck) => {
      const newDeck = [...currentDeck];
      for (let i = newDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
      }
      return newDeck;
    });
  }, []);

  const drawCard = useCallback(() => {
    if (deck.length === 0) return;

    const drawnCard = deck[0];
    setDeck((currentDeck) => currentDeck.slice(1));
    setDrawnCards((current) => [...current, drawnCard]);
  }, [deck]);

  return (
    <div className="flex flex-col gap-3 bg-white p-8">
      <h1 className="text-3xl font-bold text-center">Card Deck Viewer</h1>

      {/* Upload Section */}
      {!cardsLoaded && (
        <div className="flex flex-col items-center gap-4">
          <label
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 
                         text-white rounded-lg cursor-pointer transition-colors"
          >
            <Upload size={20} />
            Upload Card Deck (ZIP)
            <input
              type="file"
              accept=".zip"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {isLoading && <p className="text-white">Loading cards...</p>}
        </div>
      )}

      {cardsLoaded && (
        <CardViewer deck={deck} drawnCards={drawnCards} drawCard={drawCard} />
      )}

      {/* Deck Status
            <div className="flex justify-between items-center">
              <p className="text-white">Cards in deck: {deck.length}</p>
              <button
                onClick={shuffleDeck}
                disabled={deck.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 
                         text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Shuffle size={20} />
                Shuffle
              </button>
              <button
                onClick={drawCard}
                disabled={deck.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 
                         text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CircleDashed size={20} />
                Draw Card
              </button>
            </div>

            {/* Drawn Cards Display */}
      {/* {drawnCards.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Drawn Cards
                </h2>
                <div className="grid grid-cols-4 gap-4">
                  {drawnCards.map((card, index) => (
                    <div
                      key={card.id}
                      className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg 
                               transform hover:scale-105 transition-transform"
                    >
                      <img
                        src={card.imageUrl}
                        alt={`Card ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )} */}
    </div>
  );
}

export default App;
