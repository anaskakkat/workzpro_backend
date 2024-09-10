import { app, server } from './frameworks/express/app';
import { PORT } from "./frameworks/constants/env";
import './frameworks/database/mongoDb';
import initializeSocket from './frameworks/config/socket';

app.get("/", (req, res) => res.send("Server is Ready.."));

const io = initializeSocket(server);

server.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});