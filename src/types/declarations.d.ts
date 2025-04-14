declare module '@tensorflow/tfjs';
declare module '@tensorflow-models/blazeface' {
  export interface BlazeFaceModel {
    estimateFaces(
      input: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement | ImageData,
      returnTensors: boolean
    ): Promise<Array<{
      topLeft: [number, number];
      bottomRight: [number, number];
      landmarks: Array<[number, number]>;
      probability: number;
    }>>;
  }
  export function load(): Promise<BlazeFaceModel>;
}
declare module '@xterm/xterm' {
  export interface Terminal {
    loadAddon(addon: any): void;
    open(element: HTMLElement): void;
    write(text: string): void;
    writeln(text: string): void;
    onKey(callback: (event: { key: string; domEvent: KeyboardEvent }) => void): void;
    dispose(): void;
  }
  export class Terminal {
    constructor(options?: {
      cursorBlink?: boolean;
      fontSize?: number;
      fontFamily?: string;
      theme?: {
        background?: string;
        foreground?: string;
      };
    });
  }
}
declare module '@xterm/addon-fit';
declare module '@xterm/addon-web-links';
declare module 'framer-motion'; 