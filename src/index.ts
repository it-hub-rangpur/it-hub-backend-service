import mongoose from "mongoose";
import env from "./configs/envConfig";
import AppServer from "./socket";

const uri: string | undefined =
  env.node_environment !== "production"
    ? "mongodb+srv://shohag:Password7771@cluster0.u2jjc2l.mongodb.net/it_hub_dev?retryWrites=true"
    : env.db_uri;

async function dbConnection() {
  try {
    if (uri) {
      await mongoose.connect(uri as string);
      AppServer.listen(env.port, () => {
        console.log(`server is listening on port: ${env.port}`);
      });
    } else {
      console.log("db uri is not defined");
    }
  } catch (err) {
    console.log(`Failed to connect database ${err}`);
  }
}

dbConnection();
