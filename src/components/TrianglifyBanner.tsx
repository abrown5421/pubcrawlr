import React from 'react';
import Trianglify from 'react-trianglify';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { TrianglifyBannerProps } from '../types/globalTypes';

const TrianglifyBanner: React.FC<TrianglifyBannerProps> = ({ token = '' }) => {
  const { cellSize, variance, xColors, yColors } = useSelector(
    (state: RootState) => state.trianglify
  );

  return (
    <div className="banner-image">
      <Trianglify
        width={window.innerWidth}
        height={200}
        cellSize={cellSize}
        variance={variance}
        seed={token}
        xColors={xColors.length ? xColors : undefined}
        yColors={yColors.length ? yColors : undefined}
        output="canvas"
      />
    </div>
  );
};

export default TrianglifyBanner;
