import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.kulavuzfinans.app",
  appName: "Kulavuz Finans",
  webDir: "public", // Next.js statik dosyaları
  server: {
    // BURAYA VERCEL'DEKİ SİTE ADRESİNİ YAZ (https://... ile başlayan)
    url: "https://kulavuz-finans-v2.vercel.app/",
    cleartext: true,
  },
};

export default config;
