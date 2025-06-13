// ✅ UPDATED FILE: PlanShow.tsx

'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updatePlanSize, getAllEvents, updatePlanNameAndEvent } from '@/app/actions';
import { Minus, Plus } from 'lucide-react';
import { TableType } from '@/types';

interface PlanType {
  id: string;
  name: string;
  width: number;
  height: number;
  eventId: string;
}

interface EventType {
  id: string;
  name: string;
}

interface PlanShowProps {
  selectedPlan: string | null;
  tables: TableType[];
  previewTable?: TableType;
  refreshTables: () => void;
}

export function PlanShow({ selectedPlan, tables, previewTable, refreshTables }: PlanShowProps) {
  const [selectedTable, setSelectedTable] = useState<TableType | null>(null);
  const [plan, setPlan] = useState<PlanType | null>(null);
  const [events, setEvents] = useState<EventType[]>([]);

  useEffect(() => {
    if (!selectedPlan) return;

    const fetchPlan = async () => {
      const res = await fetch(`/api/plans/${selectedPlan}`);
      if (res.ok) {
        const data = await res.json();
        setPlan(data);
      }
    };

    fetchPlan();
    getAllEvents().then(setEvents);
  }, [selectedPlan]);

  const handleChange = (key: keyof PlanType, value: number | string) => {
    if (!plan) return;
    setPlan({ ...plan, [key]: value } as PlanType);
  };

  const adjustSize = (key: 'width' | 'height', delta: number) => {
    if (!plan) return;
    setPlan((prev) => prev ? { ...prev, [key]: Math.max(1, prev[key] + delta) } : null);
  };

  const handleSave = async () => {
    if (!plan) return;
    try {
      await updatePlanSize({
        planId: plan.id,
        name: plan.name,
        width: Math.floor(Number(plan.width)),
        height: Math.floor(Number(plan.height)),
        eventId: plan.eventId,
      });

      await updatePlanNameAndEvent({
        planId: plan.id,
        name: plan.name,
        eventId: plan.eventId,
      });
      alert('✅ Plan updated successfully!');
    } catch (err) {
      console.error('Error updating plan:', err);
      alert('❌ Failed to update plan.');
    }
  };

  const unitSize = 20;

  const isOverlapping = (current: TableType): boolean => {
    return tables.some((other) => {
      if (current.id === other.id) return false;
      const xOverlap = current.startX < other.startX + other.width && current.startX + current.width > other.startX;
      const yOverlap = current.startY < other.startY + other.height && current.startY + current.height > other.startY;
      return xOverlap && yOverlap;
    });
  };

  return plan ? (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="plan-name">Plan Name</Label>
          <Input
            id="plan-name"
            type="text"
            value={plan.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-[150px]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="plan-event">Event</Label>
          <Select value={plan.eventId} onValueChange={(val) => handleChange('eventId', val)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Event" />
            </SelectTrigger>
            <SelectContent>
              {events.map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  {event.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="plan-width">Width (units)</Label>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={() => adjustSize('width', -1)}><Minus className="w-4 h-4" /></Button>
            <Input
              id="plan-width"
              type="number"
              min={1}
              value={plan.width}
              onChange={(e) => handleChange('width', Number(e.target.value))}
              className="w-[80px] text-center"
            />
            <Button variant="outline" size="icon" onClick={() => adjustSize('width', 1)}><Plus className="w-4 h-4" /></Button>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="plan-height">Height (units)</Label>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={() => adjustSize('height', -1)}><Minus className="w-4 h-4" /></Button>
            <Input
              id="plan-height"
              type="number"
              min={1}
              value={plan.height}
              onChange={(e) => handleChange('height', Number(e.target.value))}
              className="w-[80px] text-center"
            />
            <Button variant="outline" size="icon" onClick={() => adjustSize('height', 1)}><Plus className="w-4 h-4" /></Button>
          </div>
        </div>

        <Button className="mt-6" onClick={handleSave}>
          Save Plan
        </Button>
        <Button
  onClick={async () => {
    if (confirm('Are you sure you want to delete this plan?')) {
      await fetch(`/api/plans/${plan.id}`, { method: 'DELETE' });
      alert('Plan deleted.');
    }
  }}
>
  Delete Plan
</Button>

      </div>

      <div
        className="relative border bg-white overflow-hidden rounded"
        style={{ width: `${plan.width * unitSize}px`, height: `${plan.height * unitSize}px` }}
      >
        {tables.map((table) => {
          const overlapping = isOverlapping(table);
          return (
            <div
              key={table.id}
              onClick={() => setSelectedTable(table)}
              className={`absolute text-[10px] text-white flex items-center justify-center font-medium shadow cursor-pointer hover:ring-2 transition-all duration-200 ${overlapping ? 'ring-4 ring-red-500' : ''}`}
              style={{
                top: `${table.startY * unitSize}px`,
                left: `${table.startX * unitSize}px`,
                width: `${table.width * unitSize}px`,
                height: `${table.height * unitSize}px`,
                borderRadius: table.rounded ? '999px' : '6px',
                backgroundColor: colorMap[table.color],
                transform:
                  table.position === 'DIAGONAL'
                    ? 'rotate(45deg)'
                    : table.position === 'HORIZONTAL'
                    ? 'rotate(0deg)'
                    : 'rotate(90deg)',
              }}
            >
              {table.name}
            </div>
          );
        })}

        {previewTable && (
          <div
            className="absolute text-[10px] text-white flex items-center justify-center font-medium shadow ring-2 ring-dashed"
            style={{
              top: `${previewTable.startY * unitSize}px`,
              left: `${previewTable.startX * unitSize}px`,
              width: `${previewTable.width * unitSize}px`,
              height: `${previewTable.height * unitSize}px`,
              borderRadius: previewTable.rounded ? '999px' : '6px',
              backgroundColor: colorMap[previewTable.color],
              transform:
                previewTable.position === 'DIAGONAL'
                  ? 'rotate(45deg)'
                  : previewTable.position === 'HORIZONTAL'
                  ? 'rotate(0deg)'
                  : 'rotate(90deg)',
            }}
          >
            {previewTable.name}
          </div>
        )}
      </div>
    </div>
  ) : null;
}

const colorMap: Record<string, string> = {
  BLACK: '#000000',
  GREY: '#6b7280',
  ORANGE: '#f97316',
  GREEN: '#22c55e',
  RED: '#ef4444',
  BRONZE: '#cd7f32',
};