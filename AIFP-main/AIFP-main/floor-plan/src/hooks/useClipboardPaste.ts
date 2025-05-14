import { useState, useEffect, useCallback } from "react";

interface UseClipboardPasteOptions {
  onPaste?: (image: HTMLImageElement) => void;
  onPasteText?: (text: string) => void;
}

export const useClipboardPaste = (options: UseClipboardPasteOptions = {}) => {
  const [pastedImage, setPastedImage] = useState<HTMLImageElement | null>(null);
  // const [pastedText, setPastedText] = useState<string | null>(null);

  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      // Handle text paste
      const text = e.clipboardData?.getData("text");
      if (text) {
        options.onPasteText?.(text);
        return;
      }

      // Handle image paste
      const items = e.clipboardData?.items;
      if (!items) return;

      const imageItem = Array.from(items).find(
        (item) => item.type.indexOf("image") !== -1
      );

      if (!imageItem) return;

      const blob = imageItem.getAsFile();
      if (!blob) return;

      const urlCreator = window.URL || window.webkitURL;
      const imageUrl = urlCreator.createObjectURL(blob);

      const img = new Image();
      img.src = imageUrl;

      img.onload = () => {
        setPastedImage(img);
        options.onPaste?.(img);
        // urlCreator.revokeObjectURL(imageUrl);
      };
    },
    [options]
  );

  useEffect(() => {
    window.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, [handlePaste]);

  return { pastedImage };
};
