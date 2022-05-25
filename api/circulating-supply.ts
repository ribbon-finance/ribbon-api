import { NextApiRequest, NextApiResponse } from 'next';
import { getCirculatingSupply } from './_utils';


export default async function handler(
  _: NextApiRequest,
  response: NextApiResponse,
) {
  response.status(200).send((await getCirculatingSupply()).toFixed(8));
}
