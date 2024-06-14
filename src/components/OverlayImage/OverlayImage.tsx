import React, {useCallback, useRef, useState} from 'react';
import {Rnd, RndDragCallback, RndResizeCallback} from 'react-rnd';
import * as htmlToImage from 'html-to-image';
import './OverlayImage.css';

interface OverlayImageProps {
    mainImageSrc: string;
    overlayImageSrc: string | null;
}

const OverlayImage: React.FC<OverlayImageProps> = ({mainImageSrc, overlayImageSrc}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [overlayPosition, setOverlayPosition] = useState({x: 100, y: 100});
    const [overlaySize, setOverlaySize] = useState({width: 100, height: 100});
    const [overlayRotation, setOverlayRotation] = useState(0);
    const [buttonText, setButtonText] = useState("Generate & Copy");
    const [error, setError] = useState<string | null>(null);

    const handleDragStop: RndDragCallback = (_, data) => {
        setOverlayPosition({x: data.x, y: data.y});
        setButtonText("Generate & Copy");
    };

    const handleResize: RndResizeCallback = (_, __, ref, ___, position) => {
        setOverlaySize({
            width: parseInt(ref.style.width),
            height: parseInt(ref.style.height),
        });
        setOverlayPosition(position);
        setButtonText("Generate & Copy");
    };

    const handleRotate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rotation = parseFloat(e.target.value);
        setOverlayRotation(rotation);
        setButtonText("Generate & Copy");
    };

    const handleUpload = useCallback(async () => {
        if (containerRef.current) {
            setError(null);

            htmlToImage.toBlob(containerRef.current, {skipFonts: true})
                .then(blob => {
                    if (blob) {
                        navigator.clipboard.write([
                            new ClipboardItem({
                                'image/png': blob
                            })
                        ]).then(() => {
                            setButtonText("Copied!");
                            setTimeout(() => {
                                setButtonText("Generate & Copy");
                            }, 2000);
                        }).catch(copyErr => {
                            console.error(`Copy error: ${copyErr.message}`);
                            setError(`Failed to copy image: ${copyErr.message}`);
                        });
                    } else {
                        throw new Error('Blob creation failed');
                    }
                })
                .catch(err => {
                    console.error(`Failed to create blob: ${err}`);
                    setError('Failed to generate image. Please try again.');
                });
        }
    }, []);

    return (
        <div className="overlay-image-wrapper">
            <div className="overlay-image-container" ref={containerRef}>
                <img src={mainImageSrc} alt="Main" className="main-image"/>
                <Rnd
                    size={{width: overlaySize.width, height: overlaySize.height}}
                    position={{x: overlayPosition.x, y: overlayPosition.y}}
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
            <button onClick={handleUpload} className="generate-button">
                {buttonText}
            </button>
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default OverlayImage;
