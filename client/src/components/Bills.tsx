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

// Import Datepicker
import {  DatePickerInput } from 'rc-datepicker';

// Import the default style
import 'rc-datepicker/lib/style.css';



import { createBill, deleteBill, getBills, patchBill } from '../api/bills-api'
import Auth from '../auth/Auth'
import { Bill } from '../types/Bill'
import moment, { Moment } from 'moment'

interface BillsProps {
  auth: Auth
  history: History
}

interface BillsState {
  bills: Bill[]
  newBillName: string
  loadingBills: boolean
  billDate: Date
}

export class Bills extends React.PureComponent<BillsProps, BillsState> {
  state: BillsState = {
    bills: [],
    newBillName: '',
    loadingBills: true,
    billDate:  new Date()
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newBillName: event.target.value })
  }

  handleBillDateChange = (date: Date) => {
    // this.setState({,
    //   billDate: billDate
    // });
      this.setState({ billDate: date })
  };

  onEditButtonClick = (billId: string) => {
    this.props.history.push(`/bills/${billId}/edit`)
  }

  onBillCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      //const dueDate = this.calculateDueDate()
      const newBill = await createBill(this.props.auth.getIdToken(), {
        name: this.state.newBillName,
        billDate: dateFormat(this.state.billDate, 'yyyy-mm-dd')
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
      let paidDate:string = ' ';
      if (bill.paid === false){
      paidDate = this.calculatePaidAt()
      }
      if (bill.paid === true){
      paidDate = ' '
      }
      await patchBill(this.props.auth.getIdToken(), bill.billId, {
        name: bill.name,
        paidAt: paidDate,
        paid: !bill.paid
      })
      this.setState({
        bills: update(this.state.bills, {
          [pos]: { paid: { $set: !bill.paid },
                   paidAt: { $set: paidDate } }
        })
      })
    } catch {
      alert('Bill Update failed')
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
        <Header as="h1">Bills</Header>

        {this.renderCreateBillInput()}

        {this.renderBills()}
      </div>
    )
  }

  renderCreateBillInput() {
    return (
      <Grid padded>
      <Grid.Row>
          <Grid.Column width={11} floated="right">
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New Bill',
              onClick: this.onBillCreate
            }}
            fluid
            actionPosition="left"
            placeholder="To add bill name..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
          
          <Grid.Column width={2} textAlign='right' verticalAlign="middle"> 
          <Header size ='small' >Bill Date</Header>
          </Grid.Column> 
          <Grid.Column width={3} floated="right">
            <DatePickerInput
        onChange={this.handleBillDateChange}
        value={this.state.billDate}
        placeholder= "Bill Date"
        displayFormat='DD/MM/YYYY'
        returnFormat='YYYY-MM-DD'
      />      
        </Grid.Column>
          <Grid.Column width={16} floated="right">
          <Divider />
        </Grid.Column>
      </Grid.Row>
      </Grid>
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
          Loading Bills
        </Loader>
      </Grid.Row>
    )
  }

  renderBillsList() {
    return (
      <Grid padded>
        <Grid.Row>
          <Grid.Column width={1} textAlign="center">
            <Header size='small' >Paid</Header>
          </Grid.Column>
          <Grid.Column width={6} floated="right">
            <Header size='small' >Bill Name</Header>
          </Grid.Column>
          <Grid.Column width={2} textAlign="center">
            <Header size='small' >Bill Date</Header>
          </Grid.Column>
          <Grid.Column width={2} textAlign="center">
            <Header size='small' >Paid Date</Header>
          </Grid.Column>
          <Grid.Column width={1} textAlign="center">
            <Header size='small' >Attach</Header>
          </Grid.Column>
          <Grid.Column width={1} textAlign="center">
            <Header size='small' >Delete</Header>
          </Grid.Column >
          <Grid.Column width={3} textAlign="center">
            <Header size='small' >Attachment view</Header>
          </Grid.Column>
          </Grid.Row>
        {this.state.bills.map((bill, pos) => {
          return (
            <Grid.Row key={bill.billId}>
              <Grid.Column width={1} textAlign="center" verticalAlign="middle"> 
                <Checkbox
                  onChange={() => this.onBillCheck(pos)}
                  checked={bill.paid}
                />
              </Grid.Column>
              <Grid.Column width={6} floated="right" verticalAlign="middle">
                {bill.name}
              </Grid.Column>
              <Grid.Column width={2} textAlign="center" verticalAlign="middle">
                {bill.billDate}
              </Grid.Column>
              <Grid.Column width={2} textAlign="center" verticalAlign="middle">
                {bill.paidAt}
              </Grid.Column>
              <Grid.Column width={1} textAlign="center" verticalAlign="middle">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(bill.billId)}
                >
                  <Icon name="attach" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} textAlign="center" verticalAlign="middle">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onBillDelete(bill.billId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column >
              <Grid.Column width={3} textAlign="center">
              {bill.attachmentUrl && (
                <Image src={bill.attachmentUrl} size="small" wrapped />
              )}
              </Grid.Column>
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculatePaidAt(): string {
    const date = new Date()

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
