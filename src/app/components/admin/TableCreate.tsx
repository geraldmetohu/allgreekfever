// ✅ UPDATED FILE: TableCreate.tsx

'use client';

import { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Minus, Plus } from 'lucide-react';
import { TableType } from '@/types';

interface TableCreateProps {
  selectedPlan: string | null;
  editData?: TableType | null;
  form: TableType;
  setForm: React.Dispatch<React.SetStateAction<TableType>>;
  onSuccess?: () => void;
}

export function TableCreate({ selectedPlan, editData, form, setForm, onSuccess }: TableCreateProps) {
  useEffect(() => {
    if (editData) {
      setForm({
        ...editData,
        type: editData.type || 'VIP',
      });
    }
  }, [editData, setForm]);

  const updateForm = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleMove = (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    setForm((prev) => {
      const delta = 1;
      return {
        ...prev,
        startY: direction === 'UP' ? prev.startY - delta : direction === 'DOWN' ? prev.startY + delta : prev.startY,
        startX: direction === 'LEFT' ? prev.startX - delta : direction === 'RIGHT' ? prev.startX + delta : prev.startX,
      };
    });
  };

  const handleSizeChange = (key: 'width' | 'height', direction: 'increase' | 'decrease') => {
    setForm((prev) => ({
      ...prev,
      [key]: direction === 'increase' ? prev[key] + 1 : Math.max(1, prev[key] - 1),
    }));
  };

  const handleCreate = async () => {
    if (!selectedPlan) return alert('Please select a plan first.');

    try {
      const method = editData ? 'PUT' : 'POST';
      const url = editData ? `/api/tables/${editData.id}` : '/api/tables';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, planId: selectedPlan }),
      });

      if (!res.ok) throw new Error(`Failed to ${editData ? 'update' : 'create'} table`);
      alert(`✅ Table ${editData ? 'updated' : 'created'} successfully!`);

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error creating/updating table:', error);
      alert('❌ Something went wrong.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Table Name</Label>
          <Input value={form.name} onChange={(e) => updateForm('name', e.target.value)} />
        </div>

        <div>
          <Label>Shape</Label>
          <Select value={form.shape} onValueChange={(v) => updateForm('shape', v)}>
            <SelectTrigger><SelectValue placeholder="Select shape" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="CIRCLE">Circle</SelectItem>
              <SelectItem value="RECTANGULAR">Rectangular</SelectItem>
              <SelectItem value="SQUARE">Square</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Position</Label>
          <Select value={form.position} onValueChange={(v) => updateForm('position', v)}>
            <SelectTrigger><SelectValue placeholder="Select position" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="VERTICAL">Vertical</SelectItem>
              <SelectItem value="DIAGONAL">Diagonal</SelectItem>
              <SelectItem value="HORIZONTAL">Horizontal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Color</Label>
          <Select value={form.color} onValueChange={(v) => updateForm('color', v)}>
            <SelectTrigger><SelectValue placeholder="Select color" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="BLACK">Black</SelectItem>
              <SelectItem value="GREY">Grey</SelectItem>
              <SelectItem value="ORANGE">Orange</SelectItem>
              <SelectItem value="GREEN">Green</SelectItem>
              <SelectItem value="RED">Red</SelectItem>
              <SelectItem value="BRONZE">Bronze</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Type</Label>
          <Select value={form.type} onValueChange={(v) => updateForm('type', v)}>
            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="VIP">VIP</SelectItem>
              <SelectItem value="GOLD">Gold</SelectItem>
              <SelectItem value="SILVER">Silver</SelectItem>
              <SelectItem value="BRONZE">Bronze</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Width</Label>
          <div className="flex gap-2 items-center">
            <Button variant="outline" size="icon" onClick={() => handleSizeChange('width', 'decrease')}><Minus size={14} /></Button>
            <span>{form.width}</span>
            <Button variant="outline" size="icon" onClick={() => handleSizeChange('width', 'increase')}><Plus size={14} /></Button>
          </div>
        </div>

        <div>
          <Label>Height</Label>
          <div className="flex gap-2 items-center">
            <Button variant="outline" size="icon" onClick={() => handleSizeChange('height', 'decrease')}><Minus size={14} /></Button>
            <span>{form.height}</span>
            <Button variant="outline" size="icon" onClick={() => handleSizeChange('height', 'increase')}><Plus size={14} /></Button>
          </div>
        </div>

        <div>
          <Label>Seats</Label>
          <Input type="number" value={form.seats} onChange={(e) => updateForm('seats', Number(e.target.value))} />
        </div>

        <div>
          <Label>Price (£)</Label>
          <Input type="number" value={form.price} onChange={(e) => updateForm('price', Number(e.target.value))} />
        </div>
      </div>

      <div className="flex flex-col items-start gap-2 mt-4">
        <Label>Move Position</Label>
        <div className="flex gap-2">
          <Button size="icon" variant="outline" onClick={() => handleMove('UP')}><ArrowUp size={16} /></Button>
          <Button size="icon" variant="outline" onClick={() => handleMove('LEFT')}><ArrowLeft size={16} /></Button>
          <Button size="icon" variant="outline" onClick={() => handleMove('RIGHT')}><ArrowRight size={16} /></Button>
          <Button size="icon" variant="outline" onClick={() => handleMove('DOWN')}><ArrowDown size={16} /></Button>
        </div>
        <p className="text-sm text-muted-foreground">X: {form.startX}, Y: {form.startY}</p>
      </div>

      <div className="flex flex-wrap gap-6 mt-4">
        <div className="flex items-center space-x-2">
          <Switch checked={form.booked} onCheckedChange={(v) => updateForm('booked', v)} />
          <Label>Booked</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch checked={form.rounded} onCheckedChange={(v) => updateForm('rounded', v)} />
          <Label>Rounded</Label>
        </div>
      </div>

      <Button className="w-full mt-4" onClick={handleCreate}>
        {editData ? 'Update Table' : 'Create Table'}
      </Button>
    </div>
  );
}