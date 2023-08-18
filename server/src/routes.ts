import { Request, Response } from "express";

// description of a draft
// RI: id, rounds >= 0
// RI: drafters includes currentDrafter
type Draft = { 
  id: number;
  rounds: number;
  drafters: string[];
  options: string[];
  picks: string[];
}

// Map from id to draft.
let drafts: Map<number, Draft> = new Map();


// Saves the a draft with a randomly generated id.
export function Save(req: Request, res: Response) {
  // create a new id
  const id: number = drafts.size + 1;

  // get the number of rounds. If its not specified, send error
  const roundsX = req.query.rounds;
  if (roundsX === "" || typeof roundsX !== 'string') {
    res.status(400).send("missing 'rounds' parameter");
    return;
  }
  const rounds = parseInt(roundsX);
  if (typeof rounds !== 'number') {
    res.status(400).send("bad type of 'rounds' parameter");
    return;
  }

  // get the list of options
  const rawOptions = req.query.rawOptions;
  if (rawOptions === undefined || typeof rawOptions !== 'string') {
    res.status(400).send("Must have 1 or more options");
    return;
  }
  const options = rawOptions.split("\n");



  
  const rawDrafters = req.query.rawDrafters;
  if (rawDrafters === "" || typeof rawDrafters !== 'string') {
    res.status(400).send("missing drafters");
    return;
  }
  const drafters = rawDrafters.split("\n");
  if (drafters.length < 2) {
    res.status(400).send("must have 2 or more drafters");
    return;
  }

  const name = req.query.name;
  if (name === undefined || typeof name !== 'string') {
    res.status(400).send("You must say who you are!");
    return;
  }

  const draft: Draft = {
    id: id,
    rounds: rounds,
    drafters: drafters,
    picks: [],
    options: options
  };

  // if user is not one of the drafters, throw error
  if (!draft.drafters.includes(name)) {
    res.status(400).send("You are not one of the drafters!");
    return;
  }

  drafts.set(id, draft);
  res.send({"idName": id});
}



// Loads the a draft with a given id.
export function Load(req: Request, res: Response) {
  // go through files to find the requested file and open its value in the map
  if (drafts.size === 0) {
    res.status(400).send("There are no drafts yet!");
    return;
  }

  const idX = req.query.id;
  if (idX === undefined || typeof idX !== 'string') {
    res.status(400).send("missing 'id' parameter");
    return;
  }

  const id = parseInt(idX);
  if (typeof id !== 'number') {
    res.status(400).send("bad type of 'id' parameter");
    return;
  }


  if (!drafts.has(Number(id))) {
    res.status(400).send(`no such draft with id: ${id} exists`);
    return;
  }

  const name = req.query.name;
  if (name === undefined || typeof name !== 'string') {
    res.status(400).send("You must say who you are!");
    return;
  }

  const draft = drafts.get(Number(id));
  // this state should not be able to be reached, only for type checker
  if (draft === undefined) {
    return;
  }

  // if user is not one of the drafters, throw error
  if (!draft.drafters.includes(name)) {
    res.status(400).send("You are not one of the drafters!");
    return;
  }

  res.send(draft);
}

// resets the given map to be empty
export function resetDrafts() {
  drafts = new Map();
}

// drafter selects an option, removes it from the list of options
// in the current draft given by the id
export function selectOption(req: Request, res: Response) {
  // get the id so we are editing the appropriate draft
  const idX = req.query.id;
  if (idX === undefined || typeof idX !== 'string') {
    res.status(400).send("missing 'id' parameter");
    return;
  }

  const id = parseInt(idX);
  if (typeof id !== 'number') {
    res.status(400).send("bad type of 'id' parameter");
    return;
  }
  
  const draft = drafts.get(Number(id));
  if (draft === undefined) {
    res.status(400).send("Invalid id");
    return;
  }

  const selection = req.query.selection;
  if (selection === undefined || typeof selection !== 'string') {
    res.status(400).send("There was no selection");
    return;
  }

  draft.picks.push(selection);
  remove(draft.options, selection);

  res.send(draft)
}

// helper function to remove specific element from array
export function remove(array: string[], target: string) {
  const index = array.indexOf(target);
  return array.splice(index, 1);
}

/** Returns a list of all the named save files. */
export function Dummy(req: Request, res: Response) {
  const name = first(req.query.name);
  if (name === undefined) {
    res.status(400).send('missing "name" parameter');
  } else {
    res.json(`Hi, ${name}`);
  }
}


// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
function first(param: any): string|undefined {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }
}
