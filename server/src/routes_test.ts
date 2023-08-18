import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { Dummy, Load, Save, remove, resetDrafts, selectOption } from './routes';


describe('routes', function() {

  it('Dummy', function() {
    const req1 = httpMocks.createRequest(
        {method: 'GET', url: '/api/dummy', query: {name: 'Kevin'}});
    const res1 = httpMocks.createResponse();
    Dummy(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepEqual(res1._getJSONData(), 'Hi, Kevin');
  });

  
  it('Save', function() {
    // no rounds input
    const reqEmptyRound = httpMocks.createRequest(
      {method: 'POST', url: '/api/save', query: {name: "You", rawOptions: "boy\ngenius", rawDrafters: "You\nme"}}); 
    const resEmptyRound= httpMocks.createResponse();
    Save(reqEmptyRound, resEmptyRound);
    // check that the request failed
    assert.strictEqual(resEmptyRound._getStatusCode(), 400);
    assert.deepEqual(resEmptyRound._getData(), "missing 'rounds' parameter");

    // no options input
    const reqEmptyOptions = httpMocks.createRequest(
      {method: 'POST', url: '/api/save', query: {rounds: "3", name: "You", rawDrafters: "You\nme"}}); 
    const resEmptyOptions= httpMocks.createResponse();
    Save(reqEmptyOptions, resEmptyOptions);
    // check that the request failed
    assert.strictEqual(resEmptyOptions._getStatusCode(), 400);
    assert.deepEqual(resEmptyOptions._getData(), "Must have 1 or more options");

    // no drafters input
    const reqEmptyDrafters = httpMocks.createRequest(
      {method: 'POST', url: '/api/save', query: {rounds: "3", name: "You", rawOptions: "Bob\nBill"}}); 
    const resEmptyDrafters= httpMocks.createResponse();
    Save(reqEmptyDrafters, resEmptyDrafters);
    // check that the request failed
    assert.strictEqual(resEmptyDrafters._getStatusCode(), 400);
    assert.deepEqual(resEmptyDrafters._getData(), "missing drafters");

    // only one drafter
    const reqOneDrafters = httpMocks.createRequest(
      {method: 'POST', url: '/api/save', query: {rounds: "3", name: "You", rawDrafters: "You", rawOptions: "Bob\nBill"}}); 
    const resOneDrafters= httpMocks.createResponse();
    Save(reqOneDrafters, resOneDrafters);
    // check that the request failed
    assert.strictEqual(resOneDrafters._getStatusCode(), 400);
    assert.deepEqual(resOneDrafters._getData(), "must have 2 or more drafters");


    // no name
    const reqEmptyName = httpMocks.createRequest(
        {method: 'POST', url: '/api/save', query: {rounds: "13", rawOptions: "boy\ngenius", rawDrafters: "You\nme"}}); 
    const resEmptyName= httpMocks.createResponse();
    Save(reqEmptyName, resEmptyName);
    // check that the request failed
    assert.strictEqual(resEmptyName._getStatusCode(), 400);
    assert.deepEqual(resEmptyName._getData(), "You must say who you are!");

    
    // name doesn't match one of the drafters
    const reqBadName = httpMocks.createRequest(
      {method: 'POST', url: '/api/save', query: {rounds: "13", name: "Cady", rawOptions: "boy\ngenius", rawDrafters: "You\nme"}}); 
    const resBadName= httpMocks.createResponse();
    Save(reqBadName, resBadName);
    // check that the request failed
    assert.strictEqual(resBadName._getStatusCode(), 400);
    assert.deepEqual(resBadName._getData(), "You are not one of the drafters!");

  

   
    
    // successfully adding one draft
    const reqFirst = httpMocks.createRequest( 
      {method: 'POST', url: '/api/save', query: {rounds: "13", name: "B", rawOptions: "boy\ngenius", rawDrafters: "B\nme"}}); 
    const resFirst = httpMocks.createResponse();
    Save(reqFirst, resFirst);
    // check that the request succeeded
    assert.strictEqual(resFirst._getStatusCode(), 200);
    // and the response data is as expected
    assert.deepStrictEqual(resFirst._getData(), {idName: 1});
    // assert.deepEqual(resFirst._getData(), new Map([[1, {idName: 1, picks: [],
    //                                                     rounds: 13, options: ["boy", "genius"], drafters: ["B", "me"]}]]));


    // adding a second file
    const reqSecond = httpMocks.createRequest( 
      {method: 'POST', url: '/api/save', query: {rounds: "15", name: "lover", rawOptions: "carly\nrae\njepsen", rawDrafters: "taylor\nswift\nlover"}}); 
    const resSecond = httpMocks.createResponse();
    Save(reqSecond, resSecond);
    // check that the request succeeded
    assert.strictEqual(resSecond._getStatusCode(), 200);
    // and the response data is as expected
    assert.deepStrictEqual(resSecond._getData(), {idName: 2});

    // assert.deepEqual(resSecond._getData(), new Map([[1, {id: 1, picks: [], 
    //                                                     rounds: 13, options: ["boy", "genius"], drafters: ["B", "me"]}],
    //                                                 [2, {id: 2, picks: [],
    //                                                   rounds: 15, options: ["carly", "rae", "jepsen"], drafters: ["taylor", "swift", "lover"]}]]));
    resetDrafts();
  });


  it('Load', function() {
    // no drafts to load
    const reqNoDrafts = httpMocks.createRequest(
      {method: 'GET', url: '/api/load', query: {id: "2", name: "bill"}}); 
    const resNoDrafts = httpMocks.createResponse();
    Load(reqNoDrafts, resNoDrafts);
    // check that the request failed
    assert.strictEqual(resNoDrafts._getStatusCode(), 400);
    assert.deepEqual(resNoDrafts._getData(), "There are no drafts yet!");


    // add two drafts
    const reqFirst = httpMocks.createRequest( 
      {method: 'POST', url: '/api/save', query: {rounds: "13", name: "B", rawOptions: "boy\ngenius", rawDrafters: "B\nme"}}); 
    const resFirst = httpMocks.createResponse();
    Save(reqFirst, resFirst);

    const reqSecond = httpMocks.createRequest( 
      {method: 'POST', url: '/api/save', query: {rounds: "15", name: "lover", rawOptions: "carly\nrae\njepsen", rawDrafters: "taylor\nswift\nlover"}}); 
    const resSecond = httpMocks.createResponse();
    Save(reqSecond, resSecond);


    // no id provided
    const reqNoId = httpMocks.createRequest(
      {method: 'GET', url: '/api/load', query: {name: "B"}}); 
    const resNoId = httpMocks.createResponse(resSecond);
    Load(reqNoId, resNoId);
    // check that the request failed
    assert.strictEqual(resNoId._getStatusCode(), 400);
    assert.deepEqual(resNoId._getData(), "missing 'id' parameter");
    

    // id provided doesn't exist
    const reqBadId = httpMocks.createRequest(
      {method: 'GET', url: '/api/load', query: {id: "5", name: "B"}}); 
    const resBadId = httpMocks.createResponse();
    Load(reqBadId, resBadId);
    // check that the request failed
    assert.strictEqual(resBadId._getStatusCode(), 400);
    assert.deepEqual(resBadId._getData(), `no such draft with id: 5 exists`);

    // no name provided
    const reqEmptyName = httpMocks.createRequest(
      {method: 'GET', url: '/api/load', query: {id: "1"}}); 
    const resEmptyName= httpMocks.createResponse();
    Load(reqEmptyName, resEmptyName);
    // check that the request failed
    assert.strictEqual(resEmptyName._getStatusCode(), 400);
    assert.deepEqual(resEmptyName._getData(), "You must say who you are!");

    
    // name doesn't match one of the drafters
    const reqBadName = httpMocks.createRequest(
      {method: 'GET', url: '/api/load', query: {id: "1", name: "Bella"}}); 
    const resBadName= httpMocks.createResponse();
    Load(reqBadName, resBadName);
    // check that the request failed
    assert.strictEqual(resBadName._getStatusCode(), 400);
    assert.deepEqual(resBadName._getData(), "You are not one of the drafters!");


    // successfully loads first Draft
    const reqFirstLoad = httpMocks.createRequest( 
    {method: 'GET', url: '/api/load', query: {id: "1", name: "me"}}); 
    const resFirstLoad = httpMocks.createResponse();
    Load(reqFirstLoad, resFirstLoad);
    // check that the request succeeded
    assert.strictEqual(resFirstLoad._getStatusCode(), 200);
    // and the response data is as expected
    assert.deepEqual(resFirstLoad._getData(), {id: 1, picks: [],
                                               rounds: 13, options: ["boy", "genius"], drafters: ["B", "me"]});


    // successfully loads second Draft
    const reqSecondLoad = httpMocks.createRequest( 
      {method: 'GET', url: '/api/load', query: {id: "2", name: "swift"}}); 
    const resSecondLoad = httpMocks.createResponse();
    Load(reqSecondLoad, resSecondLoad);
    // check that the request succeeded
    assert.strictEqual(resSecondLoad._getStatusCode(), 200);
    // and the response data is as expected
    assert.deepEqual(resSecondLoad._getData(), {id: 2, picks: [], 
    rounds: 15, options: ["carly", "rae", "jepsen"], drafters: ["taylor", "swift", "lover"]});
  });


  it('selectOption', function() {
    // no id provided
    const reqNoId = httpMocks.createRequest(
      {method: 'GET', url: '/api/selectOption', query: {selection: "carly"}}); 
    const resNoId = httpMocks.createResponse();
    selectOption(reqNoId, resNoId);
    // check that the request failed
    assert.strictEqual(resNoId._getStatusCode(), 400);
    assert.deepEqual(resNoId._getData(), "missing 'id' parameter");
    
    // id provided doesn't exist
    const reqBadId = httpMocks.createRequest(
      {method: 'GET', url: '/api/selectOption', query: {id: "5", selection: "carly"}}); 
    const resBadId= httpMocks.createResponse();
    selectOption(reqBadId, resBadId);
    // check that the request failed
    assert.strictEqual(resBadId._getStatusCode(), 400);
    assert.deepEqual(resBadId._getData(), "Invalid id");


    // missing a selection
    const reqFirst = httpMocks.createRequest(
      {method: 'GET', url: '/api/selectOption', query: {id: "1", selection: "boy"}}); 
    const resFirst= httpMocks.createResponse();
    selectOption(reqFirst, resFirst);
    // check that the request failed
    assert.strictEqual(resFirst._getStatusCode(), 200);
    assert.deepEqual(resFirst._getData(), {id: 1, picks: ["boy"], 
                                           rounds: 13, options: ["genius"], drafters: ["B", "me"]});

    
    // successfully chose a first option (first one)
    const reqSecond = httpMocks.createRequest(
      {method: 'GET', url: '/api/selectOption', query: {id: "2", selection: "carly"}}); 
    const resSecond = httpMocks.createResponse();
    selectOption(reqSecond, resSecond);
    // check that the request succeeded
    assert.strictEqual(resSecond._getStatusCode(), 200);
    assert.deepEqual(resSecond._getData(), {id: 2, picks: ["carly"], 
    rounds: 15, options: ["rae", "jepsen"], drafters: ["taylor", "swift", "lover"]});

    // successfully chose a second option (last one)
    const reqThird = httpMocks.createRequest(
      {method: 'GET', url: '/api/selectOption', query: {id: "2", selection: "jepsen"}}); 
    const resThird = httpMocks.createResponse();
    selectOption(reqThird, resThird);
    // check that the request succeeded
    assert.strictEqual(resThird._getStatusCode(), 200);
    assert.deepEqual(resThird._getData(), {id: 2, picks: ["carly", "jepsen"], 
    rounds: 15, options: ["rae"], drafters: ["taylor", "swift", "lover"]});

    // successfully chose the last option
    // successfully chose a second option (last one)
    const reqLast = httpMocks.createRequest(
      {method: 'GET', url: '/api/selectOption', query: {id: "2", selection: "rae"}}); 
    const resLast = httpMocks.createResponse();
    selectOption(reqLast, resLast);
    // check that the request succeeded
    assert.strictEqual(resLast._getStatusCode(), 200);
    assert.deepEqual(resLast._getData(), {id: 2, picks: ["carly", "jepsen", "rae"], 
    rounds: 15, options: [], drafters: ["taylor", "swift", "lover"]});
  });


  it('remove', function() {
    // remove the only element
    const firstArr = ["a"]
    const firstTarget = "a"
    remove(firstArr, firstTarget)
    assert.deepStrictEqual(firstArr, []);

    // remove the last element
    const secondArr = ["a", "b"]
    const secondTarget = "b"
    remove(secondArr, secondTarget)
    assert.deepStrictEqual(secondArr, ["a"]);

    // remove the first element
    const thirdArr = ["a", "b"]
    const thirdTarget = "a"
    remove(thirdArr, thirdTarget)
    assert.deepStrictEqual(thirdArr, ["b"]);

    // remove the middle element
    const fourthArr = ["a", "b", "c"]
    const fourthTarget = "b"
    remove(fourthArr, fourthTarget)
    assert.deepStrictEqual(fourthArr, ["a", "c"]);
  });

});


