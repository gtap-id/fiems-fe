import csv from "fast-csv";
import fs from "node:fs";

fs.createReadStream("data.csv")
  .pipe(csv.parse({ headers: true }))
  .on("error", (err) => console.error(err))
  .on("data", (x) => console.log(x));
