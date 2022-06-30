import React, { FC } from 'react';

export const SkeletonPost: FC = () => {
  return (
    <div className="bg-white rounded shadow px-6 pt-4 pb-2 flex flex-col">
      <div className="animate-pulse">
        <div className="flex flex-row text-left h-10">
          <div className="rounded-full bg-slate-400 h-10 w-10"></div>
          <div className="ml-4 flex flex-col items-start justify-around w-1/6">
            <div className="h-2 bg-slate-400 rounded w-full" />
            <div className="h-1.5 bg-slate-400 rounded w-2/3" />
          </div>
        </div>

        <div className="h-24" />

        <div className="border-t border-t-gray-300 py-1 mt-2 flex flex-row justify-around items-center h-10">
          <div className="h-1.5 bg-slate-400 rounded w-1/5" />
          <div className="h-1.5 bg-slate-400 rounded w-1/5" />
          <div className="h-1.5 bg-slate-400 rounded w-1/5" />
        </div>
      </div>
    </div>
  );
};
