"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var assert = __importStar(require("assert"));
var httpMocks = __importStar(require("node-mocks-http"));
var routes_1 = require("./routes");
describe('routes', function () {
    it('Dummy', function () {
        var req1 = httpMocks.createRequest({ method: 'GET', url: '/api/dummy', query: { name: 'Kevin' } });
        var res1 = httpMocks.createResponse();
        (0, routes_1.Dummy)(req1, res1);
        assert.strictEqual(res1._getStatusCode(), 200);
        assert.deepEqual(res1._getJSONData(), 'Hi, Kevin');
    });
    it('Save', function () {
        // no rounds input
        var reqEmptyRound = httpMocks.createRequest({ method: 'POST', url: '/api/save', query: { name: "You", rawOptions: "boy\ngenius", rawDrafters: "You\nme" } });
        var resEmptyRound = httpMocks.createResponse();
        (0, routes_1.Save)(reqEmptyRound, resEmptyRound);
        // check that the request failed
        assert.strictEqual(resEmptyRound._getStatusCode(), 400);
        assert.deepEqual(resEmptyRound._getData(), "missing 'rounds' parameter");
        // no options input
        var reqEmptyOptions = httpMocks.createRequest({ method: 'POST', url: '/api/save', query: { rounds: "3", name: "You", rawDrafters: "You\nme" } });
        var resEmptyOptions = httpMocks.createResponse();
        (0, routes_1.Save)(reqEmptyOptions, resEmptyOptions);
        // check that the request failed
        assert.strictEqual(resEmptyOptions._getStatusCode(), 400);
        assert.deepEqual(resEmptyOptions._getData(), "Must have 1 or more options");
        // no drafters input
        var reqEmptyDrafters = httpMocks.createRequest({ method: 'POST', url: '/api/save', query: { rounds: "3", name: "You", rawOptions: "Bob\nBill" } });
        var resEmptyDrafters = httpMocks.createResponse();
        (0, routes_1.Save)(reqEmptyDrafters, resEmptyDrafters);
        // check that the request failed
        assert.strictEqual(resEmptyDrafters._getStatusCode(), 400);
        assert.deepEqual(resEmptyDrafters._getData(), "missing drafters");
        // only one drafter
        var reqOneDrafters = httpMocks.createRequest({ method: 'POST', url: '/api/save', query: { rounds: "3", name: "You", rawDrafters: "You", rawOptions: "Bob\nBill" } });
        var resOneDrafters = httpMocks.createResponse();
        (0, routes_1.Save)(reqOneDrafters, resOneDrafters);
        // check that the request failed
        assert.strictEqual(resOneDrafters._getStatusCode(), 400);
        assert.deepEqual(resOneDrafters._getData(), "must have 2 or more drafters");
        // no name
        var reqEmptyName = httpMocks.createRequest({ method: 'POST', url: '/api/save', query: { rounds: "13", rawOptions: "boy\ngenius", rawDrafters: "You\nme" } });
        var resEmptyName = httpMocks.createResponse();
        (0, routes_1.Save)(reqEmptyName, resEmptyName);
        // check that the request failed
        assert.strictEqual(resEmptyName._getStatusCode(), 400);
        assert.deepEqual(resEmptyName._getData(), "You must say who you are!");
        // name doesn't match one of the drafters
        var reqBadName = httpMocks.createRequest({ method: 'POST', url: '/api/save', query: { rounds: "13", name: "Cady", rawOptions: "boy\ngenius", rawDrafters: "You\nme" } });
        var resBadName = httpMocks.createResponse();
        (0, routes_1.Save)(reqBadName, resBadName);
        // check that the request failed
        assert.strictEqual(resBadName._getStatusCode(), 400);
        assert.deepEqual(resBadName._getData(), "You are not one of the drafters!");
        // successfully adding one draft
        var reqFirst = httpMocks.createRequest({ method: 'POST', url: '/api/save', query: { rounds: "13", name: "B", rawOptions: "boy\ngenius", rawDrafters: "B\nme" } });
        var resFirst = httpMocks.createResponse();
        (0, routes_1.Save)(reqFirst, resFirst);
        // check that the request succeeded
        assert.strictEqual(resFirst._getStatusCode(), 200);
        // and the response data is as expected
        assert.deepStrictEqual(resFirst._getData(), { idName: 1 });
        // assert.deepEqual(resFirst._getData(), new Map([[1, {idName: 1, picks: [],
        //                                                     rounds: 13, options: ["boy", "genius"], drafters: ["B", "me"]}]]));
        // adding a second file
        var reqSecond = httpMocks.createRequest({ method: 'POST', url: '/api/save', query: { rounds: "15", name: "lover", rawOptions: "carly\nrae\njepsen", rawDrafters: "taylor\nswift\nlover" } });
        var resSecond = httpMocks.createResponse();
        (0, routes_1.Save)(reqSecond, resSecond);
        // check that the request succeeded
        assert.strictEqual(resSecond._getStatusCode(), 200);
        // and the response data is as expected
        assert.deepStrictEqual(resSecond._getData(), { idName: 2 });
        // assert.deepEqual(resSecond._getData(), new Map([[1, {id: 1, picks: [], 
        //                                                     rounds: 13, options: ["boy", "genius"], drafters: ["B", "me"]}],
        //                                                 [2, {id: 2, picks: [],
        //                                                   rounds: 15, options: ["carly", "rae", "jepsen"], drafters: ["taylor", "swift", "lover"]}]]));
        (0, routes_1.resetDrafts)();
    });
    it('Load', function () {
        // no drafts to load
        var reqNoDrafts = httpMocks.createRequest({ method: 'GET', url: '/api/load', query: { id: "2", name: "bill" } });
        var resNoDrafts = httpMocks.createResponse();
        (0, routes_1.Load)(reqNoDrafts, resNoDrafts);
        // check that the request failed
        assert.strictEqual(resNoDrafts._getStatusCode(), 400);
        assert.deepEqual(resNoDrafts._getData(), "There are no drafts yet!");
        // add two drafts
        var reqFirst = httpMocks.createRequest({ method: 'POST', url: '/api/save', query: { rounds: "13", name: "B", rawOptions: "boy\ngenius", rawDrafters: "B\nme" } });
        var resFirst = httpMocks.createResponse();
        (0, routes_1.Save)(reqFirst, resFirst);
        var reqSecond = httpMocks.createRequest({ method: 'POST', url: '/api/save', query: { rounds: "15", name: "lover", rawOptions: "carly\nrae\njepsen", rawDrafters: "taylor\nswift\nlover" } });
        var resSecond = httpMocks.createResponse();
        (0, routes_1.Save)(reqSecond, resSecond);
        // no id provided
        var reqNoId = httpMocks.createRequest({ method: 'GET', url: '/api/load', query: { name: "B" } });
        var resNoId = httpMocks.createResponse(resSecond);
        (0, routes_1.Load)(reqNoId, resNoId);
        // check that the request failed
        assert.strictEqual(resNoId._getStatusCode(), 400);
        assert.deepEqual(resNoId._getData(), "missing 'id' parameter");
        // id provided doesn't exist
        var reqBadId = httpMocks.createRequest({ method: 'GET', url: '/api/load', query: { id: "5", name: "B" } });
        var resBadId = httpMocks.createResponse();
        (0, routes_1.Load)(reqBadId, resBadId);
        // check that the request failed
        assert.strictEqual(resBadId._getStatusCode(), 400);
        assert.deepEqual(resBadId._getData(), "no such draft with id: 5 exists");
        // no name provided
        var reqEmptyName = httpMocks.createRequest({ method: 'GET', url: '/api/load', query: { id: "1" } });
        var resEmptyName = httpMocks.createResponse();
        (0, routes_1.Load)(reqEmptyName, resEmptyName);
        // check that the request failed
        assert.strictEqual(resEmptyName._getStatusCode(), 400);
        assert.deepEqual(resEmptyName._getData(), "You must say who you are!");
        // name doesn't match one of the drafters
        var reqBadName = httpMocks.createRequest({ method: 'GET', url: '/api/load', query: { id: "1", name: "Bella" } });
        var resBadName = httpMocks.createResponse();
        (0, routes_1.Load)(reqBadName, resBadName);
        // check that the request failed
        assert.strictEqual(resBadName._getStatusCode(), 400);
        assert.deepEqual(resBadName._getData(), "You are not one of the drafters!");
        // successfully loads first Draft
        var reqFirstLoad = httpMocks.createRequest({ method: 'GET', url: '/api/load', query: { id: "1", name: "me" } });
        var resFirstLoad = httpMocks.createResponse();
        (0, routes_1.Load)(reqFirstLoad, resFirstLoad);
        // check that the request succeeded
        assert.strictEqual(resFirstLoad._getStatusCode(), 200);
        // and the response data is as expected
        assert.deepEqual(resFirstLoad._getData(), { id: 1, picks: [],
            rounds: 13, options: ["boy", "genius"], drafters: ["B", "me"] });
        // successfully loads second Draft
        var reqSecondLoad = httpMocks.createRequest({ method: 'GET', url: '/api/load', query: { id: "2", name: "swift" } });
        var resSecondLoad = httpMocks.createResponse();
        (0, routes_1.Load)(reqSecondLoad, resSecondLoad);
        // check that the request succeeded
        assert.strictEqual(resSecondLoad._getStatusCode(), 200);
        // and the response data is as expected
        assert.deepEqual(resSecondLoad._getData(), { id: 2, picks: [],
            rounds: 15, options: ["carly", "rae", "jepsen"], drafters: ["taylor", "swift", "lover"] });
    });
    it('selectOption', function () {
        // no id provided
        var reqNoId = httpMocks.createRequest({ method: 'GET', url: '/api/selectOption', query: { selection: "carly" } });
        var resNoId = httpMocks.createResponse();
        (0, routes_1.selectOption)(reqNoId, resNoId);
        // check that the request failed
        assert.strictEqual(resNoId._getStatusCode(), 400);
        assert.deepEqual(resNoId._getData(), "missing 'id' parameter");
        // id provided doesn't exist
        var reqBadId = httpMocks.createRequest({ method: 'GET', url: '/api/selectOption', query: { id: "5", selection: "carly" } });
        var resBadId = httpMocks.createResponse();
        (0, routes_1.selectOption)(reqBadId, resBadId);
        // check that the request failed
        assert.strictEqual(resBadId._getStatusCode(), 400);
        assert.deepEqual(resBadId._getData(), "Invalid id");
        // missing a selection
        var reqFirst = httpMocks.createRequest({ method: 'GET', url: '/api/selectOption', query: { id: "1", selection: "boy" } });
        var resFirst = httpMocks.createResponse();
        (0, routes_1.selectOption)(reqFirst, resFirst);
        // check that the request failed
        assert.strictEqual(resFirst._getStatusCode(), 200);
        assert.deepEqual(resFirst._getData(), { id: 1, picks: ["boy"],
            rounds: 13, options: ["genius"], drafters: ["B", "me"] });
        // successfully chose a first option (first one)
        var reqSecond = httpMocks.createRequest({ method: 'GET', url: '/api/selectOption', query: { id: "2", selection: "carly" } });
        var resSecond = httpMocks.createResponse();
        (0, routes_1.selectOption)(reqSecond, resSecond);
        // check that the request succeeded
        assert.strictEqual(resSecond._getStatusCode(), 200);
        assert.deepEqual(resSecond._getData(), { id: 2, picks: ["carly"],
            rounds: 15, options: ["rae", "jepsen"], drafters: ["taylor", "swift", "lover"] });
        // successfully chose a second option (last one)
        var reqThird = httpMocks.createRequest({ method: 'GET', url: '/api/selectOption', query: { id: "2", selection: "jepsen" } });
        var resThird = httpMocks.createResponse();
        (0, routes_1.selectOption)(reqThird, resThird);
        // check that the request succeeded
        assert.strictEqual(resThird._getStatusCode(), 200);
        assert.deepEqual(resThird._getData(), { id: 2, picks: ["carly", "jepsen"],
            rounds: 15, options: ["rae"], drafters: ["taylor", "swift", "lover"] });
        // successfully chose the last option
        // successfully chose a second option (last one)
        var reqLast = httpMocks.createRequest({ method: 'GET', url: '/api/selectOption', query: { id: "2", selection: "rae" } });
        var resLast = httpMocks.createResponse();
        (0, routes_1.selectOption)(reqLast, resLast);
        // check that the request succeeded
        assert.strictEqual(resLast._getStatusCode(), 200);
        assert.deepEqual(resLast._getData(), { id: 2, picks: ["carly", "jepsen", "rae"],
            rounds: 15, options: [], drafters: ["taylor", "swift", "lover"] });
    });
    it('remove', function () {
        // remove the only element
        var firstArr = ["a"];
        var firstTarget = "a";
        (0, routes_1.remove)(firstArr, firstTarget);
        assert.deepStrictEqual(firstArr, []);
        // remove the last element
        var secondArr = ["a", "b"];
        var secondTarget = "b";
        (0, routes_1.remove)(secondArr, secondTarget);
        assert.deepStrictEqual(secondArr, ["a"]);
        // remove the first element
        var thirdArr = ["a", "b"];
        var thirdTarget = "a";
        (0, routes_1.remove)(thirdArr, thirdTarget);
        assert.deepStrictEqual(thirdArr, ["b"]);
        // remove the middle element
        var fourthArr = ["a", "b", "c"];
        var fourthTarget = "b";
        (0, routes_1.remove)(fourthArr, fourthTarget);
        assert.deepStrictEqual(fourthArr, ["a", "c"]);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVzX3Rlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcm91dGVzX3Rlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDZDQUFpQztBQUNqQyx5REFBNkM7QUFDN0MsbUNBQWdGO0FBR2hGLFFBQVEsQ0FBQyxRQUFRLEVBQUU7SUFFakIsRUFBRSxDQUFDLE9BQU8sRUFBRTtRQUNWLElBQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxhQUFhLENBQ2hDLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxFQUFDLElBQUksRUFBRSxPQUFPLEVBQUMsRUFBQyxDQUFDLENBQUM7UUFDaEUsSUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3hDLElBQUEsY0FBSyxFQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNsQixNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUMvQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUNyRCxDQUFDLENBQUMsQ0FBQztJQUdILEVBQUUsQ0FBQyxNQUFNLEVBQUU7UUFDVCxrQkFBa0I7UUFDbEIsSUFBTSxhQUFhLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FDM0MsRUFBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsYUFBYSxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUMsRUFBQyxDQUFDLENBQUM7UUFDL0csSUFBTSxhQUFhLEdBQUUsU0FBUyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ2hELElBQUEsYUFBSSxFQUFDLGFBQWEsRUFBRSxh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