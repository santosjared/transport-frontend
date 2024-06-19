import React, { useState } from 'react';
import { getThreeDigits } from 'src/@core/utils/get-initials';

const avatarStyles: React.CSSProperties = {
    width: '35px',
    height: '35px',
    borderRadius: '50%',
    marginRight: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ccc',
    fontFamily: 'Arial, sans-serif',
    fontSize: '16px',
    color: '#fff',
    textTransform: 'uppercase' as 'uppercase',
};

const AvatarWithFallback: React.FC<{ src: string; alt: string; name: string }> = ({ src, alt, name }) => {
    const [imgError, setImgError] = useState(false);

    return imgError || !src ? (
        <div style={avatarStyles}>
            {getThreeDigits(name)}
        </div>
    ) : (
        <img
            src={src}
            alt={alt}
            onError={() => setImgError(true)}
            style={{ ...avatarStyles, objectFit: 'cover' }}
        />
    );
};

export default AvatarWithFallback;
