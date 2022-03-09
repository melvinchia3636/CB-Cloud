/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Icon } from '@iconify/react';
import axios from 'axios';
import React, {
  useEffect, useState,
} from 'react';
import FileGrid from './FileGrid';
import FileList from './FileList';
import { FileDataType } from './interface';

function Storage() {
  const [data, setData] = useState<FileDataType[]>([]);
  const [currentRoute, setCurrentRoute] = useState<string>('/');
  const [breadCrumb, setBreadCrumb] = useState<string[]>([]);
  const [currentFocus, setCurrentFocus] = useState<number>();
  const [displayType, setDisplayType] = useState<boolean>(false);
  const [contextPosition, setContextPosition] = useState({ x: 0, y: 0 });
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);

  const fetchData = async () => {
    setData([]);
    const response = await axios({
      url: `http://localhost:9595/storage/api-fetch${currentRoute.replace(/\/\//g, '/')}`,
      method: 'GET',
    });
    setData(response.data as FileDataType[]);
  };

  useEffect(() => {
    fetchData().catch((err) => { throw err; });
    setBreadCrumb(['Storage', ...currentRoute.replace(/\/\//g, '/').split('/')].filter((e) => e));
    setCurrentFocus(undefined);
  }, [currentRoute]);

  useEffect(() => () => setBreadCrumb([]), []);

  return (
    <>
      <div className="my-2 flex gap-2 text-lg items-center flex-wrap whitespace-nowrap" id="breadcrumb">
        Cloud
        <svg className="mt-0.5" width="10" height="10" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.375 7.5L6.375 4.5L3.375 1.5" stroke="#5E78FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {breadCrumb.map((e, i) => (
          <button type="button" className="font-semibold text-zinc-700 flex items-center gap-2" onClick={() => setCurrentRoute(currentRoute.split('/').slice(0, i + 2).join('/'))}>
            {e}
            <svg className="mt-0.5" width="10" height="10" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.375 7.5L6.375 4.5L3.375 1.5" stroke="#5E78FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ))}
      </div>
      <div className="text-zinc-700">
        <div className="flex items-center justify-between mt-12 text-indigo-400 font-bold text-3xl">
          <div className="flex items-center">
            <Icon className="w-10 h-10 mr-4" icon="uil:hdd" />
            File Storage
          </div>

          <div className="flex gap-8 h-full">
            {currentFocus !== undefined && (
            <>
              <div className="flex gap-8" id="func-tools">
                <button type="button" aria-label="share"><Icon className="w-7 h-7 text-zinc-700" icon="uil:link-h" /></button>
                <button type="button" aria-label="lock"><Icon className="w-7 h-7 text-zinc-700" icon="uil:unlock-alt" /></button>
                <button type="button" aria-label="download"><Icon className="w-7 h-7 text-zinc-700" icon="uil:cloud-download" /></button>
                <button type="button" aria-label="delete"><Icon className="w-7 h-7 text-zinc-700" icon="uil:trash-alt" /></button>
                <button type="button" aria-label="tag"><Icon className="w-7 h-7 text-zinc-700" icon="uil:tag-alt" /></button>
              </div>
              <div className="w-[2px] h-[32px] bg-gray-300" />
            </>
            )}
            <div className="flex gap-8">
              <button type="button" onClick={() => setDisplayType(!displayType)} aria-label="display"><Icon className=" w-7 h-7 !text-zinc-700" icon="tabler:layout-grid" /></button>
              <button type="button" aria-label="info"><Icon className=" w-7 h-7 !text-zinc-700" icon="uil:info-circle" /></button>
            </div>
          </div>
        </div>
        {[
          <FileList
            data={data}
            currentFocus={currentFocus}
            setCurrentFocus={setCurrentFocus}
            currentRoute={currentRoute}
            setCurrentRoute={setCurrentRoute}
            setContextPosition={setContextPosition}
            setShowContextMenu={setShowContextMenu}
          />,
          <FileGrid
            data={data}
            currentFocus={currentFocus}
            setCurrentFocus={setCurrentFocus}
            currentRoute={currentRoute}
            setCurrentRoute={setCurrentRoute}
          />,
        ][Number(displayType)]}
      </div>
      <div
        onClick={() => setShowContextMenu(false)}
        className={`absolute top-0 left-0 flex overflow-hidden items-center justify-center w-full h-full bg-black transition-all ${showContextMenu ? 'z-0 bg-opacity-[1%] duration-200' : 'z-[-1] bg-opacity-0 duration-500'}`}
      />
      <div className={`fixed inset-0 z-10 bg-gray-100 w-min h-min ${showContextMenu ? 'max-h-96' : 'max-h-0'} whitespace-nowrap overflow-hidden shadow-md rounded-md transition-[max-height] flex flex-col`} style={{ top: contextPosition.y, left: contextPosition.x }}>
        <button type="button" className="flex gap-4 items-center text-zinc-700 font-medium text-lg transition-all bg-white hover:bg-gray-50 px-4 py-3 pt-4">
          <Icon className="w-6 h-6 text-zinc-700" icon="uil:cloud-download" />
          Download file
        </button>
        <button type="button" className="flex gap-4 items-center text-zinc-700 font-medium text-lg transition-all bg-white hover:bg-gray-50 px-4 py-3">
          <Icon className="w-6 h-6 text-zinc-700" icon="uil:tag-alt" />
          Add Tag
        </button>
        <button type="button" className="flex gap-4 items-center text-zinc-700 font-medium text-lg transition-all bg-white hover:bg-gray-50 px-4 py-3">
          <Icon className="w-6 h-6 text-zinc-700" icon="uil:unlock-alt" />
          Lock document
        </button>
        <button type="button" className="flex gap-4 items-center text-red-400 font-medium text-lg transition-all bg-white hover:bg-gray-50 px-4 py-3 pb-4">
          <Icon className="w-6 h-6 text-red-400" icon="uil:trash-alt" />
          Move to bin
        </button>
      </div>
    </>
  );
}

export default Storage;
