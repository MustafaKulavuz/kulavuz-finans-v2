"use client";
import { LocalNotifications } from "@capacitor/local-notifications";
import { BellRing } from "lucide-react";

export default function AykutNotificationButton() {
  const bildirimGonder = async () => {
    let permission = await LocalNotifications.checkPermissions();
    if (permission.display !== "granted")
      permission = await LocalNotifications.requestPermissions();
    if (permission.display === "granted") {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: "Harcama Uyarısı!",
            body: "Kardeşim o parayı harcama, lazım olur...",
            id: Math.floor(Math.random() * 1000),
            schedule: { at: new Date(Date.now() + 1000) },
          },
        ],
      });
    }
  };

  return (
    <button
      onClick={bildirimGonder}
      className="mt-4 w-full flex items-center justify-center gap-2 rounded-2xl bg-rose-600 p-4 text-white font-bold"
    >
      <BellRing size={20} /> AYKUT MODU TEST
    </button>
  );
}
