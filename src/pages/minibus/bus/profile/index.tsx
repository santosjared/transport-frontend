import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'
import {isImage} from 'src/utils/verificateImg';
import getConfig from 'src/configs/environment';

interface props {
  row:any
}
const RenderClient = ({ row }:props) => {
  const [isImg, setIsImg] = useState<any>(false);
  useEffect(() => {
    const checkImage = async () => {
      const profileUrl = `${getConfig().backendURI}${row.profile}`;
      const img = await isImage(profileUrl);
      setIsImg(img);
    };
    checkImage();
  }, [row.profile,row]);

  if (isImg) {
    return (
      <CustomAvatar
        src={`${getConfig().backendURI}${row.profile}`}
        sx={{ mr: 3, width: 34, height: 34 }}
      />
    );
  } else {
    return (
      <CustomAvatar
        skin='light'
        color='primary'
        sx={{ mr: 3, width: 34, height: 34, fontSize: '1rem' }}
      >
        {getInitials(row.name && row.lastName ? `${row.name} ${row.lastName}` : row.name ? row.name : 'Desconocido')}
      </CustomAvatar>
    );
  }
};

const CustomRenderCell = ({ row }:props) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {row.userId ? (
        <>
          <RenderClient row={row.userId} />
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: theme => `${theme.palette.text.secondary}` }} noWrap>
              {`${row.userId.name} ${row.userId.lastName}`}
            </Typography>
            <Typography noWrap variant='caption'>
              {row.userId.ci}
            </Typography>
          </Box>
        </>
      ) : (
        <Typography noWrap variant='body2'>No asignado</Typography>
      )}
    </Box>
  );
};
export default CustomRenderCell

