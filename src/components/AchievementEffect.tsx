"use client";
import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function AchievementEffect({ isNew }: { isNew: boolean }) {
  useEffect(() => {
    if (isNew) {
      // 🎉 Konfeti Patlatma Ayarları
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const interval: any = setInterval(function () {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: Math.random(), y: Math.random() - 0.2 },
        });
      }, 250);
    }
  }, [isNew]);

  return null; // Görsel bir şey döndürmez, sadece efekti çalıştırır
}
