import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { setItems } from '@/features/inventory/inventorySlice'
import { getStorageItem, STORAGE_KEYS } from '@/utils/localStorage'
import { formatCurrency } from '@/utils/formatters'
import PageWrapper from '@/components/layout/PageWrapper'
import { Card, Button, DataTable, Badge, StatCard } from '@/components/common'
import { Package, QrCode, Download, Filter } from 'lucide-react'

export default function InventoryList() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { items } = useAppSelector((state) => state.inventory)

  useEffect(() => {
    const storedInventory = getStorageItem(STORAGE_KEYS.INVENTORY, [])
    dispatch(setItems(storedInventory))
  }, [dispatch])

  const columns = [
    {
      key: 'barcode',
      label: 'Barcode',
      render: (value) => <span className="font-mono text-xs">{value}</span>,
    },
    {
      key: 'description',
      label: 'Item Description',
      sortable: true,
    },
    {
      key: 'weight',
      label: 'Weight',
      render: (value) => `${value}g`,
    },
    {
      key: 'purity',
      label: 'Purity',
      render: (value) => <Badge variant="info">{value}</Badge>,
    },
    {
      key: 'location',
      label: 'Location',
    },
    {
      key: 'currentValue',
      label: 'Value',
      render: (value) => <span className="font-semibold">{formatCurrency(value)}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <Badge.Status status={value} />,
    },
  ]

  // Calculate stats
  const totalValue = items.reduce((sum, item) => sum + item.currentValue, 0)
  const pledgedItems = items.filter(i => i.status === 'pledged').length
  const auctionReady = items.filter(i => i.status === 'auction-ready').length

  return (
    <PageWrapper
      title="Inventory Management"
      subtitle={`${items.length} items in stock`}
      actions={
        <>
          <Button variant="outline" leftIcon={Filter}>Filters</Button>
          <Button variant="outline" leftIcon={Download}>Export</Button>
          <Button variant="accent" leftIcon={QrCode}>Scan Barcode</Button>
        </>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Items" value={items.length} icon={Package} />
        <StatCard title="Total Value" value={formatCurrency(totalValue)} variant="amber" />
        <StatCard title="Pledged Items" value={pledgedItems} />
        <StatCard title="Auction Ready" value={auctionReady} variant={auctionReady > 0 ? 'danger' : 'default'} />
      </div>

      <Card padding="none">
        <div className="p-4">
          <DataTable
            columns={columns}
            data={items}
            searchable
            searchPlaceholder="Search by barcode, description..."
          />
        </div>
      </Card>
    </PageWrapper>
  )
}
