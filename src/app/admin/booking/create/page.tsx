"use client";

import { useEffect, useState } from "react";
import { EditBookingForm } from "@/app/components/admin/EditBookingForm";
import { getAllEvents, getFreeTablesByPlan, getPlansByEvent } from "@/app/actions";

export default function CreateBookingPage() {
const [events, setEvents] = useState<{ id: string; name: string }[]>([]);
const [plans, setPlans] = useState<{ id: string; name: string }[]>([]);
const [tables, setTables] = useState<{ id: string; name: string }[]>([]);

  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [selectedTable, setSelectedTable] = useState("");

  useEffect(() => {
    getAllEvents().then(setEvents);
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      getPlansByEvent(selectedEvent).then(setPlans);
    }
  }, [selectedEvent]);

  useEffect(() => {
    if (selectedPlan) {
      getFreeTablesByPlan(selectedPlan).then(setTables);
    }
  }, [selectedPlan]);

  return (
    <EditBookingForm
      data={{
        id: "",
        paid: false,
        date: new Date(),
        time: "",
        customer: "",
        email: "",
        phone: "",
        tickets: 1,
        total: 0,
        tableId: selectedTable,
        eventId: selectedEvent,
      }}
      isEdit={false}
      eventOptions={events}
      planOptions={plans}
      tableOptions={tables}
      setEvent={setSelectedEvent}
      setPlan={setSelectedPlan}
      setTable={setSelectedTable}
    />
  );
}
