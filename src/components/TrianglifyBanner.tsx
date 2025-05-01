import React, { useEffect, useRef } from 'react';
import trianglify from 'trianglify';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { TrianglifyBannerProps } from '../types/globalTypes';

const TrianglifyBanner: React.FC<TrianglifyBannerProps> = ({ token = '' }) => {
  const ref = useRef<HTMLDivElement>(null);

  const { cellSize, variance, xColors, yColors } = useSelector(
    (state: RootState) => state.trianglify
  );

  useEffect(() => {
    const pattern = trianglify({
      width: window.innerWidth,
      height: 200,
      xCells: 10, 
      yCells: 10,
      xColors: 'random',
      yColors: 'match'
    });

    if (ref.current) {
      ref.current.innerHTML = '';
      ref.current.appendChild(pattern.toCanvas());
    }
  }, [cellSize, variance, xColors, yColors, token]);

  return <div ref={ref} className="banner-image" />;
};

export default TrianglifyBanner;
