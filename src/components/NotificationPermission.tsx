"use client";
import { useEffect } from "react";
import { LocalNotifications } from "@capacitor/local-notifications";

export default function NotificationPermission() {
  useEffect(() => {
    const requestPermission = async () => {
      const permission = await LocalNotifications.requestPermissions();
      if (permission.display === "granted") {
        console.log("Bildirim izni alındı!");
      }
    };
    requestPermission();
  }, []);

  return null; // Görünmez bileşen
}
