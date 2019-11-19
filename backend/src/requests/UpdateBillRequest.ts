/**
 * Fields in a request to update a single TODO item.
 */
export interface UpdateTodoRequest {
  name: string
  billDate: string
  done: boolean
  paidAt: string
}