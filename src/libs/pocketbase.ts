import Pocketbase from "pocketbase";

export const pb = new Pocketbase(import.meta.env.VITE_POCKETBASE_URL);
pb.autoCancellation(false);
