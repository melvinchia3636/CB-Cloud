import { Icon } from '@iconify/react';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Bin from './sections/Bin';
import Dashboard from './sections/Dashboard';
import Database from './sections/Database';
import Settings from './sections/Settings';
import Storage from './sections/Storage';
import Todo from './sections/Todo';
import Navbar from './utils/Navbar';

function App() {
  const [breadCrumb, setBreadCrumb] = useState<string[]>([]);
  return (
    <Router>
      <Navbar />
      <div className="pt-12 px-16 w-full flex flex-col overflow-x-hidden flex-shrink-[9999]">
        <div className="flex w-full justify-between">
          <h2 className="text-4xl font-normal text-zinc-700">
            Hello
            {' '}
            <span className="font-bold">Melvin Chia</span>
            ,
          </h2>
          <div className="flex gap-10">
            <button aria-label="search" type="button"><Icon className="w-6 h-6 text-zinc-700" icon="uil:search" /></button>
            <button aria-label="search" type="button"><Icon icon="uil:sliders-v" className="w-6 h-6 text-zinc-700" /></button>
            <div className="w-12 h-12 rounded-full overflow-hidden shadow-md"><img alt="avatar" src="https://picsum.photos/id/1033/300" /></div>
          </div>
        </div>
        <div className="font-semibold text-zinc-700 mt-2 flex gap-2 text-lg items-center flex-wrap whitespace-nowrap" id="breadcrumb">
          Cloud
          <svg className="mt-0.5" width="10" height="10" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.375 7.5L6.375 4.5L3.375 1.5" stroke="#5E78FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {breadCrumb.map((e) => (
            <>
              {e}
              <svg className="mt-0.5" width="10" height="10" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.375 7.5L6.375 4.5L3.375 1.5" stroke="#5E78FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </>
          ))}
        </div>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/storage" element={<Storage setBreadCrumb={setBreadCrumb} />} />
          <Route path="/database" element={<Database />} />
          <Route path="/todo" element={<Todo />} />
          <Route path="/bin" element={<Bin />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
