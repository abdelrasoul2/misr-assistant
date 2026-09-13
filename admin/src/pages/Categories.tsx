import { useState } from "react";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import Spinner from "../components/ui/Spinner";
import {
  useCategories,
  useDeleteCategory,
} from "../features/categories/hooks";
import type { Category } from "../features/categories/types";

export default function Categories() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const pageSize = 10;

  const { data, isLoading, isError, error } = useCategories({
    page,
    page_size: pageSize,
  });

  const deleteMutation = useDeleteCategory();

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
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">التصنيفات</h1>
          <p className="text-gray-500 mt-1">
            إدارة تصنيفات الخدمات الحكومية
          </p>
        </div>
        <Button onClick={() => alert("سيتم في STEP 6E.4")}>
          + تصنيف جديد
        </Button>
      </div>

      {/* ===== Search bar ===== */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث بالاسم أو الـ slug..."
          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        />
      </div>

      {/* ===== Content ===== */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading && <Spinner size="lg" />}

        {isError && (
          <div className="p-6 text-center text-red-600">
            حدث خطأ أثناء تحميل البيانات:{" "}
            {(error as Error)?.message || "خطأ غير معروف"}
          </div>
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <EmptyState
            icon="📁"
            title={search ? "لا توجد نتائج" : "لا توجد تصنيفات بعد"}
            description={
              search
                ? "جرب البحث بكلمة أخرى"
                : "ابدأ بإضافة أول تصنيف"
            }
          />
        )}

        {!isLoading && !isError && filtered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-gray-600">
                  <th className="px-4 py-3 text-right font-semibold">#</th>
                  <th className="px-4 py-3 text-right font-semibold">
                    الاسم
                  </th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Slug
                  </th>
                  <th className="px-4 py-3 text-right font-semibold">
                    الأيقونة
                  </th>
                  <th className="px-4 py-3 text-right font-semibold">
                    الترتيب
                  </th>
                  <th className="px-4 py-3 text-right font-semibold">
                    الحالة
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
                    إجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((cat) => (
                  <tr
                    key={cat.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-gray-500">{cat.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {cat.name}
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
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
                    <td className="px-4 py-3 text-gray-600">
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
                          onClick={() => alert("سيتم في STEP 6E.4")}
                        >
                          تعديل
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
                          حذف
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
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            صفحة {data.page} من {data.total_pages} — إجمالي{" "}
            {data.total} تصنيف
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              السابق
            </Button>
            <Button
              size="sm"
              variant="secondary"
              disabled={page >= data.total_pages}
              onClick={() => setPage((p) => p + 1)}
            >
              التالي
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}