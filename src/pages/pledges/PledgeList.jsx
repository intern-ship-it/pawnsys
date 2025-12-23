import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { setPledges } from '@/features/pledges/pledgesSlice'
import { getStorageItem, STORAGE_KEYS } from '@/utils/localStorage'
import { formatDate, formatCurrency } from '@/utils/formatters'
import PageWrapper from '@/components/layout/PageWrapper'
import { Card, Button, DataTable, Badge } from '@/components/common'
import { Plus, Download, Filter } from 'lucide-react'

export default function PledgeList() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { pledges } = useAppSelector((state) => state.pledges)

  useEffect(() => {
    const storedPledges = getStorageItem(STORAGE_KEYS.PLEDGES, [])
    dispatch(setPledges(storedPledges))
  }, [dispatch])

  const columns = [
    {
      key: 'id',
      label: 'Pledge ID',
      sortable: true,
      render: (value) => <span className="font-mono text-xs font-medium">{value}</span>,
    },
    {
      key: 'customerName',
      label: 'Customer',
      sortable: true,
    },
    {
      key: 'principalAmount',
      label: 'Principal',
      sortable: true,
      render: (value) => <span className="font-semibold">{formatCurrency(value)}</span>,
    },
    {
      key: 'pledgeDate',
      label: 'Pledge Date',
      sortable: true,
      render: (value) => formatDate(value),
    },
    {
      key: 'maturityDate',
      label: 'Maturity',
      sortable: true,
      render: (value) => formatDate(value),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <Badge.Status status={value} />,
    },
  ]

  return (
    <PageWrapper
      title="All Pledges"
      subtitle={`${pledges.length} total pledges`}
      actions={
        <>
          <Button variant="outline" leftIcon={Filter}>Filters</Button>
          <Button variant="outline" leftIcon={Download}>Export</Button>
          <Button variant="accent" leftIcon={Plus} onClick={() => navigate('/pledges/new')}>
            New Pledge
          </Button>
        </>
      }
    >
      <Card padding="none">
        <div className="p-4">
          <DataTable
            columns={columns}
            data={pledges}
            searchable
            searchPlaceholder="Search by pledge ID or customer..."
            onRowClick={(row) => navigate(`/pledges/${row.id}`)}
          />
        </div>
      </Card>
    </PageWrapper>
  )
}
