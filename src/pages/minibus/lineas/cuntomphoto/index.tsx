import { Fragment, useEffect, useState } from "react"
import { isImage } from "src/utils/verificateImg"
import getConfig from 'src/configs/environment'
import { Box } from "@mui/material"

const RenderImg = ({url}:{url:any} ) => {
  const [isImg, setIsImg] = useState<any>(false)
  useEffect(() => {
    const image = async () => {
      const img = await isImage(`${getConfig().backendURI}${url.photo}`)
      setIsImg(img)
    }
    image()
  }, [url.photo])
  if (isImg) {
    return (
      <Box sx={{ display: 'flex', border: 'solid 1px #E0E0E0', borderRadius: 0.5 }}>
      <img src={`${getConfig().backendURI}${url.photo}`} height={35} width={35} style={{ borderRadius: 5 }}></img>
    </Box>
    )
  } else {
    return <Fragment></Fragment>
  }
}
export default RenderImg
