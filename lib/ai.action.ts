
import puter from "@heyputer/puter.js";
import {SKETCHIFY_RENDER_PROMPT} from "./constants";

export const fetchAsDataUrl = async (url: string): Promise<string> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }

  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Type guard to check if response is an HTMLImageElement
const isImageElement = (value: unknown): value is HTMLImageElement => {
  return value instanceof HTMLImageElement && typeof (value as any).src === 'string';
};

export const generate3DView = async ({ sourceImage }: Generate3DViewParams): Promise<Generate3DViewResult> => {
    try {
        const dataUrl = sourceImage.startsWith('data:')
            ? sourceImage
            : await fetchAsDataUrl(sourceImage);

        const base64Data = dataUrl.split(',')[1];
        const mimeType = dataUrl.split(';')[0].split(':')[1];

        if(!mimeType || !base64Data) {
            throw new Error('Invalid source image payload: missing MIME type or base64 data');
        }

        let response: unknown;
        try {
            response = await puter.ai.txt2img(SKETCHIFY_RENDER_PROMPT, {
                provider: "gemini",
                model: "gemini-2.5-flash-image-preview",
                input_image: base64Data,
                input_image_mime_type: mimeType,
                ratio: { w: 1024, h: 1024 },
            });
        } catch (apiError) {
            const errorMessage = apiError instanceof Error ? apiError.message : 'Unknown API error';
            throw new Error(`AI API call failed: ${errorMessage}`);
        }

        // Validate response structure with type guard
        let rawImageUrl: string | null = null;
        
        if (isImageElement(response)) {
            rawImageUrl = response.src ?? null;
        } else if (typeof response === 'object' && response !== null && 'src' in response) {
            rawImageUrl = (response as any).src ?? null;
        } else if (typeof response === 'string') {
            // In case the API returns a URL directly
            rawImageUrl = response;
        }

        if (!rawImageUrl) {
            console.warn('AI API returned unexpected response format', { response });
            return { renderedImage: null, renderedPath: undefined };
        }

        const renderedImage = rawImageUrl.startsWith('data:')
            ? rawImageUrl 
            : await fetchAsDataUrl(rawImageUrl);

        return { renderedImage, renderedPath: undefined };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error during 3D view generation';
        console.error('generate3DView failed:', {
            error: errorMessage,
            sourceImage: sourceImage.substring(0, 50) + '...' // Log first 50 chars only
        });
        
        // Return error result instead of throwing to allow caller to handle gracefully
        return { renderedImage: null, renderedPath: undefined };
    }
}
