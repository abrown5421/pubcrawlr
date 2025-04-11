import Trianglify from 'trianglify';
import { useEffect, useRef } from 'react';

interface TrianglifyBannerProps {
  cellSize?: number;  // Default value will be set if not passed
  variance?: number;  // Default value will be set if not passed
  xColors?: string | string[];  // Default value will be set if not passed
  yColors?: string | string[];  // Default value will be set if not passed
  seed?: string;  // Default value will be set if not passed
}

const TrianglifyBanner: React.FC<TrianglifyBannerProps> = ({
  cellSize = 80,
  variance = 0.75,
  xColors = 'Spectral',
  yColors = 'YlOrBr',
  seed = ''
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pattern = Trianglify({
      width: window.innerWidth,
      height: 240,
      cellSize,
      variance,
      xColors,
      yColors,
      seed
    });

    if (ref.current) {
      ref.current.innerHTML = ''; 
      ref.current.appendChild(pattern.toCanvas());
    }
  }, [cellSize, variance, xColors, yColors, seed]);

  return <div ref={ref} className="banner-image" />;
};

export default TrianglifyBanner;
