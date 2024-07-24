import app from './frameworks/express/app'

import { PORT } from "./frameworks/constants/env";
import './frameworks/database/mongoDb'




app.get("/", (req, res) => res.send("Server is  Ready.."));
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
  });
