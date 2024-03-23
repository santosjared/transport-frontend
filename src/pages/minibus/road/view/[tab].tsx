import { GetStaticProps, GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types'
import { useService } from 'src/hooks/useService'
import Routs from 'src/views/apps/minibus/road/views/Routs'

const RoutsView = ({ tab, data }: InferGetStaticPropsType<typeof getStaticProps>) => {
 return <Routs tab={tab} routData={data}/>
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [
      { params: { tab: 'rutas' } },
      { params: { tab: 'paradas' } }
    ],
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params }: GetStaticPropsContext) => {
  const {Get} = useService()
  const res = await Get('/road')
  const data = res?.data

  return {
    props: {
      data,
      tab: params?.tab
    }
  }
}

export default RoutsView
