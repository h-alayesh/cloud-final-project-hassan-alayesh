import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import * as uuid from 'uuid'

import { BillAccess } from '../../dataLayer/billAccess'

const billAccess = new BillAccess()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const billId = event.pathParameters.billId

  const attachId = uuid.v4()

  const url:String = await billAccess.generateUploadUrl(billId, attachId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({

      uploadUrl: url
    }
      
    )
  }

}
