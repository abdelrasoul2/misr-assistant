import { useEffect, useState, type FormEvent } from "react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import Textarea from "../../components/ui/Textarea";
import { useCreateSource, useUpdateSource } from "./hooks";
import type { Source, SourceCreate, SourceUpdate } from "./types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  source?: Source | null;
}

interface FormState {
  name: string;
  url: string;
  description: string;
  official: boolean;
  checked_by: string;
}

const emptyForm: FormState = {
  name: "",
  url: "",
  description: "",
  official: true,
  checked_by: "",
};

export default function SourceFormModal({ isOpen, onClose, source }: Props) {
  const isEdit = !!source;
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const createMut = useCreateSource();
  const updateMut = useUpdateSource();
  const isLoading = createMut.isPending || updateMut.isPending;

  useEffect(() => {
    if (isOpen) {
      setServerError(null);
      setErrors({});
      if (source) {
        setForm({
          name: source.name,
          url: source.url,
          description: source.description ?? "",
          official: source.official,
          checked_by: source.checked_by ?? "",
        });
      } else {
        setForm(emptyForm);
      }
    }
  }, [isOpen, source]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) e.name = "الاسم مطلوب";
    if (!form.url.trim()) e.url = "الرابط مطلوب";
    else if (!/^https?:\/\/.+/.test(form.url.trim())) {
      e.url = "الرابط لازم يبدأ بـ http:// أو https://";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    setServerError(null);
    if (!validate()) return;

    const payload: SourceCreate = {
      name: form.name.trim(),
      url: form.url.trim(),
      description: form.description.trim() || null,
      official: form.official,
      checked_by: form.checked_by.trim() || null,
    };

    try {
      if (isEdit && source) {
        const updatePayload: SourceUpdate = { ...payload };
        await updateMut.mutateAsync({ id: source.id, payload: updatePayload });
      } else {
        await createMut.mutateAsync(payload);
      }
      onClose();
    } catch (err: unknown) {
      const anyErr = err as {
        response?: { status?: number; data?: { detail?: unknown } };
      };
      const detail = anyErr.response?.data?.detail;
      if (typeof detail === "string") setServerError(detail);
      else setServerError("حدث خطأ غير متوقع. حاول مرة أخرى.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "تعديل مصدر" : "مصدر جديد"}
      footer={
        <>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            variant="gold"
            loading={isLoading}
            onClick={handleSubmit}
          >
            {isEdit ? "حفظ التغييرات" : "إنشاء المصدر"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {serverError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-start gap-2">
            <span className="text-lg leading-none">⚠️</span>
            <span>{serverError}</span>
          </div>
        )}

        <Input
          label="الاسم"
          name="name"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          error={errors.name}
          placeholder="مثال: وزارة الداخلية"
          autoFocus
        />

        <Input
          label="الرابط الرسمي"
          name="url"
          value={form.url}
          onChange={(e) => update("url", e.target.value)}
          error={errors.url}
          placeholder="https://moi.gov.eg"
          dir="ltr"
          className="text-left"
          hint="لازم يبدأ بـ http:// أو https://"
        />

        <Textarea
          label="الوصف (اختياري)"
          name="description"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="وصف مختصر للمصدر..."
        />

        <Input
          label="تم التحقق بواسطة (اختياري)"
          name="checked_by"
          value={form.checked_by}
          onChange={(e) => update("checked_by", e.target.value)}
          placeholder="اسم المسؤول"
        />

        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.official}
            onChange={(e) => update("official", e.target.checked)}
            className="w-4 h-4 rounded border-sand-300 text-pharaoh-gold focus:ring-pharaoh-gold"
          />
          <span className="text-sm text-gray-700">
            مصدر <strong>رسمي</strong> (حكومي)
          </span>
        </label>
      </form>
    </Modal>
  );
}