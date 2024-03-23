
import type { FeatureCollection } from 'geojson';
import { useState } from 'react';

interface Props {
    tab:string
    routData:object
}
const Routs = ({tab,routData}:Props) =>{
    const [activeTab, setActiveTab] = useState<string>(tab)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    return(<>{JSON.stringify(routData)}</>)
}
export default Routs