// ** React Imports
import { useEffect } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** Spinner Import
import Spinner from 'src/@core/components/spinner'

// ** Hook Imports
import { useAuth } from 'src/hooks/useAuth'
import usePaths from 'src/hooks/useRouter'

/**
 *  Set Home URL based on User Roles
 */
export const getHomeRoute = (role: string) => {
  if (role === 'client') return '/acl'
  else return '/minibus/monitoreo'
}

const Home = () => {
  // ** Hooks
  const auth = useAuth()
  const router = useRouter()

  const paths = usePaths()
  useEffect(() => {
    if (!router.isReady) {
      return
    }

    if (auth.user && auth.user.rol) {
      if(paths.length === 0){
        router.replace('/acl')
      }else{
        router.replace(paths[0].path)
      }
      // const homeRoute = getHomeRoute(auth.user.rol)

      // // Redirect user to Home URL
      // router.replace(homeRoute)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paths])

  return <Spinner />
}

export default Home
