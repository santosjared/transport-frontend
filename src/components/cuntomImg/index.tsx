import { useEffect, useState } from "react"
import { getInitials } from "src/@core/utils/get-initials"
import { isImage } from "src/utils/verificateImg"
import getConfig from 'src/configs/environment'
import CustomAvatar from 'src/@core/components/mui/avatar'
export const RenderPhoto = ({data}:{data:any}) => {
  const [isImg, setIsImg] = useState<any>(false)
  useEffect(() => {
    const image = async () => {
      const img = await isImage(`${getConfig().backendURI}${data.profile}`)
      setIsImg(img)
    }
    image()
  }, [data])
  if (isImg) {
    return <CustomAvatar src={`${getConfig().backendURI}${data.profile}`} sx={{ mr: 3, width: 34, height: 34 }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color='primary'
        sx={{ mr: 3, width: 34, height: 34, fontSize: '1rem' }}
      >
        {getInitials(data.name && data.lastName ? `${data.name} ${data.lastName}` : data.name ? data.name : 'Desconocido')}
      </CustomAvatar>
    )
  }
}
export const RenderPhotoBus = ({data}:{data:any}) => {
  const [isImg, setIsImg] = useState<any>(false)
  useEffect(() => {
    const image = async () => {
      const img = await isImage(`${getConfig().backendURI}${data.photo}`)
      setIsImg(img)
    }
    image()
  }, [data])
  if (isImg) {
    return <CustomAvatar src={`${getConfig().backendURI}${data.photo}`} sx={{ mr: 3, width: 34, height: 34 }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color='primary'
        sx={{ mr: 3, width: 34, height: 34, fontSize: '1rem' }}
      >
        {getInitials(data.trademark)}
      </CustomAvatar>
    )
  }
}

