import React, { useEffect, useRef } from 'react';
import Trianglify from 'trianglify';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { TrianglifyBannerProps } from '../types/globalTypes';
import '../styles/components/tryianglify-banner.css';

const TrianglifyBanner: React.FC<TrianglifyBannerProps> = ({ token = '' }) => {
  const ref = useRef<HTMLDivElement>(null);

  const { cellSize, variance, xColors, yColors } = useSelector(
    (state: RootState) => state.trianglify
  );

  useEffect(() => {
    const pattern = Trianglify({
      width: window.innerWidth,
      height: 200,
      cellSize,
      variance,
      seed: token,
      xColors: xColors.length ? xColors : undefined,
      yColors: yColors.length ? yColors : undefined,
    });

    if (ref.current) {
      ref.current.innerHTML = '';
      ref.current.appendChild(pattern.toCanvas());
    }
  }, [cellSize, variance, xColors, yColors, token]);

  return <div ref={ref} className="banner-image" />;
};

export default TrianglifyBanner;
