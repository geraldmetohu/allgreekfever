// ✅ UPDATED FILE: TablePlannerPage.tsx

'use client';

import { SetStateAction, useEffect, useState } from "react";
import { TableType } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { TableShow } from "@/app/components/admin/TableShow";
import { PlanShow } from "@/app/components/admin/PlanShow";
import { createPlan, getAllPlans, updatePlanDimensions } from "@/app/actions";
import { TableCreate } from "@/app/components/admin/TableCreate";

type PlanMeta = {
  id: string;
  name: string;
  width: number;
  height: number;
};

type EventMeta = {
  id: string;
  name: string;
};

export default function TablePlannerPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [editingTable, setEditingTable] = useState<TableType | null>(null);
  const [plans, setPlans] = useState<PlanMeta[]>([]);
  const [creatingPlan, setCreatingPlan] = useState(false);

  const [events, setEvents] = useState<EventMeta[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const [newPlanName, setNewPlanName] = useState("");
  const [newPlanWidth, setNewPlanWidth] = useState(24);
  const [newPlanHeight, setNewPlanHeight] = useState(36);

  const [editingPlanWidth, setEditingPlanWidth] = useState<number | null>(null);
  const [editingPlanHeight, setEditingPlanHeight] = useState<number | null>(null);
  const [tables, setTables] = useState<TableType[]>([]);

  const refreshTables = async () => {
    if (!selectedPlan) return;
    const res = await fetch(`/api/tables?planId=${selectedPlan}`);
    if (res.ok) {
      const data = await res.json();
      setTables(data || []);
    }
  };

  useEffect(() => {
    refreshTables();
  }, [selectedPlan]);

  useEffect(() => {
    getAllPlans().then(setPlans);
    fetch("/api/events")
      .then((res) => res.json())
      .then(setEvents);
  }, []);

  useEffect(() => {
    const plan = plans.find((p) => p.id === selectedPlan);
    if (plan) {
      setEditingPlanWidth(plan.width);
      setEditingPlanHeight(plan.height);
    }
  }, [selectedPlan, plans]);

  const handleCreatePlan = async () => {
    if (!newPlanName || !selectedEventId) {
      alert("Please enter a plan name and select an event");
      return;
    }

    const newPlan = await createPlan({
      name: newPlanName,
      width: newPlanWidth,
      height: newPlanHeight,
      eventId: selectedEventId,
    });

    const updatedPlans = await getAllPlans();
    setPlans(updatedPlans);
    setSelectedPlan(newPlan.id);
    setCreatingPlan(false);
    setNewPlanName("");
    setNewPlanWidth(24);
    setNewPlanHeight(36);
    refreshTables();
  };

  const handleUpdatePlan = async () => {
    if (!selectedPlan || editingPlanWidth === null || editingPlanHeight === null) return;
    await updatePlanDimensions({
      planId: selectedPlan,
      width: editingPlanWidth,
      height: editingPlanHeight,
    });
    const updatedPlans = await getAllPlans();
    setPlans(updatedPlans);
  };

  const handleDeleteTable = async (id: string) => {
    await fetch(`/api/tables/${id}`, { method: 'DELETE' });
    refreshTables();
  };

  const defaultTableForm: TableType = {
  id: '',
  name: '',
  shape: 'CIRCLE',
  position: 'VERTICAL',
  color: 'BLACK',
  rounded: false,
  booked: false,
  width: 2,
  height: 2,
  startX: 0,
  startY: 0,
  seats: 10,
  price: 30,
  type: 'VIP',
  planId: '', // ✅ Add this line
};


  const [newTableForm, setNewTableForm] = useState<TableType>(defaultTableForm);

  return (
    <div className="p-4 space-y-4 text-blue-950">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold"> Table Planner</h1>
        <div className="flex gap-2 items-end">
          <Select onValueChange={setSelectedPlan}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a plan" />
            </SelectTrigger>
            <SelectContent>
              {plans.length === 0 ? (
                <SelectItem disabled value="none">No plans available</SelectItem>
              ) : (
                plans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <Button onClick={() => setCreatingPlan(!creatingPlan)}>
            {creatingPlan ? "Cancel" : "+ New Plan"}
          </Button>
        </div>
      </div>

      {creatingPlan && (
        <div className="flex gap-2 items-center flex-wrap">
          <Input placeholder="Plan Name" value={newPlanName} onChange={(e) => setNewPlanName(e.target.value)} className="w-[150px]" />
          <Input type="number" placeholder="Width" value={newPlanWidth} onChange={(e) => setNewPlanWidth(Number(e.target.value))} className="w-[100px]" />
          <Input type="number" placeholder="Height" value={newPlanHeight} onChange={(e) => setNewPlanHeight(Number(e.target.value))} className="w-[100px]" />
          <Select onValueChange={setSelectedEventId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Event" />
            </SelectTrigger>
            <SelectContent>
              {Array.isArray(events) && events.map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  {event.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleCreatePlan}>Create</Button>
        </div>
      )}

      {selectedPlan && (
        <div className="flex gap-2 items-center">
          <Input type="number" value={editingPlanWidth ?? 0} onChange={(e) => setEditingPlanWidth(Number(e.target.value))} placeholder="Edit Width" className="w-[100px]" />
          <Input type="number" value={editingPlanHeight ?? 0} onChange={(e) => setEditingPlanHeight(Number(e.target.value))} placeholder="Edit Height" className="w-[100px]" />
          <Button onClick={handleUpdatePlan}>Save</Button>
        </div>
      )}

      <div className="flex gap-4 h-[80vh]">
        <div className="w-[40%] flex flex-col gap-4 border p-4 overflow-auto">
          <div className="h-[35%]">
            <TableCreate
              selectedPlan={selectedPlan}
              editData={editingTable}
              form={newTableForm}
              setForm={setNewTableForm}
              onSuccess={() => {
                refreshTables();
                setNewTableForm(defaultTableForm);
              }}
            />
          </div>
        </div>

        <div className="w-[60%] border p-4 overflow-auto bg-muted rounded-md">
<PlanShow
  selectedPlan={selectedPlan}
  tables={tables}
  previewTable={newTableForm} // ✅ NEW
  refreshTables={refreshTables}
/>
        </div>
      </div>

      <div className="h-[65%] overflow-y-auto">
        <TableShow selectedPlan={selectedPlan} onEdit={setEditingTable} onDelete={handleDeleteTable} />
      </div>
    </div>
  );
}
