import { useEffect, useState, type FormEvent } from "react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import Textarea from "../../components/ui/Textarea";
import {
  useCreateCategory,
  useUpdateCategory,
} from "./hooks";
import type { Category, CategoryCreate, CategoryUpdate } from "./types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
}

interface FormState {
  name: string;
  slug: string;
  description: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
}

const emptyForm: FormState = {
  name: "",
  slug: "",
  description: "",
  icon: "",
  sort_order: 0,
  is_active: true,
};

function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function CategoryFormModal({ isOpen, onClose, category }: Props) {
  const isEdit = !!category;
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [autoSlug, setAutoSlug] = useState(true);

  const createMut = useCreateCategory();
  const updateMut = useUpdateCategory();
  const isLoading = createMut.isPending || updateMut.isPending;

  useEffect(() => {
    if (isOpen) {
      setServerError(null);
      setErrors({});
      if (category) {
        setForm({
          name: category.name,
          slug: category.slug,
          description: category.description ?? "",
          icon: category.icon ?? "",
          sort_order: category.sort_order,
          is_active: category.is_active,
        });
        setAutoSlug(false);
      } else {
        setForm(emptyForm);
        setAutoSlug(true);
      }
    }
  }, [isOpen, category]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleNameChange = (value: string) => {
    update("name", value);
    if (autoSlug) {
      update("slug", slugify(value));
    }
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) e.name = "الاسم مطلوب";
    if (!form.slug.trim()) e.slug = "الـ slug مطلوب";
    else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug)) {
      e.slug = "الـ slug لازم يكون بحروف إنجليزية صغيرة وأرقام وشرطات فقط";
    }
    if (form.sort_order < 0) e.sort_order = "الترتيب لازم يكون 0 أو أكثر";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    setServerError(null);
    if (!validate()) return;

    const payload: CategoryCreate = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description.trim() || null,
      icon: form.icon.trim() || null,
      sort_order: form.sort_order,
      is_active: form.is_active,
    };

    try {
      if (isEdit && category) {
        const updatePayload: CategoryUpdate = { ...payload };
        await updateMut.mutateAsync({ id: category.id, payload: updatePayload });
      } else {
        await createMut.mutateAsync(payload);
      }
      onClose();
    } catch (err: unknown) {
      const anyErr = err as {
        response?: { status?: number; data?: { detail?: unknown } };
      };
      const status = anyErr.response?.status;
      const detail = anyErr.response?.data?.detail;

      if (status === 409) {
        setServerError(
          typeof detail === "string"
            ? detail
            : "هذا الـ slug مستخدم بالفعل"
        );
      } else if (typeof detail === "string") {
        setServerError(detail);
      } else {
        setServerError("حدث خطأ غير متوقع. حاول مرة أخرى.");
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "تعديل تصنيف" : "تصنيف جديد"}
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
            {isEdit ? "حفظ التغييرات" : "إنشاء التصنيف"}
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
          onChange={(e) => handleNameChange(e.target.value)}
          error={errors.name}
          placeholder="مثال: الرقم القومي"
          autoFocus
        />

        <Input
          label="الـ Slug"
          name="slug"
          value={form.slug}
          onChange={(e) => {
            setAutoSlug(false);
            update("slug", slugify(e.target.value));
          }}
          error={errors.slug}
          placeholder="national-id"
          hint="حروف إنجليزية صغيرة وأرقام وشرطات فقط"
          dir="ltr"
          className="text-left"
        />

        <Textarea
          label="الوصف (اختياري)"
          name="description"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="وصف مختصر للتصنيف..."
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="الأيقونة (اختياري)"
            name="icon"
            value={form.icon}
            onChange={(e) => update("icon", e.target.value)}
            placeholder="id-card"
          />
          <Input
            label="الترتيب"
            name="sort_order"
            type="number"
            min={0}
            value={form.sort_order}
            onChange={(e) =>
              update("sort_order", parseInt(e.target.value) || 0)
            }
            error={errors.sort_order}
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => update("is_active", e.target.checked)}
            className="w-4 h-4 rounded border-sand-300 text-pharaoh-gold focus:ring-pharaoh-gold"
          />
          <span className="text-sm text-gray-700">
            التصنيف <strong>نشط</strong> (يظهر للمستخدمين)
          </span>
        </label>
      </form>
    </Modal>
  );
}