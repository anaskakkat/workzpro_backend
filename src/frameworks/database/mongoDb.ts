import mongoose from "mongoose";
import {MONGO_URI} from'../constants/env'



mongoose.connect(MONGO_URI);
const db=mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

export default db;