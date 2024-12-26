import PopUpClient from '@/collections/PopUps/component/client.index'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

const PopUp = async () => {
  const payload = await getPayload({ config: configPromise })
  const fetchPopUps = unstable_cache(async () => {
    return await payload.find({
      pagination: false,
      collection: 'popUp',
      sort: '-priority',
      depth: 2,
      limit: 1000,
    })
  },[],{
    tags: ['popups']
  })
  const data = await fetchPopUps();


  return <PopUpClient popUps={data.docs}/>;
}

export default PopUp;
