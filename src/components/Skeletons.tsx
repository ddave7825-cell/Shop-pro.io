/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export const CatalogSkeleton: React.FC = () => {
  return (
    <div className="px-4 py-4 pb-20 animate-pulse">
      {/* Title block placeholder */}
      <div className="mb-6">
        <div className="h-7 w-48 rounded bg-stone-200" />
        <div className="mt-2 h-4 w-64 rounded bg-stone-100" />
      </div>

      {/* Search Input placeholder */}
      <div className="relative mb-5">
        <div className="h-12 w-full rounded-xl bg-stone-100" />
      </div>

      {/* Category Pills placeholder */}
      <div className="no-scrollbar -mx-4 mb-5 flex overflow-x-auto px-4 pb-1 space-x-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-8 w-20 flex-shrink-0 rounded-full bg-stone-100" />
        ))}
      </div>

      {/* Quick filter headerplaceholder */}
      <div className="mb-6 flex items-center justify-between">
        <div className="h-4 w-24 rounded bg-stone-200" />
        <div className="flex space-x-2">
          <div className="h-8 w-20 rounded-lg bg-stone-100" />
          <div className="h-8 w-16 rounded-lg bg-stone-100" />
        </div>
      </div>

      {/* Product List - Beautiful responsive grid skeletons */}
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-stone-100 p-2 bg-white">
            {/* Image block skeleton */}
            <div className="aspect-square w-full rounded-xl bg-stone-100" />
            
            {/* Bottom info skeleton */}
            <div className="mt-3 px-1 space-y-2">
              <div className="h-3 w-12 rounded bg-stone-100" />
              <div className="h-4 w-32 rounded bg-stone-200" />
              <div className="h-3 w-20 rounded bg-stone-150 bg-stone-100" />
              
              <div className="mt-4 flex items-center justify-between pt-1">
                <div className="h-5 w-16 rounded bg-stone-200" />
                <div className="h-7 w-16 rounded-lg bg-stone-100" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ProductDetailsSkeleton: React.FC = () => {
  return (
    <div className="bg-stone-50 pb-24 animate-pulse">
      {/* Detail Header placeholder */}
      <div className="sticky top-16 z-20 flex items-center justify-between bg-white px-4 py-3 border-b border-stone-100">
        <div className="h-8 w-20 rounded-full bg-stone-250 bg-stone-200" />
        <div className="h-4 w-28 rounded bg-stone-100" />
        <div className="h-8 w-8 rounded-full bg-stone-200" />
      </div>

      <div className="mx-auto max-w-lg">
        {/* Large Image container skeleton */}
        <div className="aspect-square w-full bg-white flex items-center justify-center p-4">
          <div className="h-full w-full rounded-2xl bg-stone-100" />
        </div>

        {/* Basic specifications details skeleton */}
        <div className="mt-2 bg-white px-5 py-6 border-t border-stone-100 space-y-3">
          <div className="h-3 w-20 rounded bg-stone-200" />
          <div className="h-7 w-3/4 rounded bg-stone-200" />
          
          <div className="flex space-x-4 items-center">
            <div className="h-4 w-16 rounded bg-stone-100" />
            <div className="h-4 w-1 bg-stone-200" />
            <div className="h-5 w-20 rounded bg-stone-200" />
          </div>

          <div className="space-y-2 pt-2">
            <div className="h-3 w-full rounded bg-stone-100" />
            <div className="h-3 w-full rounded bg-stone-100" />
            <div className="h-3 w-5/6 rounded bg-stone-100" />
          </div>
        </div>

        {/* Variant color options list skeleton */}
        <div className="mt-2 bg-white px-5 py-6 border-y border-stone-100 space-y-4">
          <div>
            <div className="h-3.5 w-28 rounded bg-stone-200" />
            <div className="mt-3 flex space-x-3.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-9 w-9 rounded-full bg-stone-100" />
              ))}
            </div>
          </div>

          {/* Quantity selector placeholder */}
          <div className="mt-6 border-t border-stone-100 pt-5 flex items-center justify-between space-x-4">
            <div className="h-10 w-24 rounded-xl bg-stone-100" />
            <div className="h-12 flex-1 rounded-xl bg-stone-200" />
          </div>
        </div>
      </div>
    </div>
  );
};
