import { useState } from "react";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import Spinner from "../components/ui/Spinner";
import PharaohPattern from "../components/patterns/PharaohPattern";
import CategoryFormModal from "../features/categories/CategoryFormModal";
import {
  useCategories,
  useDeleteCategory,
} from "../features/categories/hooks";
import type { Category } from "../features/categories/types";

export default function Categories() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const pageSize = 10;

  const { data, isLoading, isError, error } = useCategories({
    page,
    page_size: pageSize,
  });

  const deleteMutation = useDeleteCategory();

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const handleDelete = (cat: Category) => {
    const ok = window.confirm(
      `هل أنت متأكد من حذف التصنيف "${cat.name}"؟\n\nلا يمكن التراجع عن هذا الإجراء.`
    );
    if (!ok) return;
    deleteMutation.mutate(cat.id, {
      onError: (err: unknown) => {
        const anyErr = err as { response?: { data?: { detail?: string } } };
        alert(
          "فشل الحذف: " +
            (anyErr.response?.data?.detail || "خطأ غير معروف")
        );
      },
    });
  };

  const filtered =
    data?.items.filter((c) => {
      if (!search) return true;
      const q = search.trim().toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q)
      );
    }) ?? [];

  return (
    <div className="space-y-6">
      {/* ===== Page Header ===== */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-sand-100 via-sand-50 to-white border border-pharaoh-gold/30">
        <div className="h-1 flex">
          <div className="flex-1 bg-egypt-red" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-egypt-black" />
        </div>
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <div className="absolute -left-4 -bottom-4 text-[140px] leading-none text-pharaoh-gold">
            𓂀
          </div>
        </div>
        <div className="relative px-6 py-6 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <span className="text-3xl">𓂀</span>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-extrabold">
                <span className="bg-gradient-to-l from-egypt-red-dark via-egypt-red to-pharaoh-gold-dark bg-clip-text text-transparent">
                  التصنيفات
                </span>
              </h1>
              <p className="text-sm text-gray-600 mt-0.5">
                إدارة تصنيفات الخدمات الحكومية
              </p>
            </div>
          </div>
          <Button variant="gold" onClick={openCreate}>
            + تصنيف جديد
          </Button>
        </div>
        <PharaohPattern className="opacity-25" height={16} />
      </div>

      {/* ===== Search bar ===== */}
      <div className="bg-white rounded-xl border border-sand-200 p-3 flex items-center gap-3">
        <span className="text-pharaoh-gold text-lg px-2">𓊪</span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث بالاسم أو الـ slug..."
          className="flex-1 px-3 py-2 rounded-lg border-0 bg-transparent text-sm focus:outline-none placeholder:text-gray-400"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="text-xs text-gray-400 hover:text-egypt-red px-2"
            type="button"
          >
            مسح ✕
          </button>
        )}
      </div>

      {/* ===== Content ===== */}
      <div className="bg-white rounded-2xl border border-sand-200 overflow-hidden shadow-sm">
        {isLoading && <Spinner size="lg" />}

        {isError && (
          <div className="p-6 text-center text-egypt-red">
            <div className="text-3xl mb-2">⚠️</div>
            <div className="font-semibold">حدث خطأ أثناء تحميل البيانات</div>
            <div className="text-xs text-gray-500 mt-1">
              {(error as Error)?.message || "خطأ غير معروف"}
            </div>
          </div>
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <EmptyState
            icon="𓂀"
            title={search ? "لا توجد نتائج" : "لا توجد تصنيفات بعد"}
            description={
              search
                ? "جرب البحث بكلمة أخرى"
                : "ابدأ بإضافة أول تصنيف"
            }
            action={
              !search && (
                <Button variant="gold" onClick={openCreate}>
                  + تصنيف جديد
                </Button>
              )
            }
          />
        )}

        {!isLoading && !isError && filtered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-l from-sand-100 to-sand-50 border-b border-sand-200 text-gray-700">
                  <th className="px-4 py-3.5 text-right font-bold w-16">#</th>
                  <th className="px-4 py-3.5 text-right font-bold">الاسم</th>
                  <th className="px-4 py-3.5 text-right font-bold">Slug</th>
                  <th className="px-4 py-3.5 text-right font-bold">
                    الأيقونة
                  </th>
                  <th className="px-4 py-3.5 text-right font-bold">
                    الترتيب
                  </th>
                  <th className="px-4 py-3.5 text-right font-bold">الحالة</th>
                  <th className="px-4 py-3.5 text-left font-bold">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {filtered.map((cat) => (
                  <tr
                    key={cat.id}
                    className="hover:bg-sand-50/60 transition-colors"
                  >
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                      {cat.id}
                    </td>
                    <td className="px-4 py-3 font-semibold text-egypt-black">
                      {cat.name}
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs bg-sand-100 px-2 py-1 rounded-md text-gray-700 border border-sand-200">
                        {cat.slug}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      {cat.icon ? (
                        <span className="text-xs text-gray-600">
                          {cat.icon}
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                      {cat.sort_order}
                    </td>
                    <td className="px-4 py-3">
                      {cat.is_active ? (
                        <Badge color="green">نشط</Badge>
                      ) : (
                        <Badge color="gray">معطّل</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => openEdit(cat)}
                        >
                          ✏️ تعديل
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          loading={
                            deleteMutation.isPending &&
                            deleteMutation.variables === cat.id
                          }
                          onClick={() => handleDelete(cat)}
                        >
                          🗑️ حذف
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ===== Pagination ===== */}
      {data && data.total_pages > 1 && (
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="text-sm text-gray-600">
            صفحة <strong>{data.page}</strong> من{" "}
            <strong>{data.total_pages}</strong> — إجمالي{" "}
            <strong>{data.total}</strong> تصنيف
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ← السابق
            </Button>
            <Button
              size="sm"
              variant="secondary"
              disabled={page >= data.total_pages}
              onClick={() => setPage((p) => p + 1)}
            >
              التالي →
            </Button>
          </div>
        </div>
      )}

      {/* ===== Modal ===== */}
      <CategoryFormModal
        isOpen={modalOpen}
        onClose={closeModal}
        category={editing}
      />
    </div>
  );
}