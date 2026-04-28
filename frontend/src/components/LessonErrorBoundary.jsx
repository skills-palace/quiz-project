import React from "react";

/**
 * Catches render errors in the lesson so the whole app does not show a blank Next error overlay.
 */
export default class LessonErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[LessonErrorBoundary]", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-[50vh] flex flex-col items-center justify-center gap-3 px-4 text-center"
          dir="rtl"
        >
          <p className="text-xl font-bold text-rose-700 font-naskh">حدث خطأ في عرض الدرس</p>
          <p className="max-w-md text-slate-600 text-sm leading-relaxed">
            جرّب تحديث الصفحة. إن استمر الخطأ، افتح أدوات المطوّر (F12) وانسخ أول سطر في تبويب
            Console.
          </p>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.location.reload();
              }
            }}
            className="mt-1 rounded-xl bg-sky-600 px-5 py-2.5 text-base font-bold text-white shadow-md hover:bg-sky-700"
          >
            تحديث الصفحة
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
