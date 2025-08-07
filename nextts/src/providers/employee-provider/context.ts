import { ITicket } from '../ticket-provider/context'

export interface IEmployee {
    id: string
    name: string
    surname: string
    emailAddress: string
    phoneNumber: string
    department: string
    userName: string
    ticketsAssigned: ITicket[]
}

