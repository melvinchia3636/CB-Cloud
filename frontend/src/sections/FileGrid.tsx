/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Icon } from '@iconify/react';
import React from 'react';
import { FileDataType } from './interface';

function FileGrid({
  data, currentFocus, setCurrentFocus, currentRoute, setCurrentRoute,
}: {
  data: FileDataType[],
  currentFocus: number | undefined;
  setCurrentFocus: (currentFocus: number | undefined) => void;
  currentRoute: string;
  setCurrentRoute: (currentRoute: string) => void;
}) {
  return (
    <div className="file-grid mt-6">
      <div className="h-full overflow-y-hidden mt-0.5 tab relative">
        <div className="w-full grid gap-3 pb-2 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
          {data.map((file, i) => (
            <div className={`border-2 overflow-hidden rounded-lg ${currentFocus === i ? 'bg-indigo-100' : 'bg-gray-100'} transition-colors border-gray-200 font-medium text-lg file-row dropzone draggable-dropzone--occupied`}>
              <div
                role="button"
                tabIndex={i}
                onClick={() => setCurrentFocus(i)}
                onDoubleClick={file.type === 'folder' ? () => {
                  setCurrentRoute([currentRoute, file.name].join('/'));
                } : () => {}}
                className="flex items-center transition-colors file"
                data-type={file.type}
              >
                <div className="flex flex-col justify-center items-center w-full">
                  <div className="w-full h-48 flex items-center justify-center preview">
                    {file.icon === 'bi:file-earmark-image-fill' ? <img alt={file.path} className="w-full h-48 object-cover object-top" src={`http://localhost:9595/imagefit/resize/320x240,C/${file.path}`} />
                      : <Icon className="mt-4 flex-shrink-0 w-16 h-16 text-indigo-400" icon={file.type === 'folder' ? 'bx:bxs-folder' : (file.icon || 'bi:file-earmark-fill')} />}
                  </div>
                  <p className="w-full font-semibold text-xl flex items-center p-4 whitespace-nowrap">
                    <Icon className="flex-shrink-0 w-7 h-7 mr-2 text-indigo-400" icon={file.type === 'folder' ? 'bx:bxs-folder' : (file.icon || 'bi:file-earmark-fill')} />
                    <span className="overflow-ellipsis overflow-hidden max-w-[20rem]">{file.name}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FileGrid;
