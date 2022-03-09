import { Icon } from '@iconify/react';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import API from './sections/API';

import Bin from './sections/Bin';
import Dashboard from './sections/Dashboard';
import Settings from './sections/Settings';
import Storage from './sections/Storage';
import Navbar from './utils/Navbar';

function App() {
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
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/storage" element={<Storage />} />
          <Route path="/bin" element={<Bin />} />
          <Route path="/api" element={<API />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
