package com.driver.services;


import com.driver.EntryDto.BookTicketEntryDto;
import com.driver.model.Passenger;
import com.driver.model.Ticket;
import com.driver.model.Train;
import com.driver.repository.PassengerRepository;
import com.driver.repository.TicketRepository;
import com.driver.repository.TrainRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TicketService {

    @Autowired
    TicketRepository ticketRepository;

    @Autowired
    TrainRepository trainRepository;

    @Autowired
    PassengerRepository passengerRepository;


    public Integer bookTicket(BookTicketEntryDto bookTicketEntryDto)throws Exception{

        //Check for validity
        //Use bookedTickets List from the TrainRepository to get bookings done against that train
        // Incase the there are insufficient tickets
        // throw new Exception("Less tickets are available");
        //otherwise book the ticket, calculate the price and other details
        //Save the information in corresponding DB Tables
        //Fare System : Check problem statement
        //Incase the train doesn't pass through the requested stations
        //throw new Exception("Invalid stations");
        //Save the bookedTickets in the train Object
        //Also in the passenger Entity change the attribute bookedTickets by using the attribute bookingPersonId.
        //And the end return the ticketId that has come from db

        Train train=trainRepository.findById(bookTicketEntryDto.getTrainId()).get();
        List<Ticket> ticketList=train.getBookedTickets();

        int bookedSeats=0;
        for(Ticket ticket: ticketList)
        {
            bookedSeats+=ticket.getPassengersList().size();
        }

        if(bookedSeats + bookTicketEntryDto.getNoOfSeats() > train.getNoOfSeats())
        {
            throw new Exception("Less tickets are available");
        }

        List<Passenger> passengerList=new ArrayList<>();

        for (int id: bookTicketEntryDto.getPassengerIds())
        {
            Passenger p=passengerRepository.findById(id).get();
            passengerList.add(p);
        }

        String [] stations=train.getRoute().split(",");
        int x=-1,y=-1;

        for(int i=0;i<stations.length;i++)
        {
            if (stations[i].equals(bookTicketEntryDto.getFromStation().toString()))
            {
                x=i;
            }
        }
        for(int i=0;i<stations.length;i++)
        {
            if(stations[i].equals(bookTicketEntryDto.getToStation().toString()))
            {
                y=i;
            }
        }

        if(x==-1 || y==-1 || y-x<0)
        {
            throw  new Exception("Invalid stations");
        }

        Ticket ticket=new Ticket();
        ticket.setFromStation(bookTicketEntryDto.getFromStation());
        ticket.setToStation(bookTicketEntryDto.getToStation());
        ticket.setPassengersList(passengerList);

        int fair= bookTicketEntryDto.getNoOfSeats() * (y-x) * 300;

        ticket.setTotalFare(fair);
        ticket.setTrain(train);

        train.getBookedTickets().add(ticket);
        train.setNoOfSeats(train.getNoOfSeats()-bookTicketEntryDto.getNoOfSeats());

        Passenger passenger=passengerRepository.findById(bookTicketEntryDto.getBookingPersonId()).get();
        passenger.getBookedTickets().add(ticket);

        Train saveTrain=trainRepository.save(train);
        Ticket saveTicket=ticketRepository.save(ticket);


        return saveTicket.getTicketId();

    }
}