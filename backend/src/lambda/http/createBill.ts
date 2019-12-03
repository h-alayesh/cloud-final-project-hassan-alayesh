import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateBillRequest } from '../../requests/CreateBillRequest'

import * as uuid from 'uuid'

import { getUserId } from '../utils'

import { BillAccess } from '../../dataLayer/billAccess'

const billAccess = new BillAccess()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)

  const billId = uuid.v4()

  const newBill: CreateBillRequest = JSON.parse(event.body)

  const newBillItem = {

    billId: billId,
    userId: getUserId(jwtToken),
    createdAt: new Date().toISOString(),
    name: newBill.name,
    billDate: newBill.billDate,
    paid: false
    
  }

  const createdBillItem = await billAccess.createBill( newBillItem )
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(
      
      {
        item: createdBillItem
      }
    )
  }
}
