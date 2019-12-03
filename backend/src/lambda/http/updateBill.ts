import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateBillRequest } from '../../requests/UpdateBillRequest'

import { BillAccess } from '../../dataLayer/billAccess'

const billAccess = new BillAccess()


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)
  const billId = event.pathParameters.billId
  const updatedBill: UpdateBillRequest = JSON.parse(event.body)

    const newBillVal = {
    
      "name": updatedBill.name,
      "paid": updatedBill.paid,
      "paidAt": updatedBill.paidAt

    }
    
    await billAccess.updateBill(billId, newBillVal)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(
        undefined
      )
    }

}
