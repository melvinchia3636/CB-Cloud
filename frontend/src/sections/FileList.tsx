/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Icon } from '@iconify/react';
import fileSize from 'filesize';
import React, { useEffect, useRef } from 'react';
import { FileDataType } from './interface';

function FileItem({
  file,
  currentRoute,
  setCurrentRoute,
  currentFocus,
  setCurrentFocus,
  setContextPosition,
  setShowContextMenu,
  i,
}: {
  file: FileDataType,
  currentRoute: string,
  setCurrentRoute: (currentRoute: string) => void,
  currentFocus: number | undefined,
  setCurrentFocus: (currentFocus: number | undefined) => void,
  setContextPosition: (position: { x: number, y: number }) => void,
  setShowContextMenu: (showContextMenu: boolean) => void,
  i: number
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      setCurrentFocus(parseInt(ref.current?.getAttribute('tabIndex') || '', 10));
      setContextPosition({
        x: e.clientX,
        y: e.clientY,
      });
      setShowContextMenu(true);
    });
  }, [ref]);

  return (
    <div
      role="button"
      tabIndex={i}
      onClick={() => setCurrentFocus(i)}
      onDoubleClick={file.type === 'folder' ? () => {
        setCurrentRoute([currentRoute, file.name].join('/'));
      } : () => {}}
      className="flex items-center transition-colors file"
      data-type={file.type}
      ref={ref}
    >
      <div className={`border-b-2 w-full ${currentFocus === i ? 'bg-indigo-100 text-indigo-400' : 'bg-zinc-100 hover:bg-zinc-200'} transition-colors cursor-po border-zinc-200 font-medium text-lg file-row dropzone draggable-dropzone--occupied`}>
        <div className="flex items-center w-full">
          <p className="w-5/12 py-3 font-semibold text-xl flex items-center pl-2 pr-4 whitespace-nowrap">
            <Icon className=" w-8 h-8 mr-4 text-indigo-400" icon={file.type === 'folder' ? 'bx:bxs-folder' : (file.icon || 'bi:file-earmark-fill')} />
            <span className="overflow-ellipsis overflow-hidden max-w-[20rem]">{file.name}</span>
          </p>
          <p className="w-2/12">{file.last_mod}</p>
          <p className="w-2/12">{file.created}</p>
          <p className="w-1/12">{fileSize(file.size)}</p>
          <p className="text-sm font-semibold px-6 py-1 rounded-full text-white">{file.tag && file.tag[0]}</p>
        </div>
      </div>
    </div>
  );
}

function FileList({
  data,
  currentFocus,
  setCurrentFocus,
  currentRoute,
  setCurrentRoute,
  setContextPosition,
  setShowContextMenu,
}: {
  data: FileDataType[],
  currentFocus: number | undefined;
  setCurrentFocus: (currentFocus: number | undefined) => void;
  currentRoute: string;
  setCurrentRoute: (currentRoute: string) => void;
  setContextPosition: (position: { x: number, y: number }) => void;
  setShowContextMenu: (showContextMenu: boolean) => void;
}) {
  return (
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
            <FileItem
              file={file}
              i={i}
              currentFocus={currentFocus}
              setCurrentFocus={setCurrentFocus}
              currentRoute={currentRoute}
              setCurrentRoute={setCurrentRoute}
              setContextPosition={setContextPosition}
              setShowContextMenu={setShowContextMenu}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default FileList;
