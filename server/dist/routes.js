"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dummy = exports.remove = exports.selectOption = exports.resetDrafts = exports.Load = exports.Save = void 0;
// Map from id to draft.
var drafts = new Map();
// Saves the a draft with a randomly generated id.
function Save(req, res) {
    // create a new id
    var id = drafts.size + 1;
    // get the number of rounds. If its not specified, send error
    var roundsX = req.query.rounds;
    if (roundsX === "" || typeof roundsX !== 'string') {
        res.status(400).send("missing 'rounds' parameter");
        return;
    }
    var rounds = parseInt(roundsX);
    if (typeof rounds !== 'number') {
        res.status(400).send("bad type of 'rounds' parameter");
        return;
    }
    // get the list of options
    var rawOptions = req.query.rawOptions;
    if (rawOptions === undefined || typeof rawOptions !== 'string') {
        res.status(400).send("Must have 1 or more options");
        return;
    }
    var options = rawOptions.split("\n");
    var rawDrafters = req.query.rawDrafters;
    if (rawDrafters === "" || typeof rawDrafters !== 'string') {
        res.status(400).send("missing drafters");
        return;
    }
    var drafters = rawDrafters.split("\n");
    if (drafters.length < 2) {
        res.status(400).send("must have 2 or more drafters");
        return;
    }
    var name = req.query.name;
    if (name === undefined || typeof name !== 'string') {
        res.status(400).send("You must say who you are!");
        return;
    }
    var draft = {
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
    res.send({ "idName": id });
}
exports.Save = Save;
// Loads the a draft with a given id.
function Load(req, res) {
    // go through files to find the requested file and open its value in the map
    if (drafts.size === 0) {
        res.status(400).send("There are no drafts yet!");
        return;
    }
    var idX = req.query.id;
    if (idX === undefined || typeof idX !== 'string') {
        res.status(400).send("missing 'id' parameter");
        return;
    }
    var id = parseInt(idX);
    if (typeof id !== 'number') {
        res.status(400).send("bad type of 'id' parameter");
        return;
    }
    if (!drafts.has(Number(id))) {
        res.status(400).send("no such draft with id: ".concat(id, " exists"));
        return;
    }
    var name = req.query.name;
    if (name === undefined || typeof name !== 'string') {
        res.status(400).send("You must say who you are!");
        return;
    }
    var draft = drafts.get(Number(id));
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
exports.Load = Load;
// resets the given map to be empty
function resetDrafts() {
    drafts = new Map();
}
exports.resetDrafts = resetDrafts;
// drafter selects an option, removes it from the list of options
// in the current draft given by the id
function selectOption(req, res) {
    // get the id so we are editing the appropriate draft
    var idX = req.query.id;
    if (idX === undefined || typeof idX !== 'string') {
        res.status(400).send("missing 'id' parameter");
        return;
    }
    var id = parseInt(idX);
    if (typeof id !== 'number') {
        res.status(400).send("bad type of 'id' parameter");
        return;
    }
    var draft = drafts.get(Number(id));
    if (draft === undefined) {
        res.status(400).send("Invalid id");
        return;
    }
    var selection = req.query.selection;
    if (selection === undefined || typeof selection !== 'string') {
        res.status(400).send("There was no selection");
        return;
    }
    console.log("before pushing:" + selection);
    draft.picks.push(selection);
    remove(draft.options, selection);
    res.send(draft);
}
exports.selectOption = selectOption;
// helper function to remove specific element from array
function remove(array, target) {
    var index = array.indexOf(target);
    return array.splice(index, 1);
}
exports.remove = remove;
/** Returns a list of all the named save files. */
function Dummy(req, res) {
    var name = first(req.query.name);
    if (name === undefined) {
        res.status(400).send('missing "name" parameter');
    }
    else {
        res.json("Hi, ".concat(name));
    }
}
exports.Dummy = Dummy;
// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
function first(param) {
    if (Array.isArray(param)) {
        return first(param[0]);
    }
    else if (typeof param === 'string') {
        return param;
    }
    else {
        return undefined;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3JvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFhQSx3QkFBd0I7QUFDeEIsSUFBSSxNQUFNLEdBQXVCLElBQUksR0FBRyxFQUFFLENBQUM7QUFHM0Msa0RBQWtEO0FBQ2xELFNBQWdCLElBQUksQ0FBQyxHQUFZLEVBQUUsR0FBYTtJQUM5QyxrQkFBa0I7SUFDbEIsSUFBTSxFQUFFLEdBQVcsTUFBTSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7SUFFbkMsNkRBQTZEO0lBQzdELElBQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO0lBQ2pDLElBQUksT0FBTyxLQUFLLEVBQUUsSUFBSSxPQUFPLE9BQU8sS0FBSyxRQUFRLEVBQUU7UUFDakQsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsNEJBQTRCLENBQUMsQ0FBQztRQUNuRCxPQUFPO0tBQ1I7SUFDRCxJQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDakMsSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQUU7UUFDOUIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztRQUN2RCxPQUFPO0tBQ1I7SUFFRCwwQkFBMEI7SUFDMUIsSUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUM7SUFDeEMsSUFBSSxVQUFVLEtBQUssU0FBUyxJQUFJLE9BQU8sVUFBVSxLQUFLLFFBQVEsRUFBRTtRQUM5RCxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1FBQ3BELE9BQU87S0FDUjtJQUNELElBQU0sT0FBTyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7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