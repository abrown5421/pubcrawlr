// src/types/trianglify.d.ts
declare module 'trianglify' {
  type ColorInput = string | string[];
  type ColorFunction = (args: {
    centroid: { x: number; y: number };
    xPercent: number;
    yPercent: number;
    vertexIndices: number[];
    vertices: { x: number; y: number }[];
    xScale: any;
    yScale: any;
    points: { x: number; y: number }[];
    opts: TrianglifyOptions;
    random: () => number;
  }) => string;

  interface TrianglifyOptions {
    width: number;
    height: number;
    seed?: string;
    xColors?: ColorInput;
    yColors?: ColorInput | 'match';
    xCells?: number;
    yCells?: number;
    variance?: number;
    strokeWidth?: number;
    points?: { x: number; y: number }[];
    colorFunction?: ColorFunction;
    palette?: Record<string, string[]>;
    colorSpace?: string;
  }

  interface TrianglifyPattern {
    toCanvas(): HTMLCanvasElement;
    toSVG(): string;
  }

  export default function Trianglify(options: TrianglifyOptions): TrianglifyPattern;
}
