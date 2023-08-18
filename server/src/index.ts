import express from "express";
import { Dummy, Load, Save, selectOption } from './routes';
import bodyParser from 'body-parser';


// Configure and start the HTTP server.
const port = 8088;
const app = express();
app.use(bodyParser.json());

app.get("/api/dummy", Dummy);

app.post("/api/save", Save);
app.get("/api/load", Load);
app.get("/api/selectOption", selectOption);


app.listen(port, () => console.log(`Server listening on ${port}`));
