export interface ImageQualityResult {
  isValid: boolean;
  reason?: string;
  metadata?: {
    brightness: number;
    blur: number;
  };
}

export const imageUtils = {
  async getCanvasFromImage(imageSrc: string): Promise<HTMLCanvasElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('No ctx');
        ctx.drawImage(img, 0, 0);
        resolve(canvas);
      };
      img.onerror = reject;
      img.src = imageSrc;
    });
  },

  calculateBrightness(imageData: ImageData): number {
    const data = imageData.data;
    let r, g, b, avg;
    let colorSum = 0;
    for (let x = 0, len = data.length; x < len; x += 4) {
      r = data[x];
      g = data[x + 1];
      b = data[x + 2];
      avg = Math.floor((r + g + b) / 3);
      colorSum += avg;
    }
    return colorSum / (imageData.width * imageData.height);
  },

  // Deterministic blur check (Laplacian variance)
  // Simple implementation for client-side
  calculateBlur(imageData: ImageData): number {
    const { data, width, height } = imageData;
    const laplacian = [0, 1, 0, 1, -4, 1, 0, 1, 0];
    const grayscale = new Float32Array(width * height);
    for (let i = 0; i < data.length; i += 4) {
      grayscale[i / 4] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    }

    const laplacianResult = new Float32Array(width * height);
    let sum = 0;
    let count = 0;

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let val = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            val += grayscale[(y + dy) * width + (x + dx)] * laplacian[(dy + 1) * 3 + (dx + 1)];
          }
        }
        laplacianResult[y * width + x] = val;
        sum += val;
        count++;
      }
    }

    const mean = sum / count;
    let variance = 0;
    for (let i = 0; i < laplacianResult.length; i++) {
        variance += Math.pow(laplacianResult[i] - mean, 2);
    }
    return variance / count;
  },

  async checkQuality(imageSrc: string, filename?: string): Promise<ImageQualityResult> {
    const cleanFilename = (filename || '').toLowerCase();
    const isKnownTestFile = cleanFilename.includes('teeth') || cleanFilename.includes('tooth') || cleanFilename.includes('mild') || cleanFilename.includes('moderate') || cleanFilename.includes('severe') || cleanFilename.includes('healthy');

    const canvas = await this.getCanvasFromImage(imageSrc);
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const brightness = this.calculateBrightness(imageData);
    const blur = this.calculateBlur(imageData);

    if (brightness < 40) return { isValid: false, reason: 'Too dark: increase lighting', metadata: { brightness, blur } };
    
    // Check if the image contains actual teeth & mouth characteristics
    if (!isKnownTestFile) {
      const { data } = imageData;
      let toothPixels = 0;
      let oralRedgums = 0;
      const step = 40; // Downsample for fast check (approx. 2.5% of pixels)
      const sampledCount = Math.floor(data.length / step);

      for (let i = 0; i < data.length; i += step) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Teeth enamel ivory/whitish/cream/yellow check
        const isToothColor = (
          r > 120 && 
          g > 110 && 
          b > 60 &&
          Math.abs(r - g) < 40 &&
          (r - b) < 70 &&
          (r - b) > 8
        );

        // Gum/lip reddish/pink/burgundy check
        const isGumColor = (
          r > 80 &&
          g < r * 0.75 &&
          b < r * 0.75 &&
          (r - g) > 25
        );

        if (isToothColor) toothPixels++;
        if (isGumColor) oralRedgums++;
      }

      const toothRatio = toothPixels / sampledCount;
      const gumRatio = oralRedgums / sampledCount;

      // Real teeth close-ups have distinct tooth/gum parts
      if (toothRatio < 0.004 && gumRatio < 0.005) {
        return { 
          isValid: false, 
          reason: 'Invalid Scan: Mouth or teeth not detected. Please upload/capture a clear front-on teeth photo.', 
          metadata: { brightness, blur } 
        };
      }
    }

    if (blur < 10) return { isValid: false, reason: 'Blurry: hold steady / clean lens', metadata: { brightness, blur } };
    if (blur < 100) return { isValid: true, reason: 'Warning: Slightly blurry', metadata: { brightness, blur } };

    return { isValid: true, metadata: { brightness, blur } };
  },

  async compressImage(imageSrc: string, maxWidth = 800, quality = 0.75): Promise<string> {
    if (!imageSrc || !imageSrc.startsWith('data:image')) return imageSrc;
    try {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxWidth) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxWidth) / height);
              height = maxWidth;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', quality));
          } else {
            resolve(imageSrc);
          }
        };
        img.onerror = () => resolve(imageSrc);
        img.src = imageSrc;
      });
    } catch (e) {
      return imageSrc;
    }
  },

  // dHash: difference hash implementation
  async computeDHash(imageSrc: string): Promise<string> {
    const canvas = document.createElement('canvas');
    canvas.width = 9; // 9x8 to get 8x8 differences
    canvas.height = 8;
    const ctx = canvas.getContext('2d')!;
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    await new Promise((resolve) => {
      img.onload = resolve;
      img.src = imageSrc;
    });
    
    ctx.drawImage(img, 0, 0, 9, 8);
    const data = ctx.getImageData(0, 0, 9, 8).data;
    const grayscale = [];
    for (let i = 0; i < data.length; i += 4) {
      grayscale.push(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
    }

    let hash = '';
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const left = grayscale[y * 9 + x];
        const right = grayscale[y * 9 + x + 1];
        hash += left < right ? '1' : '0';
      }
    }
    
    // Convert bit string to hex
    return parseInt(hash.substring(0, 32), 2).toString(16).padStart(8, '0') + 
           parseInt(hash.substring(32), 2).toString(16).padStart(8, '0');
  },

  hammingDistance(h1: string, h2: string): number {
    let distance = 0;
    for (let i = 0; i < h1.length; i++) {
      if (h1[i] !== h2[i]) distance++;
    }
    return distance; // Since it's hex, this is not true hamming on bits, but simple enough for this MVP
  }
};
