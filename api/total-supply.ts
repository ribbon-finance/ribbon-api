import { NextApiRequest, NextApiResponse } from 'next';
import {  getTotalSupply } from './_utils';

export default function handler(
  _: NextApiRequest,
  response: NextApiResponse,
) {
  response.status(200).send(getTotalSupply().toFixed(8));
}
