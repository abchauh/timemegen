import React, { useCallback, useRef, useState } from 'react';
import { Rnd, RndDragCallback, RndResizeCallback } from 'react-rnd';
import * as htmlToImage from 'html-to-image';
import './OverlayImage.css';
import axios from 'axios';
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDragStop: RndDragCallback = (_, data) => {
        setOverlayPosition({ x: data.x, y: data.y });
    };

    const handleResize: RndResizeCallback = (_, __, ref, ___, position) => {
        setOverlaySize({
            width: parseInt(ref.style.width),
            height: parseInt(ref.style.height),
        });
        setOverlayPosition(position);
    };

    const handleRotate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rotation = parseFloat(e.target.value);
        setOverlayRotation(rotation);
    };

    const uploadImage = async (blob: Blob) => {
        const formData = new FormData();
        formData.append('file', blob, 'image.png');
        const response = await axios.post('https://file.io', formData);
        return response.data.link;
    };

    const handleUpload = useCallback(() => {
        if (containerRef.current) {
            setLoading(true);
            setError(null);
            htmlToImage.toBlob(containerRef.current, { skipFonts: true })
                .then(blob => {
                    if (blob) {
                        return uploadImage(blob).then(imageUrl => {
                            postEvent('web_app_switch_inline_query', { query: `generated me this: ${imageUrl}`, chat_types: ['groups'] });
                            setLoading(false);
                        }).catch(uploadErr => {
                            console.error(`Upload error: ${uploadErr}`);
                            setError('Failed to upload image. Please try again.');
                            setLoading(false);
                        });
                    } else {
                        throw new Error('Blob creation failed');
                    }
                })
                .catch(err => {
                    console.error(`Failed to create blob: ${err}`);
                    setError('Failed to generate image. Please try again.');
                    setLoading(false);
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
                    resizeHandleStyles={{
                        topLeft: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#000',
                            border: '1px solid #fff',
                            width: '10px',
                            height: '10px',
                            cursor: 'nwse-resize'
                        },
                        topRight: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#000',
                            border: '1px solid #fff',
                            width: '10px',
                            height: '10px',
                            cursor: 'nesw-resize'
                        },
                        bottomLeft: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#000',
                            border: '1px solid #fff',
                            width: '10px',
                            height: '10px',
                            cursor: 'nesw-resize'
                        },
                        bottomRight: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#000',
                            border: '1px solid #fff',
                            width: '10px',
                            height: '10px',
                            cursor: 'nwse-resize'
                        }
                    }}
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
            <button onClick={handleUpload} className="generate-button" disabled={loading}>
                {loading ? 'Generating...' : 'Generate'}
            </button>
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default OverlayImage;
