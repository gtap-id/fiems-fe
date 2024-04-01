import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// uncomment code berikut sekiranya udah bener bener aplikasi nya ngelag
// import million from "million/compiler";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // uncomment code berikut sekiranya udah bener bener aplikasi nya ngelag
    // million.vite({ auto: true }),
    react(),
  ],
});
