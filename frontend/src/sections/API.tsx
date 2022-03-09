/* eslint-disable max-len */
import { Icon } from '@iconify/react';
import React from 'react';

function API() {
  return (
    <>
      <div className="my-2 flex gap-2 text-lg items-center flex-wrap whitespace-nowrap" id="breadcrumb">
        Cloud
        <svg className="mt-0.5" width="10" height="10" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.375 7.5L6.375 4.5L3.375 1.5" stroke="#5E78FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <button type="button" className="font-semibold text-zinc-700 flex items-center gap-2">
          API Reference
          <svg className="mt-0.5" width="10" height="10" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.375 7.5L6.375 4.5L3.375 1.5" stroke="#5E78FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <div className="text-zinc-700">
        <div className="flex items-center justify-between mt-12 text-indigo-400 font-bold text-3xl">
          <div className="flex items-center">
            <Icon className="w-10 h-10 mr-4" icon="uil:code" />
            API Reference
          </div>
        </div>
        <div className="flex justify-between flex-start">
          <div>
            <h2 className="text-3xl mt-12 font-bold text-zinc-700">
              Codeblog Cloud Storage API
            </h2>
            <p className="font-medium mt-4 mr-12">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <div className="flex gap-4 mt-8">
              <button type="button" className="bg-indigo-500 text-white px-12 py-4 font-medium text-lg rounded-md shadow-md">Get started</button>
              <button type="button" className="text-indigo-500 border-2 border-indigo-500 px-12 py-4 font-medium text-lg rounded-md shadow-md">Send feedback</button>
            </div>
          </div>
          <div className="text-zinc-500">
            <h3 className="font-bold whitespace-nowrap">TABLE OF CONTENT</h3>
            <div className="mt-4">
              <div className="font-bold flex-flex-col">
                <a href="#introduction">Get Started</a>
                <div className="ml-4 mt-2 flex flex-col gap-1 font-medium">
                  <a href="#introduction">Overview</a>
                  <a href="#introduction">Authentication</a>
                </div>
              </div>
              <div className="font-bold flex-flex-col mt-3">
                <a href="#introduction">Drive Content</a>
                <div className="ml-4 mt-2 flex flex-col gap-1 font-medium">
                  <a href="#introduction">List</a>
                  <a href="#introduction">Get</a>
                  <a href="#introduction">Metadata</a>
                  <a href="#introduction">Create</a>
                  <a href="#introduction">Delete</a>
                  <a href="#introduction">Status</a>
                </div>
              </div>
              <div className="font-bold flex-flex-col mt-3">
                <a href="#introduction">API Usage</a>
                <div className="ml-4 mt-2 flex flex-col gap-1 font-medium">
                  <a href="#introduction">Overiew</a>
                  <a href="#introduction">Fetch</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default API;
