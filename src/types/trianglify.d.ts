// src/types/trianglify.d.ts
declare module 'trianglify' {
    type ColorFunction = (x: number, y: number) => string;
  
    interface TrianglifyOptions {
      width: number;
      height: number;
      cellSize?: number;
      variance?: number;
      seed?: string;
      xColors?: string | string[];
      yColors?: string | string[];
      strokeWidth?: number;
      points?: [number, number][];
      colorFunction?: ColorFunction; // ✅ Add this
    }
  
    interface TrianglifyPattern {
      toCanvas(): HTMLCanvasElement;
      toSVG(): string;
    }
  
    export default function Trianglify(options: TrianglifyOptions): TrianglifyPattern;
  }
  