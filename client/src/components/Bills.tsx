import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createBill, deleteBill, getBills, patchBill } from '../api/bills-api'
import Auth from '../auth/Auth'
import { Bill } from '../types/Bill'

interface BillsProps {
  auth: Auth
  history: History
}

interface BillsState {
  bills: Bill[]
  newBillName: string
  loadingBills: boolean
}

export class Bills extends React.PureComponent<BillsProps, BillsState> {
  state: BillsState = {
    bills: [],
    newBillName: '',
    loadingBills: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newBillName: event.target.value })
  }

  onEditButtonClick = (billId: string) => {
    this.props.history.push(`/bills/${billId}/edit`)
  }

  onBillCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newBill = await createBill(this.props.auth.getIdToken(), {
        name: this.state.newBillName,
        dueDate
      })
      this.setState({
        bills: [...this.state.bills, newBill],
        newBillName: ''
      })
    } catch {
      alert('Bill creation failed')
    }
  }

  onBillDelete = async (billId: string) => {
    try {
      await deleteBill(this.props.auth.getIdToken(), billId)
      this.setState({
        bills: this.state.bills.filter(bill => bill.billId != billId)
      })
    } catch {
      alert('Bill deletion failed')
    }
  }

  onBillCheck = async (pos: number) => {
    try {
      const bill = this.state.bills[pos]
      await patchBill(this.props.auth.getIdToken(), bill.billId, {
        name: bill.name,
        dueDate: bill.dueDate,
        done: !bill.done
      })
      this.setState({
        bills: update(this.state.bills, {
          [pos]: { done: { $set: !bill.done } }
        })
      })
    } catch {
      alert('Bill deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const bills = await getBills(this.props.auth.getIdToken())
      this.setState({
        bills,
        loadingBills: false
      })
    } catch (e) {
      alert(`Failed to fetch bills: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">TODOs</Header>

        {this.renderCreateBillInput()}

        {this.renderBills()}
      </div>
    )
  }

  renderCreateBillInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New task',
              onClick: this.onBillCreate
            }}
            fluid
            actionPosition="left"
            placeholder="To change the world..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderBills() {
    if (this.state.loadingBills) {
      return this.renderLoading()
    }

    return this.renderBillsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading TODOs
        </Loader>
      </Grid.Row>
    )
  }

  renderBillsList() {
    return (
      <Grid padded>
        {this.state.bills.map((bill, pos) => {
          return (
            <Grid.Row key={bill.billId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onBillCheck(pos)}
                  checked={bill.done}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {bill.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {bill.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(bill.billId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onBillDelete(bill.billId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {bill.attachmentUrl && (
                <Image src={bill.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
