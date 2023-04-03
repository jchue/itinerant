import { useEffect, useState } from 'react';
import 'material-symbols';
import 'material-icons/iconfont/material-icons.css';

export default function Alert({ children, addClass, transient, type }) {
  const [ visibility, setVisibility ] = useState({
    maxHeight: '10rem',
    marginTop: null,
    marginBottom: null,
    opacity: 1,
    paddingTop: null,
    paddingBottom: null,
  });

  useEffect(() => {
    if (transient) {
      setTimeout(() => {
        setVisibility({
          maxHeight: 0,
          marginTop: 0,
          marginBottom: 0,
          opacity: 0,
          paddingTop: 0,
          paddingBottom: 0,
        });
      }, 5000);
    }
  });

  if (type === 'success') {
    return (
      <div
        className={`bg-green-50 flex px-5 py-4 rounded-md ${addClass}`}
        style={visibility}
      >
        <div className="pr-4">
          <span className="material-symbols-sharp !text-xl text-green-500">check_circle</span>
        </div>
        <div className="py-1">
          <div className="font-bold mb-2 text-green-700 text-sm uppercase">
            Success
          </div>
          <div className="text-green-700 text-sm">
            {children}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'error') {
    return (
      <div
        className={`bg-red-50 flex px-5 py-4 rounded-md ${addClass}`}
        style={visibility}
      >
        <div className="pr-4">
          <span className="material-symbols-sharp !text-xl text-red-500">error</span>
        </div>
        <div className="py-1">
          <div className="font-bold mb-2 text-red-700 text-sm uppercase">
            Error
          </div>
          <div className="text-red-700 text-sm">
            {children}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'info') {
    return (
      <div
        className={`bg-blue-50 flex px-5 py-4 rounded-md transition-all duration-1000 ${addClass}`}
        style={visibility}
      >
        <div className="pr-4">
          <span className="material-icons !text-xl text-blue-500">info</span>
        </div>
        <div className="py-1">
          <div className="text-blue-700 text-sm">
            {children}
          </div>
        </div>
      </div>
    );
  }
}
