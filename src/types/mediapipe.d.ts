declare module '@mediapipe/face_mesh' {
  export class FaceMesh {
    constructor(options?: {
      locateFile?: (file: string) => string;
    });
    
    setOptions(options: {
      maxNumFaces?: number;
      refineLandmarks?: boolean;
      minDetectionConfidence?: number;
      minTrackingConfidence?: number;
    }): void;
    
    onResults(callback: (results: any) => void): void;
    
    send(image: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement): Promise<void>;
    
    close(): void;
  }
  
  export interface Results {
    image: HTMLCanvasElement;
    multiFaceLandmarks: Array<{
      x: number;
      y: number;
      z: number;
    }[]>;
  }
} 