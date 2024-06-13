import React, { useRef, useState, useEffect } from 'react';
import './OverlayImage.css';

interface OverlayImageProps {
  mainImageSrc: string;
  overlayImageSrc: string | null;
}

const OverlayImage: React.FC<OverlayImageProps> = ({ mainImageSrc, overlayImageSrc }) => {
  const mainImageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 100, height: 100 });
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (overlayImageSrc && mainImageRef.current) {
      const mainRect = mainImageRef.current.getBoundingClientRect();
      setPosition({
        x: mainRect.width / 2 - size.width / 2,
        y: mainRect.height / 2 - size.height / 2,
      });
    }
  }, [overlayImageSrc]);

  const handleMouseDownOrTouchStart = (event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement>) => {
    event.preventDefault();
    const isTouchEvent = 'touches' in event;
    const startX = isTouchEvent ? event.touches[0].clientX : event.clientX;
    const startY = isTouchEvent ? event.touches[0].clientY : event.clientY;
    const startPos = { ...position };

    const onMouseMoveOrTouchMove = (moveEvent: MouseEvent | TouchEvent) => {
      const moveX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const moveY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;
      setPosition({
        x: startPos.x + (moveX - startX),
        y: startPos.y + (moveY - startY),
      });
    };

    const onMouseUpOrTouchEnd = () => {
      window.removeEventListener('mousemove', onMouseMoveOrTouchMove);
      window.removeEventListener('mouseup', onMouseUpOrTouchEnd);
      window.removeEventListener('touchmove', onMouseMoveOrTouchMove);
      window.removeEventListener('touchend', onMouseUpOrTouchEnd);
    };

    window.addEventListener('mousemove', onMouseMoveOrTouchMove);
    window.addEventListener('mouseup', onMouseUpOrTouchEnd);
    window.addEventListener('touchmove', onMouseMoveOrTouchMove);
    window.addEventListener('touchend', onMouseUpOrTouchEnd);
  };

  const handleResizeRotate = (event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement>) => {
    event.preventDefault();
    const isTouchEvent = 'touches' in event;
    const startX = isTouchEvent ? event.touches[0].clientX : event.clientX;
    const startY = isTouchEvent ? event.touches[0].clientY : event.clientY;
    const startSize = { ...size };
    const startRotation = rotation;

    const onMouseMoveOrTouchMove = (moveEvent: MouseEvent | TouchEvent) => {
      const moveX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const moveY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;
      const deltaX = moveX - startX;
      const deltaY = moveY - startY;
      const newSize = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const angle = Math.atan2(deltaY, deltaX);

      setSize({
        width: startSize.width + newSize,
        height: startSize.height + newSize,
      });

      setRotation(startRotation + angle * (180 / Math.PI));
    };

    const onMouseUpOrTouchEnd = () => {
      window.removeEventListener('mousemove', onMouseMoveOrTouchMove);
      window.removeEventListener('mouseup', onMouseUpOrTouchEnd);
      window.removeEventListener('touchmove', onMouseMoveOrTouchMove);
      window.removeEventListener('touchend', onMouseUpOrTouchEnd);
    };

    window.addEventListener('mousemove', onMouseMoveOrTouchMove);
    window.addEventListener('mouseup', onMouseUpOrTouchEnd);
    window.addEventListener('touchmove', onMouseMoveOrTouchMove);
    window.addEventListener('touchend', onMouseUpOrTouchEnd);
  };

  const handleSave = async () => {
    if (!mainImageRef.current || !overlayRef.current) return;

    const mainCanvas = document.createElement('canvas');
    const mainImage = mainImageRef.current.querySelector('img');
    const overlayImage = overlayRef.current.querySelector('img');

    if (!mainImage || !overlayImage) return;

    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    };

    try {
      const loadedMainImage = await loadImage(mainImageSrc);
      const loadedOverlayImage = await loadImage(overlayImageSrc!);

      mainCanvas.width = loadedMainImage.width;
      mainCanvas.height = loadedMainImage.height;

      const context = mainCanvas.getContext('2d');
      if (!context) return;

      context.drawImage(loadedMainImage, 0, 0, mainCanvas.width, mainCanvas.height);
      context.save();
      context.translate(position.x + size.width / 2, position.y + size.height / 2);
      context.rotate((rotation * Math.PI) / 180);
      context.drawImage(loadedOverlayImage, -size.width / 2, -size.height / 2, size.width, size.height);
      context.restore();

      const link = document.createElement('a');
      link.href = mainCanvas.toDataURL();
      link.download = 'overlay_image.png';
      link.click();
    } catch (error) {
      console.error('Error loading images for canvas:', error);
    }
  };

  return (
    <div className="overlay-container">
      <div className="main-image" ref={mainImageRef}>
        <img src={mainImageSrc} alt="Main" crossOrigin="anonymous" />
        {overlayImageSrc && (
          <div
            className="overlay-image"
            ref={overlayRef}
            style={{
              top: position.y,
              left: position.x,
              width: size.width,
              height: size.height,
              transform: `rotate(${rotation}deg)`,
            }}
            onMouseDown={handleMouseDownOrTouchStart}
            onTouchStart={handleMouseDownOrTouchStart}
          >
            <img src={overlayImageSrc} alt="Overlay" crossOrigin="anonymous" />
            <div className="resize-rotate-handle" onMouseDown={handleResizeRotate} onTouchStart={handleResizeRotate}></div>
          </div>
        )}
      </div>
      {overlayImageSrc && <button onClick={handleSave}>Save Image</button>}
    </div>
  );
};

export default OverlayImage;
