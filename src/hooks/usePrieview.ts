import { useEffect, useState } from 'react';

type PreviewSrc = string | ArrayBuffer | null;
interface Preview {
  preview: PreviewSrc;
  index: number;
}

export const usePreview = (medias: FileList | File[] | null | undefined) => {
  const [previews, setPreviews] = useState<Preview[]>([]);

  useEffect(() => {
    const previews: Preview[] = [],
      fileReaders: FileReader[] = [];
    let isCancel = false;

    if (!medias || !medias.length) return setPreviews([]);

    Array.from(medias).forEach((file, index) => {
      const fileReader = new FileReader();
      fileReaders.push(fileReader);
      fileReader.onload = (e) => {
        const { result } = e.target!;
        if (result) {
          previews.push({ preview: result, index });
        }
        if (previews.length === medias.length && !isCancel) {
          setPreviews(previews.sort((a, b) => b.index - a.index));
        }
      };
      fileReader.readAsDataURL(file);
    });
    return () => {
      isCancel = true;
      fileReaders.forEach((fileReader) => {
        if (fileReader.readyState === 1) {
          fileReader.abort();
        }
      });
    };
  }, [medias]);

  return previews;
};
