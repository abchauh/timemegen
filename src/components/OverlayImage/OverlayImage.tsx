import React, { useRef, useState, useCallback } from 'react';
import { Rnd, RndDragCallback, RndResizeCallback } from 'react-rnd';
import * as htmlToImage from 'html-to-image';
import './OverlayImage.css';
import { postEvent } from '@tma.js/sdk-react';

interface OverlayImageProps {
  mainImageSrc: string;
  overlayImageSrc: string | null;
}

const OverlayImage: React.FC<OverlayImageProps> = ({ mainImageSrc, overlayImageSrc }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [overlayPosition, setOverlayPosition] = useState({ x: 100, y: 100 });
  const [overlaySize, setOverlaySize] = useState({ width: 100, height: 100 });
  const [overlayRotation, setOverlayRotation] = useState(0);
  const [buttonText, setButtonText] = useState('Generate & Copy');

  const handleDragStop: RndDragCallback = (_, data) => {
    setOverlayPosition({ x: data.x, y: data.y });
    setButtonText('Generate & Copy');
  };

  const handleResize: RndResizeCallback = (_, __, ref, ___, position) => {
    setOverlaySize({
      width: parseInt(ref.style.width),
      height: parseInt(ref.style.height),
    });
    setOverlayPosition(position);
    setButtonText('Generate & Copy');
  };

  const handleRotate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rotation = parseFloat(e.target.value);
    setOverlayRotation(rotation);
    setButtonText('Generate & Copy');
  };

  const copyToClipboard = useCallback(() => {
    if (containerRef.current) {
      htmlToImage.toBlob(containerRef.current, { skipFonts: true })
        .then(blob => {
          if (blob) {
            const item = new ClipboardItem({ 'image/png': blob });
            navigator.clipboard.write([item]).then(() => {
              navigator.clipboard.read().then(items => {
                for (const clipboardItem of items) {
                  if (clipboardItem.types.includes('image/png')) {
                    setButtonText('Copied!');
                    return;
                  }
                }
                throw new Error('Clipboard does not contain the image');
              });
            });
          } else {
            throw new Error('Blob creation failed');
          }
        })
        .catch(err => {
          console.error('Failed to copy image to clipboard:', err);
          htmlToImage.toPng(containerRef.current!, { skipFonts: true })
            .then(dataUrl => {
              postEvent('web_app_open_link', { url: dataUrl });
            })
            .catch(imgErr => {
              console.error('Failed to create data URL:', imgErr);
            });
        });
    }
  }, []);

  return (
    <div className="overlay-image-wrapper">
      <div className="overlay-image-container" ref={containerRef}>
        <img src={mainImageSrc} alt="Main" className="main-image" />
        <Rnd
          size={{ width: overlaySize.width, height: overlaySize.height }}
          position={{ x: overlayPosition.x, y: overlayPosition.y }}
          onDragStop={handleDragStop}
          onResize={handleResize}
          lockAspectRatio={true}
          bounds="parent"
          className="overlay-rnd"
        >
          <div
            className="overlay-image"
            style={{
              backgroundImage: `url(${overlayImageSrc})`,
              transform: `rotate(${overlayRotation}deg)`,
            }}
          />
        </Rnd>
      </div>
      <input
        type="range"
        min="0"
        max="360"
        value={overlayRotation}
        onChange={handleRotate}
        className="rotation-slider"
      />
      <button onClick={copyToClipboard} className="copy-button">{buttonText}</button>
    </div>
  );
};

export default OverlayImage;
