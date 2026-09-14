import type { ServiceFillGuide } from "./types";

/**
 * Fill guides لكل خدمة.
 * تركز على الخدمات اللي ممكن تتقدم إلكترونياً أو لها موقع رسمي.
 */
export const FILL_GUIDES: Record<string, ServiceFillGuide> = {
  "replace-lost-national-id": {
    service_slug: "replace-lost-national-id",
    service_name: "بدل فاقد بطاقة الرقم القومي",
    official_url: "https://moi.gov.eg",
    official_url_label: "وزارة الداخلية",
    steps: [
      {
        id: "s1",
        title: "افتح موقع وزارة الداخلية",
        external_url: "https://moi.gov.eg",
        instruction: "هيفتحلك في تاب جديد. لو مافتحش، ابحث عن 'وزارة الداخلية' في جوجل.",
      },
      {
        id: "s2",
        title: "ابحث عن 'الأحوال المدنية' أو 'السجل المدني'",
        instruction: "من القائمة الرئيسية، اختر قسم 'الأحوال المدنية'.",
      },
      {
        id: "s3",
        title: "اختر خدمة 'بدل فاقد بطاقة الرقم القومي'",
      },
      {
        id: "s4",
        title: "الصق اسمك في خانة 'الاسم'",
        copy_field: "full_name",
        instruction: "اضغط زر '📋 انسخ الاسم' ثم الصقه في الموقع (Ctrl+V).",
      },
      {
        id: "s5",
        title: "الصق رقمك القومي في خانة 'الرقم القومي'",
        copy_field: "national_id",
        instruction: "اضغط '📋 انسخ الرقم القومي' ثم الصقه.",
      },
      {
        id: "s6",
        title: "الصق عنوانك",
        copy_field: "address",
        instruction: "أو اكتبه يدوياً في الموقع.",
      },
      {
        id: "s7",
        title: "الصق رقم تليفونك",
        copy_field: "phone",
      },
      {
        id: "s8",
        title: "ارفع المستندات المطلوبة",
        instruction: "محضر الفقدان + صورة شخصية + البطاقة (إن وُجدت).",
      },
      {
        id: "s9",
        title: "راجع الطلب وأرسله",
        instruction: "تأكد من صحة البيانات قبل الإرسال النهائي.",
      },
    ],
    notes: [
      "الرقم القومي مطلوب للتحقق من هويتك.",
      "قد يُطلب منك تسجيل الدخول أولاً.",
      "احتفظ برقم الطلب بعد الإرسال للمتابعة.",
    ],
  },

  "passport-first-time": {
    service_slug: "passport-first-time",
    service_name: "إصدار جواز سفر لأول مرة",
    official_url: "https://moi.gov.eg",
    official_url_label: "وزارة الداخلية - الجوازات",
    steps: [
      {
        id: "s1",
        title: "افتح موقع وزارة الداخلية",
        external_url: "https://moi.gov.eg",
      },
      {
        id: "s2",
        title: "اختر 'مصلحة الجوازات والهجرة'",
      },
      {
        id: "s3",
        title: "اختر خدمة 'إصدار جواز سفر'",
      },
      {
        id: "s4",
        title: "الصق اسمك",
        copy_field: "full_name",
      },
      {
        id: "s5",
        title: "الصق رقمك القومي",
        copy_field: "national_id",
      },
      {
        id: "s6",
        title: "الصق عنوانك ورقم تليفونك",
        copy_field: "address",
      },
      {
        id: "s7",
        title: "ارفع الصور والمستندات",
      },
      {
        id: "s8",
        title: "ادفع الرسوم",
        instruction: "380 جنيه مصري (تقريباً).",
      },
    ],
    notes: [
      "لازم تكون استخرجت بطاقة الرقم القومي أولاً.",
      "موقف التجنيد مطلوب للذكور.",
    ],
  },

  "driver-license-renew": {
    service_slug: "driver-license-renew",
    service_name: "تجديد رخصة قيادة",
    official_url: "https://moi.gov.eg",
    official_url_label: "وزارة الداخلية - المرور",
    steps: [
      {
        id: "s1",
        title: "افتح موقع وزارة الداخلية",
        external_url: "https://moi.gov.eg",
      },
      {
        id: "s2",
        title: "اختر 'الإدارة العامة للمرور'",
      },
      {
        id: "s3",
        title: "اختر 'تجديد رخصة قيادة'",
      },
      {
        id: "s4",
        title: "الصق رقمك القومي",
        copy_field: "national_id",
      },
      {
        id: "s5",
        title: "الصق رقم تليفونك",
        copy_field: "phone",
      },
      {
        id: "s6",
        title: "ارفع صور المستندات",
        instruction: "الرخصة القديمة + الكشف الطبي.",
      },
      {
        id: "s7",
        title: "ادفع الرسوم وأرسل",
      },
    ],
    notes: [
      "قد تحتاج رفع صورة الكشف الطبي.",
      "الرخصة تُستلم من أقرب وحدة مرور.",
    ],
  },

  "criminal-record": {
    service_slug: "criminal-record",
    service_name: "استخراج صحيفة الحالة الجنائية",
    official_url: "https://moi.gov.eg",
    official_url_label: "وزارة الداخلية",
    steps: [
      {
        id: "s1",
        title: "افتح موقع وزارة الداخلية",
        external_url: "https://moi.gov.eg",
      },
      {
        id: "s2",
        title: "ابحث عن 'صحيفة الحالة الجنائية'",
      },
      {
        id: "s3",
        title: "الصق اسمك",
        copy_field: "full_name",
      },
      {
        id: "s4",
        title: "الصق رقمك القومي",
        copy_field: "national_id",
      },
      {
        id: "s5",
        title: "الصق عنوانك",
        copy_field: "address",
      },
      {
        id: "s6",
        title: "ادفع الرسوم",
        instruction: "50 جنيه مصري (تقريباً).",
      },
    ],
    notes: [
      "الخدمة متاحة إلكترونياً من خلال وزارة الداخلية.",
      "تُسلَّم في نفس اليوم.",
    ],
  },
};


export function getFillGuide(slug: string): ServiceFillGuide | null {
  return FILL_GUIDES[slug] ?? null;
}


export function hasFillGuide(slug: string): boolean {
  return slug in FILL_GUIDES;
}