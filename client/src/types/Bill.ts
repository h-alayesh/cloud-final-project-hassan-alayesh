export interface Bill {
  userId: string
  billId: string
  createdAt: string
  name: string
  billDate: string
  paid: boolean
  paidAt?: string
  attachmentUrl?: string
}
