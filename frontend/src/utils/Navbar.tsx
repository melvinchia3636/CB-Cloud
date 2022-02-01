import React from 'react';
import { Icon } from '@iconify/react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.svg';

function Navbar() {
  const currentRoute = useLocation();

  const routes: [name:string, path:string, icon:string][] = [
    ['Dashboard', '', 'create-dashboard'],
    ['File Storage', 'storage', 'hdd'],
    ['Databases', 'database', 'database'],
    ['Todo List', 'todo', 'calender'],
    ['Recycle Bin', 'bin', 'trash-alt'],
    ['Settings', 'settings', 'cog'],
  ];
  return (
    <div className="h-screen bg-white w-72 shadow-lg flex flex-shrink-0 flex-col justify-between sticky top-0 left-0">
      <img alt="logo" src={logo} className="p-8 w-10/12" />
      <ul className="text-zinc-500 gap-6 flex flex-col nav">
        {routes.map(([name, path, icon]) => (
          <Link to={`/${path}`} className={`w-full px-8 py-4 flex items-center gap-4 font-bold text-xl ${`/${path}` === currentRoute.pathname ? 'text-indigo-500' : ''}`}>
            <Icon icon={`uil:${icon}`} className="w-8 h-8" />
            {name}
          </Link>
        ))}
      </ul>
      <div className="p-8">
        <p className="font-bold">GB of GB used</p>
        <div className="bg-indigo-300 h-2 w-full rounded-full mt-2 overflow-hidden" id="slider">
          <div className="h-full bg-indigo-400 rounded-full w-0 transition-all duration-500 delay-100" />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
