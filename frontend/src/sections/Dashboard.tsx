import { Icon } from '@iconify/react';
import React from 'react';

function Dashboard() {
  return (
    <div className="text-zinc-700 h-full flex flex-col">
      <div className="mt-12 flex flex-col h-full">
        <h3 className="text-2xl font-bold">Storage Details</h3>
        <div className="mt-6 flex gap-4">
          <div className="bg-white rounded-xl p-4 w-full shadow-md flex gap-4 items-center">
            <Icon className="w-14 h-14 bg-indigo-400 p-2 text-white rounded-lg shadow-[2px_2px_4px_rgba(0,0,0,.25)_inset]" icon="uil:hdd" />
            <div>
              <p className="font-bold text-zinc-500">Storage Used</p>
              <p className="font-bold text-2xl">
                GB
                {' '}
                <span className="slash">/</span>
                {' '}
                <span className="text-zinc-500">
                  GB
                </span>
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 w-full shadow-md flex gap-4 items-center">
            <Icon className="w-14 h-14 bg-indigo-400 p-2 text-white rounded-lg shadow-[2px_2px_4px_rgba(0,0,0,.25)_inset]" icon="uil:temperature-three-quarter" />
            <div>
              <p className="font-bold text-zinc-500">CPU Temperature</p>
              <p className="font-bold text-2xl flex gap-2">
                36°C
                <span className="slash">/</span>
                <span>96.8°F</span>
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 w-full shadow-md flex gap-4 items-center">
            <Icon className="w-14 h-14 bg-indigo-400 p-2 text-white rounded-lg shadow-[2px_2px_4px_rgba(0,0,0,.25)_inset]" icon="uil:code" />
            <div>
              <p className="font-bold text-zinc-500">API Usage</p>
              <p className="font-bold text-2xl flex gap-2">
                12,000
                <span className="slash">/</span>
                <Icon className="w-8 h-8" icon="ph:infinity-bold" />
              </p>
            </div>
          </div>
        </div>
        <div className="w-full h-full flex items-center justify-center font-medium text-zinc-400 text-xl">More stuff coming soon lol</div>
      </div>
    </div>
  );
}

export default Dashboard;
