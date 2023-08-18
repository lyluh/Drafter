"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var routes_1 = require("./routes");
var body_parser_1 = __importDefault(require("body-parser"));
// Configure and start the HTTP server.
var port = 8088;
var app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.get("/api/dummy", routes_1.Dummy);
app.post("/api/save", routes_1.Save);
app.get("/api/load", routes_1.Load);
app.get("/api/selectOption", routes_1.selectOption);
app.listen(port, function () { return console.log("Server listening on ".concat(port)); });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvREFBOEI7QUFDOUIsbUNBQTJEO0FBQzNELDREQUFxQztBQUdyQyx1Q0FBdUM7QUFDdkMsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLElBQU0sR0FBRyxHQUFHLElBQUEsaUJBQU8sR0FBRSxDQUFDO0FBQ3RCLEdBQUcsQ0FBQyxHQUFHLENBQUMscUJBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBRTNCLEdBQUcsQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLGNBQUssQ0FBQyxDQUFDO0FBRTdCLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLGFBQUksQ0FBQyxDQUFDO0FBQzVCLEdBQUcsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLGFBQUksQ0FBQyxDQUFDO0FBQzNCLEdBQUcsQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUscUJBQVksQ0FBQyxDQUFDO0FBRzNDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLGNBQU0sT0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUF1QixJQUFJLENBQUUsQ0FBQyxFQUExQyxDQUEwQyxDQUFDLENBQUMifQ==