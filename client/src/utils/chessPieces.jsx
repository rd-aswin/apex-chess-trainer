import React from 'react';

export const PIECE_SVGS = {
  wk: (
    <svg viewBox="0 0 45 45" className="w-full h-full drop-shadow-sm select-none">
      <g fill="none" fillRule="evenodd" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.5 11.63V6M20 8h5" strokeLinejoin="miter"/>
        <path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#fff" strokeLinecap="butt" strokeLinejoin="miter"/>
        <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V23.5 23.5c-2.5-7.5-12-10.5-16-4-3 6 6 10.5 6 10.5v7z" fill="#fff"/>
        <path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0"/>
      </g>
    </svg>
  ),
  wq: (
    <svg viewBox="0 0 45 45" className="w-full h-full drop-shadow-sm select-none">
      <g fill="#fff" fillRule="evenodd" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm16.5-4.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm-27 4a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm19 0a2 2 0 1 1-4 0 2 2 0 1 1 4 0z"/>
        <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11-6-16-6 16-7-11-2 12zm0 5c9-1.5 21-1.5 27 0m-27 4c9-1.5 21-1.5 27 0m-28 4c10-1.5 23-1.5 29 0l1-5c-6.5-1.5-19-1.5-28 0l-2 5z" strokeLinecap="butt"/>
      </g>
    </svg>
  ),
  wr: (
    <svg viewBox="0 0 45 45" className="w-full h-full drop-shadow-sm select-none">
      <g fill="#fff" fillRule="evenodd" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 39h27v-3H9v3zm3-3v-4.5h21V36H12zm2-4.5l1-17h15l1 17H14z" strokeLinecap="butt"/>
        <path d="M14 14.5v-5h4v3h3v-3h4v3h3v-3h4v5H14zM11 14h23v2.5H11V14z"/>
        <path d="M12 35.5h21m-20-4h19" fill="none"/>
      </g>
    </svg>
  ),
  wb: (
    <svg viewBox="0 0 45 45" className="w-full h-full drop-shadow-sm select-none">
      <g fill="none" fillRule="evenodd" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <g fill="#fff" strokeLinecap="butt">
          <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z"/>
          <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/>
          <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/>
        </g>
        <path d="M17.5 26h10M15 30h15m-7.5-14.5v5m-3-2.5h6" strokeLinejoin="miter"/>
      </g>
    </svg>
  ),
  wn: (
    <svg viewBox="0 0 45 45" className="w-full h-full drop-shadow-sm select-none">
      <g fill="none" fillRule="evenodd" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#fff"/>
        <path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0-.095 1.23-1 2-1 0-.91-1.53-2-2-.5-1.5.88-2.6 1-4 0-2-3-4-2-6 1-1 3-2 4-2 .88 0 1.62.66 2 1 1 1 1.77.58 3 1 .6 0 1.5-.7 2-1 3.5-2 6 1 7 4z" fill="#fff"/>
        <circle cx="9.5" cy="25.5" r="1" fill="#000"/>
        <circle cx="15" cy="15.5" r="1.2" fill="#000"/>
      </g>
    </svg>
  ),
  wp: (
    <svg viewBox="0 0 45 45" className="w-full h-full drop-shadow-sm select-none">
      <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#fff" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),

  bk: (
    <svg viewBox="0 0 45 45" className="w-full h-full drop-shadow-sm select-none">
      <g fill="none" fillRule="evenodd" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.5 11.63V6M20 8h5" stroke="#fff" strokeLinejoin="miter"/>
        <path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#262626" strokeLinecap="butt" strokeLinejoin="miter"/>
        <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V23.5 23.5c-2.5-7.5-12-10.5-16-4-3 6 6 10.5 6 10.5v7z" fill="#262626"/>
        <path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" stroke="#fff"/>
      </g>
    </svg>
  ),
  bq: (
    <svg viewBox="0 0 45 45" className="w-full h-full drop-shadow-sm select-none">
      <g fill="#262626" fillRule="evenodd" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm16.5-4.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm-27 4a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm19 0a2 2 0 1 1-4 0 2 2 0 1 1 4 0z"/>
        <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11-6-16-6 16-7-11-2 12zm0 5c9-1.5 21-1.5 27 0m-27 4c9-1.5 21-1.5 27 0m-28 4c10-1.5 23-1.5 29 0l1-5c-6.5-1.5-19-1.5-28 0l-2 5z" stroke="#fff" strokeLinecap="butt"/>
      </g>
    </svg>
  ),
  br: (
    <svg viewBox="0 0 45 45" className="w-full h-full drop-shadow-sm select-none">
      <g fill="#262626" fillRule="evenodd" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 39h27v-3H9v3zm3-3v-4.5h21V36H12zm2-4.5l1-17h15l1 17H14z" stroke="#fff" strokeLinecap="butt"/>
        <path d="M14 14.5v-5h4v3h3v-3h4v3h3v-3h4v5H14zM11 14h23v2.5H11V14z" stroke="#fff"/>
        <path d="M12 35.5h21m-20-4h19" fill="none" stroke="#fff"/>
      </g>
    </svg>
  ),
  bb: (
    <svg viewBox="0 0 45 45" className="w-full h-full drop-shadow-sm select-none">
      <g fill="none" fillRule="evenodd" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <g fill="#262626" stroke="#fff" strokeLinecap="butt">
          <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z"/>
          <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/>
          <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/>
        </g>
        <path d="M17.5 26h10M15 30h15m-7.5-14.5v5m-3-2.5h6" stroke="#fff" strokeLinejoin="miter"/>
      </g>
    </svg>
  ),
  bn: (
    <svg viewBox="0 0 45 45" className="w-full h-full drop-shadow-sm select-none">
      <g fill="none" fillRule="evenodd" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#262626" stroke="#fff"/>
        <path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0-.095 1.23-1 2-1 0-.91-1.53-2-2-.5-1.5.88-2.6 1-4 0-2-3-4-2-6 1-1 3-2 4-2 .88 0 1.62.66 2 1 1 1 1.77.58 3 1 .6 0 1.5-.7 2-1 3.5-2 6 1 7 4z" fill="#262626" stroke="#fff"/>
        <circle cx="9.5" cy="25.5" r="1" fill="#fff"/>
        <circle cx="15" cy="15.5" r="1.2" fill="#fff"/>
      </g>
    </svg>
  ),
  bp: (
    <svg viewBox="0 0 45 45" className="w-full h-full drop-shadow-sm select-none">
      <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#262626" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
};

export function PieceIcon({ piece, className = "w-full h-full" }) {
  if (!piece) return null;
  const key = `${piece.color}${piece.type}`;
  const svg = PIECE_SVGS[key];
  if (!svg) return null;
  return <div className={className}>{svg}</div>;
}
