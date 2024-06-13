import React from 'react';
import stickers from '../../stickerLoader'; // Adjust the path as necessary

interface StickerPackProps {
  onStickerClick: (stickerDataUrl: string) => void;
}

const StickerPack: React.FC<StickerPackProps> = ({ onStickerClick }) => {
  const handleStickerClick = (url: string) => {
    onStickerClick(url);
  };

  const containerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
    gap: '10px',
    justifyContent: 'center',
  };

  const stickerStyle: React.CSSProperties = {
    cursor: 'pointer',
    margin: '10px',
    width: '100%',
    height: 'auto',
  };

  return (
    <div style={containerStyle}>
      {stickers.map((url, index) => (
        <img
          key={index}
          src={url}
          alt={`Sticker ${index}`}
          onClick={() => handleStickerClick(url)}
          style={stickerStyle}
        />
      ))}
    </div>
  );
};

export default StickerPack;
