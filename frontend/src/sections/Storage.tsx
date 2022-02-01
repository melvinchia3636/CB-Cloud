import { Icon } from '@iconify/react';
import axios from 'axios';
import React, {
  Dispatch, SetStateAction, useEffect, useState,
} from 'react';

export interface FileDataType {
  type: Type;
  path: string;
  icon: string;
  name: string;
  tag: string[];
  last_mod: string;
  created: string;
  size: number;
}

export enum Type {
  File = 'file',
  Folder = 'folder',
}

function Storage({ setBreadCrumb }: {
  setBreadCrumb: Dispatch<SetStateAction<string[]>>
}) {
  const [data, setData] = useState<FileDataType[]>([]);
  const [currentRoute, setCurrentRoute] = useState<string>('/');

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
  }, [currentRoute]);

  useEffect(() => () => setBreadCrumb([]), []);

  return (
    <div className="text-zinc-700">
      <div className="flex items-center justify-between mt-12 text-indigo-400 font-bold text-3xl">
        <div className="flex items-center">
          <Icon className="w-10 h-10 mr-4" icon="uil:hdd" />
          File Storage
        </div>
        <div className="flex gap-8">
          <div className="gap-8 hidden" id="func-tools">
            <button type="button" aria-label="share"><Icon className="w-7 h-7 text-zinc-700" icon="uil:link-h" /></button>
            <button type="button" aria-label="lock"><Icon className="w-7 h-7 text-zinc-700" icon="uil:unlock-alt" /></button>
            <button type="button" aria-label="download"><Icon className="w-7 h-7 text-zinc-700" icon="uil:cloud-download" /></button>
            <button type="button" aria-label="delete"><Icon className="w-7 h-7 text-zinc-700" icon="uil:trash-alt" /></button>
            <button type="button" aria-label="tag"><Icon className="w-7 h-7 text-zinc-700" icon="uil:tag-alt" /></button>
          </div>
          <div className="divider-v bg-gray-300 hidden" />
          <div className="flex gap-8">
            <button type="button" aria-label="display"><Icon className=" w-7 h-7 !text-zinc-700" icon="tabler:layout-grid" /></button>
            <button type="button" aria-label="info"><Icon className=" w-7 h-7 !text-zinc-700" icon="uil:info-circle" /></button>
          </div>
        </div>
      </div>
      <div className="file-list">
        <div className="text-left text-zinc-500 font-semibold border-b-2 border-zinc-200 mt-6 flex w-full">
          <p className="w-5/12 pb-2">Name</p>
          <p className="w-2/12">Last Modified</p>
          <p className="w-2/12">Date Created</p>
          <p className="w-1/12">Size</p>
          <p className="w-2/12">Tags</p>
        </div>
        <div className="h-full overflow-y-hidden mt-0.5 tab relative">
          <div className="w-full table">
            {data.map((file, i) => (
              <div
                role="button"
                tabIndex={i}
                onClick={file.type === 'folder' ? () => {
                  setCurrentRoute([currentRoute, file.name].join('/'));
                } : () => {}}
                onKeyDown={file.type === 'folder' ? () => {
                  setCurrentRoute([currentRoute, file.name].join('/'));
                } : () => {}}
                className="flex items-center transition-colors item"
                data-type={file.type}
              >
                <div className="border-b-2 w-full bg-zinc-100 hover:bg-zinc-200 transition-colors cursor-po border-zinc-200 font-medium text-lg file-row dropzone draggable-dropzone--occupied">
                  <div className="flex items-center w-full">
                    <p className="w-5/12 py-3 font-semibold text-xl flex items-center pl-2 pr-4 whitespace-nowrap">
                      <Icon className=" w-8 h-8 mr-4 text-indigo-400" icon={file.type === 'folder' ? 'bx:bxs-folder' : (file.icon || 'bi:file-earmark-fill')} />
                      <span className="overflow-ellipsis overflow-hidden max-w-[20rem]">{file.name}</span>
                    </p>
                    <p className="w-2/12">{file.last_mod}</p>
                    <p className="w-2/12">{file.created}</p>
                    <p className="w-1/12">{file.size}</p>
                    <p className="text-sm font-semibold px-6 py-1 rounded-full text-white">{file.tag && file.tag[0]}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Storage;
