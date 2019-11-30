import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import { BillItem } from '../models/BillItem'
import { BillUpdate } from '../models/BillUpdate'

export class BillAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly billsTable = process.env.BILLS_TABLE
    ) {
  }

  async getBills(userId): Promise<BillItem[]> {
    const billsIndex = process.env.BILLS_INDEX
    console.log('Getting all Bills for user', userId)

    const result = await this.docClient.query({
        TableName: this.billsTable,
        IndexName: billsIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        },
        ScanIndexForward: false
      }).promise()

    const items = result.Items
    return items as BillItem[]
  }

  async createBill(billItem: BillItem): Promise<BillItem> {
    await this.docClient.put({
      TableName: this.billsTable,
      Item: billItem
    }).promise()

    return billItem
  }

  async deleteBill(billId): Promise<void> {
  const delBillItem = {

    "billId": billId
  }
  await this.docClient.delete({
    TableName: this.billsTable,
    Key: delBillItem 
  }).promise()

}

async generateUploadUrl(billId, attachId): Promise<String> {
    const bucketName = process.env.BILLS_ATTACHMENTS_S3_BUCKET
    const urlExpiration = 300
    const s3 = new XAWS.S3({
        signatureVersion: 'v4'
      })
  await this.docClient.update({
    TableName: this.billsTable,
    Key: {
  
      "billId": billId
    },
    UpdateExpression: "set attachmentUrl = :attachmentUrl",
    ExpressionAttributeValues: {
      ":attachmentUrl": `https://${bucketName}.s3.amazonaws.com/${attachId}`
    },
    ReturnValues: "UPDATED_NEW"
  }).promise()

  const url:String = s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: attachId,
    Expires: urlExpiration
  })

  return url
}

  async updateBill(billId, updBillItem: BillUpdate): Promise<void> {
    const updBillId = {
  
        "billId": billId
      }
    await this.docClient.update({
        TableName: this.billsTable,
        Key: updBillId,
        UpdateExpression: "set #nm=:nm, paidAt=:paidAt, paid=:paid",
        ExpressionAttributeValues: {
          ":nm": updBillItem.name,
          ":paidAt": updBillItem.paidAt,
          ":paid": updBillItem.paid
        },
        ExpressionAttributeNames:{
          "#nm": "name"
        },
        ReturnValues: "UPDATED_NEW"
      }).promise()
  }
}




function createDynamoDBClient() {
    
    return new XAWS.DynamoDB.DocumentClient()
  }
 