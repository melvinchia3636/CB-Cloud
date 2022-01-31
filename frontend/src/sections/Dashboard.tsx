import React from 'react';

function Dashboard() {
  return (
    <div className="mt-12 text-gray-500">
      <div>
        <h3 className="text-2xl font-bold">Quick Access</h3>
        <div className="mt-6 flex gap-3">
          <div className="flex flex-col justify-between w-56 h-44 p-4 pb-3 rounded-2xl shadow-md">
            <span className="iconify w-10 h-10" data-icon="{{item.icon.name}}" />
            <div>
              <p className="font-bold text-xl" />
              <p className="font-semibold" />
            </div>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold">Storage Details</h3>
        <div className="mt-6 flex gap-4">
          <div className="bg-white rounded-xl p-4 w-full shadow-md flex gap-4 items-center">
            <span className="iconify w-14 h-14 bg-indigo-400 p-2 text-white rounded-lg shadow-[2px_2px_4px_rgba(0,0,0,.25)_inset]" data-icon="uil:hdd" />
            <div>
              <p className="font-bold text-gray-500">Storage Used</p>
              <p className="font-bold text-2xl">

                GB
                {' '}
                <span className="slash">/</span>
                {' '}
                <span className="text-gray-500">

                  GB
                </span>
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 w-full shadow-md flex gap-4 items-center">
            <span className="iconify w-14 h-14 bg-indigo-400 p-2 text-white rounded-lg shadow-[2px_2px_4px_rgba(0,0,0,.25)_inset]" data-icon="uil:temperature-three-quarter" />
            <div>
              <p className="font-bold text-gray-500">CPU Temperature</p>
              <p className="font-bold text-2xl">
                36°C
                <span className="slash">/</span>
                {' '}
                <span className="text-gray-500">42°C</span>
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 w-full shadow-md flex gap-4 items-center">
            <span className="iconify w-14 h-14 bg-indigo-400 p-2 text-white rounded-lg shadow-[2px_2px_4px_rgba(0,0,0,.25)_inset]" data-icon="uil:database" />
            <div>
              <p className="font-bold text-gray-500">Database Queries</p>
              <p className="font-bold text-2xl">
                12,000
                <span className="slash">/</span>
                {' '}
                <span className="text-gray-500">5,000,000</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
