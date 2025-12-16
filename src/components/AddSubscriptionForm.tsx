"use client";
import { addSubscription } from "@/actions/subscription";
import { CreditCard, Plus } from "lucide-react";
import { LocalNotifications } from "@capacitor/local-notifications";

export default function AddSubscriptionForm() {
  const handleAction = async (formData: FormData) => {
    // 1. Veritabanına kaydet (Server Action)
    await addSubscription(formData);

    const name = formData.get("name") as string;
    const amount = formData.get("amount") as string;
    const day = Number(formData.get("billingDay"));

    // 2. Android için Yerel Bildirim Ayarla
    const now = new Date();
    // Ödeme gününden 1 gün önce, sabah saat 09:00'da hatırlat
    let notifyDate = new Date(now.getFullYear(), now.getMonth(), day - 1, 9, 0);

    // Eğer tarih geçmişse (örn: bugün ayın 20'si ve biz 15'ine kuruyorsak) bir sonraki aya kur
    if (notifyDate < now) {
      notifyDate.setMonth(notifyDate.getMonth() + 1);
    }

    try {
      // Bildirim izni kontrolü ve isteme
      const perm = await LocalNotifications.checkPermissions();
      if (perm.display !== "granted") {
        await LocalNotifications.requestPermissions();
      }

      await LocalNotifications.schedule({
        notifications: [
          {
            title: "Ödeme Hatırlatıcı 🐢",
            body: `Yarın ${name} aboneliğin için ${amount} ₺ ödemen var. Tosbaa hatırlatır!`,
            id: Math.floor(Math.random() * 10000),
            schedule: { at: notifyDate },
            sound: "default",
            actionTypeId: "",
            extra: null,
          },
        ],
      });
      console.log("Bildirim başarıyla kuruldu:", notifyDate);
    } catch (error) {
      // Tarayıcıda hata verebilir, Android'de çalışacaktır
      console.error("Bildirim kurulamadı:", error);
    }
  };

  return (
    <section className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
      <h3 className="flex items-center gap-2 font-black text-slate-800 dark:text-white mb-6 uppercase text-sm tracking-widest">
        <CreditCard className="text-indigo-500" /> Abonelik/Fatura Ekle
      </h3>
      <form action={handleAction} className="grid gap-4">
        <input
          name="name"
          placeholder="Hizmet Adı (Örn: Netflix)"
          className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-sm"
          required
        />
        <div className="flex gap-4">
          <input
            name="amount"
            type="number"
            placeholder="Tutar"
            className="flex-1 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-sm"
            required
          />
          <input
            name="billingDay"
            type="number"
            min="1"
            max="31"
            placeholder="Gün"
            className="w-24 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-sm text-center"
            required
          />
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-black p-4 rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-indigo-100 dark:shadow-none">
          <Plus size={20} /> LİSTEYE EKLE
        </button>
      </form>
    </section>
  );
}
