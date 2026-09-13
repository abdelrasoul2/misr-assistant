import { useState } from "react";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import Spinner from "../components/ui/Spinner";
import PharaohPattern from "../components/patterns/PharaohPattern";
import SourceFormModal from "../features/sources/SourceFormModal";
import {
  useDeleteSource,
  useSources,
  useVerifySource,
} from "../features/sources/hooks";
import type { Source } from "../features/sources/types";

type FilterMode = "all" | "official" | "unofficial";

export default function Sources() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterMode>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Source | null>(null);
  const [verifyTarget, setVerifyTarget] = useState<Source | null>(null);
  const [verifyBy, setVerifyBy] = useState("");
  const pageSize = 10;

  const officialParam =
    filter === "official" ? true : filter === "unofficial" ? false : undefined;

  const { data, isLoading, isError, error } = useSources({
    page,
    page_size: pageSize,
    official: officialParam,
  });

  const deleteMutation = useDeleteSource();
  const verifyMutation = useVerifySource();

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (s: Source) => {
    setEditing(s);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const handleDelete = (s: Source) => {
    const ok = window.confirm(
      `هل أنت متأكد من حذف المصدر "${s.name}"؟\n\nلا يمكن التراجع عن هذا الإجراء.`
    );
    if (!ok) return;
    deleteMutation.mutate(s.id, {
      onError: (err: unknown) => {
        const anyErr = err as { response?: { data?: { detail?: string } } };
        alert("فشل الحذف: " + (anyErr.response?.data?.detail || "خطأ غير معروف"));
      },
    });
  };

  const openVerify = (s: Source) => {
    setVerifyTarget(s);
    setVerifyBy("admin");
  };

  const confirmVerify = () => {
    if (!verifyTarget || !verifyBy.trim()) return;
    verifyMutation.mutate(
      { id: verifyTarget.id, payload: { checked_by: verifyBy.trim() } },
      {
        onSuccess: () => {
          setVerifyTarget(null);
          setVerifyBy("");
        },
        onError: () => alert("فشل التحقق"),
      }
    );
  };

  const filtered =
    data?.items.filter((s) => {
      if (!search) return true;
      const q = search.trim().toLowerCase();
      return (
        s.name.toLowerCase().includes(q) || s.url.toLowerCase().includes(q)
      );
    }) ?? [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-sand-100 via-sand-50 to-white border border-pharaoh-gold/30">
        <div className="h-1 flex">
          <div className="flex-1 bg-egypt-red" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-egypt-black" />
        </div>
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <div className="absolute -left-4 -bottom-4 text-[140px] leading-none text-egypt-red">
            𓋹
          </div>
        </div>
        <div className="relative px-6 py-6 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <span className="text-3xl">𓋹</span>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-extrabold">
                <span className="bg-gradient-to-l from-egypt-red-dark via-egypt-red to-pharaoh-gold-dark bg-clip-text text-transparent">
                  المصادر
                </span>
              </h1>
              <p className="text-sm text-gray-600 mt-0.5">
                إدارة المصادر الرسمية للمعلومات الحكومية
              </p>
            </div>
          </div>
          <Button variant="gold" onClick={openCreate}>
            + مصدر جديد
          </Button>
        </div>
        <PharaohPattern className="opacity-25" height={16} />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="bg-white rounded-xl border border-sand-200 p-3 flex items-center gap-3 flex-1 min-w-[280px]">
          <span className="text-pharaoh-gold text-lg px-2">𓊪</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث بالاسم أو الرابط..."
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

        <div className="flex items-center gap-1 bg-white rounded-xl border border-sand-200 p-1">
          {[
            { key: "all", label: "الكل" },
            { key: "official", label: "رسمي" },
            { key: "unofficial", label: "غير رسمي" },
          ].map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => {
                setFilter(f.key as FilterMode);
                setPage(1);
              }}
              className={[
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                filter === f.key
                  ? "bg-gradient-to-l from-pharaoh-gold-light to-pharaoh-gold/50 text-egypt-black shadow-sm"
                  : "text-gray-600 hover:bg-sand-50",
              ].join(" ")}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
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
            icon="𓋹"
            title={search ? "لا توجد نتائج" : "لا توجد مصادر بعد"}
            description={
              search ? "جرب البحث بكلمة أخرى" : "ابدأ بإضافة أول مصدر رسمي"
            }
            action={
              !search && (
                <Button variant="gold" onClick={openCreate}>
                  + مصدر جديد
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
                  <th className="px-4 py-3.5 text-right font-bold">الرابط</th>
                  <th className="px-4 py-3.5 text-right font-bold">النوع</th>
                  <th className="px-4 py-3.5 text-right font-bold">
                    حالة التحقق
                  </th>
                  <th className="px-4 py-3.5 text-left font-bold">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {filtered.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-sand-50/60 transition-colors"
                  >
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                      {s.id}
                    </td>
                    <td className="px-4 py-3 font-semibold text-egypt-black">
                      {s.name}
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pharaoh-blue hover:text-pharaoh-lapis hover:underline text-xs break-all"
                        dir="ltr"
                      >
                        {s.url}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      {s.official ? (
                        <Badge color="gold">رسمي</Badge>
                      ) : (
                        <Badge color="gray">غير رسمي</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {s.verified_at ? (
                        <Badge color="green">✓ تم التحقق</Badge>
                      ) : (
                        <Badge color="yellow">لم يُتحقق</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 justify-end flex-wrap">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => openVerify(s)}
                        >
                          ✓ تحقق
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => openEdit(s)}
                        >
                          ✏️ تعديل
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          loading={
                            deleteMutation.isPending &&
                            deleteMutation.variables === s.id
                          }
                          onClick={() => handleDelete(s)}
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

      {/* Pagination */}
      {data && data.total_pages > 1 && (
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="text-sm text-gray-600">
            صفحة <strong>{data.page}</strong> من{" "}
            <strong>{data.total_pages}</strong> — إجمالي{" "}
            <strong>{data.total}</strong> مصدر
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

      {/* Form Modal */}
      <SourceFormModal
        isOpen={modalOpen}
        onClose={closeModal}
        source={editing}
      />

      {/* Verify Modal */}
      {verifyTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setVerifyTarget(null)}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl">
            <div className="px-6 py-4 border-b border-sand-200">
              <h2 className="text-lg font-bold text-egypt-black">
                تأكيد التحقق من المصدر
              </h2>
            </div>
            <div className="px-6 py-4 space-y-3">
              <p className="text-sm text-gray-600">
                سيتم تسجيل اسمك وتاريخ التحقق الحالي للمصدر:
              </p>
              <p className="text-sm font-bold text-egypt-red">
                {verifyTarget.name}
              </p>
              <input
                type="text"
                value={verifyBy}
                onChange={(e) => setVerifyBy(e.target.value)}
                placeholder="اسمك (مثلاً: admin)"
                className="w-full px-3.5 py-2.5 rounded-lg border border-sand-300 text-sm focus:outline-none focus:ring-2 focus:ring-pharaoh-gold/40 focus:border-pharaoh-gold"
                autoFocus
              />
            </div>
            <div className="px-6 py-4 border-t border-sand-200 flex items-center justify-end gap-2 bg-sand-50 rounded-b-2xl">
              <Button
                variant="secondary"
                onClick={() => setVerifyTarget(null)}
                disabled={verifyMutation.isPending}
              >
                إلغاء
              </Button>
              <Button
                variant="gold"
                onClick={confirmVerify}
                loading={verifyMutation.isPending}
                disabled={!verifyBy.trim()}
              >
                ✓ تأكيد التحقق
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}