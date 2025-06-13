// ✅ UPDATED FILE: TableShow.tsx

'use client';

import { useEffect, useState } from 'react';
import { Table, TableHeader, TableBody, TableCell, TableRow, TableHead } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TableType } from '@/types';

interface TableShowProps {
  selectedPlan: string | null;
  onEdit: (table: TableType) => void;
  onDelete: (id: string) => void;
}

export function TableShow({ selectedPlan, onEdit, onDelete }: TableShowProps) {
  const [tables, setTables] = useState<TableType[]>([]);

  useEffect(() => {
    if (!selectedPlan) return;

    const fetchTables = async () => {
      try {
        const res = await fetch(`/api/tables?planId=${selectedPlan}`);
        if (!res.ok) throw new Error('Failed to fetch tables');
        const data = await res.json();
        setTables(data || []);
      } catch (err) {
        console.error('Error loading tables:', err);
        setTables([]);
      }
    };

    fetchTables();
  }, [selectedPlan]);

  if (!selectedPlan) return <p className="text-muted-foreground">No plan selected</p>;

  return (
    <div className="space-y-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Seats</TableHead>
            <TableHead>Price (£)</TableHead>
            <TableHead>Booked</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tables.map((table) => (
            <TableRow key={table.id}>
              <TableCell>{table.name}</TableCell>
              <TableCell>{table.seats}</TableCell>
              <TableCell>{table.price}</TableCell>
              <TableCell>
                {table.booked ? (
                  <Badge variant="destructive">Yes</Badge>
                ) : (
                  <Badge variant="secondary">No</Badge>
                )}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  size="sm"
                  onClick={() =>
                    onEdit({
                      ...table,
                      shape: table.shape as 'CIRCLE' | 'RECTANGULAR' | 'SQUARE',
                      position: table.position as 'VERTICAL' | 'DIAGONAL' | 'HORIZONTAL',
                      color: table.color as 'BLACK' | 'GREY' | 'ORANGE' | 'GREEN' | 'RED' | 'BRONZE',
                    })
                  }
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    if (confirm(`Delete table "${table.name}"?`)) {
                      onDelete(table.id);
                    }
                  }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
