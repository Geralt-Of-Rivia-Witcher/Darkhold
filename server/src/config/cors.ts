import { CorsOptions } from "cors";

var whitelist: string[] = [
  "http://localhost:3000",
  "https://darkhold.siddhantkumarsingh.me",
];

export const corsOptions: CorsOptions = {
  origin: (origin, callback: any) => {
    console.log(origin);
    if (whitelist.indexOf(origin!) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  exposedHeaders: ["set-cookie"],
};
