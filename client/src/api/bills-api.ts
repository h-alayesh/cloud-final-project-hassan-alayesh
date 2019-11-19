import { apiEndpoint } from '../config'
import { Bill } from '../types/Bill';
import { CreateBillRequest } from '../types/CreateBillRequest';
import Axios from 'axios'
import { UpdateBillRequest } from '../types/UpdateBillRequest';

export async function getBills(idToken: string): Promise<Bill[]> {
  console.log('Fetching bills')

  const response = await Axios.get(`${apiEndpoint}/bills`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Bills:', response.data)
  return response.data.items
}

export async function createBill(
  idToken: string,
  newBill: CreateBillRequest
): Promise<Bill> {
  const response = await Axios.post(`${apiEndpoint}/bills`,  JSON.stringify(newBill), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchBill(
  idToken: string,
  billId: string,
  updatedBill: UpdateBillRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/bills/${billId}`, JSON.stringify(updatedBill), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteBill(
  idToken: string,
  billId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/bills/${billId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  billId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/bills/${billId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
