import React from "react";

export const BookingCardSkeleton = () => {
  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      {/* Gradient header skeleton */}
      <div className="bg-gray-50 px-4 md:px-6 py-3 md:py-4 border-b border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-xl w-10 h-10 flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <div className="h-5 bg-gray-200 rounded-lg w-48 mb-2"></div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
          </div>
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Client information skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-40"></div>
              </div>
            </div>
          </div>
          <div className="flex sm:justify-end">
            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
          </div>
        </div>

        {/* Payment information skeleton - Desktop */}
        <div className="hidden md:block bg-gray-50 rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="h-3 bg-gray-200 rounded w-12"></div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="space-y-1">
              <div className="h-3 bg-gray-200 rounded w-16"></div>
              <div className="h-6 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="space-y-1">
              <div className="h-3 bg-gray-200 rounded w-18"></div>
              <div className="h-6 bg-gray-200 rounded w-22"></div>
            </div>
          </div>

          {/* Progress bar skeleton */}
          <div className="mt-4">
            <div className="flex justify-between mb-2">
              <div className="h-3 bg-gray-200 rounded w-24"></div>
              <div className="h-3 bg-gray-200 rounded w-8"></div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gray-300 h-2 rounded-full w-1/3"></div>
            </div>
          </div>
        </div>

        {/* Payment information skeleton - Mobile */}
        <div className="md:hidden">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-5 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Notes skeleton */}
        <div className="hidden md:block bg-gray-50 rounded-xl p-4 border border-gray-100">
          <div className="h-3 bg-gray-200 rounded w-12 mb-2"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>

        {/* Notes skeleton - Mobile */}
        <div className="md:hidden">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Actions skeleton */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4 pt-2 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="h-9 bg-gray-200 rounded-lg w-full sm:w-24"></div>
          </div>
          <div className="h-9 bg-gray-200 rounded-lg w-full md:w-32"></div>
        </div>
      </div>
    </div>
  );
};
