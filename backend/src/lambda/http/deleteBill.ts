import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { BillAccess } from '../../dataLayer/billAccess'

const billAccess = new BillAccess()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const billId = event.pathParameters.billId

    // TODO: Remove a TODO item by id

    await billAccess.deleteBill( billId )

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

