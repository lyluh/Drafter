// Description of an individual auction
// RI: id, rounds >= 0
// RI: drafters includes currentDrafter

export type Draft = { 
    id: number;
    rounds: number;
    drafters: string[];
    options: string[];
    picks: string[];
  }