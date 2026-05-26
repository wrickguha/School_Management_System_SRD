import React, { useState, useEffect } from 'react';
import { TransportRoute, Vehicle } from '../../types';
import { logisticsService } from '../../services/logisticsService';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import * as Icons from 'lucide-react';

export const TransportRoutes: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [routes, setRoutes] = useState<TransportRoute[]>([]);

  useEffect(() => {
    logisticsService.getVehicles().then(setVehicles);
    logisticsService.getTransportRoutes().then(setRoutes);
  }, []);

  const routeColumns: Column<TransportRoute>[] = [
    { key: 'routeName', title: 'Route Name', sortable: true },
    { key: 'vehicleNo', title: 'Assigned Vehicle', sortable: true },
    { key: 'stops', title: 'Stops Route', render: (val: string[]) => val.join(' → ') },
    { key: 'monthlyFee', title: 'Route Cost (Monthly)', render: (val) => `$${val}` }
  ];

  const vehicleColumns: Column<Vehicle>[] = [
    { key: 'vehicleNo', title: 'Vehicle Reg. No', sortable: true },
    { key: 'driverName', title: 'Driver/Operator', sortable: true },
    { key: 'driverPhone', title: 'Contact Phone' },
    { key: 'capacity', title: 'Passenger Capacity' },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      render: (val) => (
        <Badge color={val === 'active' ? 'success' : 'warning'}>
          {val}
        </Badge>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <div>
        <h2>Transport Routes & Carriage Fleet</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Monitor transit routes, stops schedule, and active vehicle checklist.</p>
      </div>

      <h3>Active Transit Route Structures</h3>
      <DataTable columns={routeColumns} data={routes} searchKey="routeName" searchPlaceholder="Search route names..." />

      <h3 style={{ marginTop: 'var(--space-lg)' }}>Registered Transport Fleet</h3>
      <DataTable columns={vehicleColumns} data={vehicles} searchKey="vehicleNo" searchPlaceholder="Search vehicle numbers..." />
    </div>
  );
};
export default TransportRoutes;
