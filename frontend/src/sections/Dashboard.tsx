import { Icon } from '@iconify/react';
import React from 'react';

function Dashboard() {
  const quickAccess = [
    {
      name: 'Revenge Lyrics',
      type: 'pdf',
      last: '2 months ago',
      icon: {
        name: 'grommet-icons:document-pdf',
        color: '#FF4D4D',
      },
      bg: '#FFCECE',
    },
    {
      name: 'Word Docs',
      type: 'docx',
      last: 'yesterday',
      icon: {
        name: 'file-icons:microsoft-word',
        color: '#617AFE',
      },
      bg: '#CCD4FF',
    },
    {
      name: 'Nice Slideshow',
      type: 'pptx',
      last: '2 years ago',
      icon: {
        name: 'file-icons:microsoft-powerpoint',
        color: '#FFAF51',
      },
      bg: '#FFE5C6',
    },
    {
      name: 'Marks Report',
      type: 'xlsx',
      last: '3 weeks ago',
      icon: {
        name: 'file-icons:microsoft-excel',
        color: '#25BF87',
      },
      bg: '#C6FCE9',
    },
    {
      name: 'IMG_9487',
      type: 'png',
      last: '27 June 2020',
      icon: {
        name: 'file-icons:image',
        color: '#9948FF',
      },
      bg: '#E0C8FF',
    },
  ];
  return (
    <div className="mt-12 text-zinc-700">
      <div>
        <h3 className="text-2xl font-bold">Quick Access</h3>
        <div className="mt-6 flex gap-3">
          {quickAccess.map(({
            name, last, icon, bg,
          }) => (
            <div className="flex flex-col justify-between w-56 h-44 p-4 pb-3 rounded-2xl shadow-md" style={{ backgroundColor: bg }}>
              <Icon className="w-10 h-10" icon={icon.name} style={{ color: icon.color }} />
              <div>
                <p className="font-bold text-xl">{name}</p>
                <p className="font-semibold">{last}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-12">
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
              <p className="font-bold text-2xl">
                36°C
                <span className="slash">/</span>
                {' '}
                <span className="text-zinc-500">42°C</span>
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 w-full shadow-md flex gap-4 items-center">
            <Icon className="w-14 h-14 bg-indigo-400 p-2 text-white rounded-lg shadow-[2px_2px_4px_rgba(0,0,0,.25)_inset]" icon="uil:database" />
            <div>
              <p className="font-bold text-zinc-500">Database Queries</p>
              <p className="font-bold text-2xl">
                12,000
                <span className="slash">/</span>
                {' '}
                <span className="text-zinc-500">5,000,000</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
