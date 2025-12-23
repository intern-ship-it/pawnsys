import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { setCustomers } from '@/features/customers/customersSlice'
import { getStorageItem, STORAGE_KEYS } from '@/utils/localStorage'
import { formatDate, formatCurrency, formatIC, formatPhone } from '@/utils/formatters'
import PageWrapper from '@/components/layout/PageWrapper'
import { Card, Button, DataTable, Badge } from '@/components/common'
import { Plus, Download, Filter } from 'lucide-react'

export default function CustomerList() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { customers } = useAppSelector((state) => state.customers)

  useEffect(() => {
    const storedCustomers = getStorageItem(STORAGE_KEYS.CUSTOMERS, [])
    dispatch(setCustomers(storedCustomers))
  }, [dispatch])

  const columns = [
    {
      key: 'id',
      label: 'ID',
      sortable: true,
      render: (value) => <span className="font-mono text-xs">{value}</span>,
    },
    {
      key: 'name',
      label: 'Customer Name',
      sortable: true,
      render: (value, row) => (
        <div>
          <p className="font-medium text-zinc-800">{value}</p>
          <p className="text-xs text-zinc-500">{formatIC(row.icNumber)}</p>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (value) => formatPhone(value),
    },
    {
      key: 'activePledges',
      label: 'Active Pledges',
      sortable: true,
      render: (value) => (
        <Badge variant={value > 0 ? 'info' : 'default'}>{value}</Badge>
      ),
    },
    {
      key: 'totalAmount',
      label: 'Total Value',
      sortable: true,
      render: (value) => <span className="font-semibold">{formatCurrency(value)}</span>,
    },
    {
      key: 'lastVisit',
      label: 'Last Visit',
      sortable: true,
      render: (value) => formatDate(value),
    },
    {
      key: 'riskLevel',
      label: 'Risk',
      render: (value) => {
        const variants = { low: 'success', medium: 'warning', high: 'danger' }
        return <Badge variant={variants[value]}>{value}</Badge>
      },
    },
  ]

  return (
    <PageWrapper
      title="Customers"
      subtitle={`${customers.length} total customers`}
      actions={
        <>
          <Button variant="outline" leftIcon={Filter}>Filters</Button>
          <Button variant="outline" leftIcon={Download}>Export</Button>
          <Button variant="accent" leftIcon={Plus} onClick={() => navigate('/customers/new')}>
            Add Customer
          </Button>
        </>
      }
    >
      <Card padding="none">
        <div className="p-4">
          <DataTable
            columns={columns}
            data={customers}
            searchable
            searchPlaceholder="Search by name, IC, or phone..."
            onRowClick={(row) => navigate(`/customers/${row.id}`)}
          />
        </div>
      </Card>
    </PageWrapper>
  )
}
