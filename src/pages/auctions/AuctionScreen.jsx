import { useState } from 'react'
import PageWrapper from '@/components/layout/PageWrapper'
import { Card, Button, DataTable, Badge, StatCard } from '@/components/common'
import { Gavel, Download, Calendar, DollarSign, AlertTriangle } from 'lucide-react'
import { formatCurrency, formatDate } from '@/utils/formatters'

export default function AuctionScreen() {
  // Mock auction-ready items
  const auctionItems = [
    {
      id: 'PLG-2024-001220',
      customerName: 'Rajesh a/l Krishnan',
      itemDescription: 'Subang Emas 916',
      weight: '8.5g',
      principalAmount: 2000,
      totalDue: 2360,
      defaultDate: '2024-09-15',
      auctionDate: '2025-03-15',
    },
  ]

  const columns = [
    {
      key: 'id',
      label: 'Pledge ID',
      render: (value) => <span className="font-mono text-xs">{value}</span>,
    },
    {
      key: 'customerName',
      label: 'Customer',
    },
    {
      key: 'itemDescription',
      label: 'Item',
    },
    {
      key: 'weight',
      label: 'Weight',
    },
    {
      key: 'totalDue',
      label: 'Amount Due',
      render: (value) => <span className="font-semibold text-red-600">{formatCurrency(value)}</span>,
    },
    {
      key: 'auctionDate',
      label: 'Eligible Date',
      render: (value) => formatDate(value),
    },
  ]

  return (
    <PageWrapper
      title="Auction Management"
      subtitle="KPKT-compliant auction processing"
      actions={
        <>
          <Button variant="outline" leftIcon={Download}>Export Auction List</Button>
          <Button variant="accent" leftIcon={Gavel}>Generate KPKT Report</Button>
        </>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Auction Ready" 
          value={auctionItems.length} 
          icon={Gavel}
          variant="danger"
        />
        <StatCard 
          title="Total Value" 
          value={formatCurrency(auctionItems.reduce((sum, i) => sum + i.totalDue, 0))} 
        />
        <StatCard title="Upcoming Auctions" value="2" icon={Calendar} />
        <StatCard title="This Month Sales" value={formatCurrency(0)} />
      </div>

      {/* Warning Banner */}
      <Card className="bg-amber-50 border-amber-200 mb-6">
        <div className="flex items-start gap-3 p-4">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-amber-800">KPKT Compliance Notice</h4>
            <p className="text-sm text-amber-700 mt-1">
              Items can only be auctioned after 6 months from the maturity date as per KPKT regulations. 
              Customers must be notified 14 days before the auction date.
            </p>
          </div>
        </div>
      </Card>

      {/* Auction Items Table */}
      <Card padding="none">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-zinc-800">Items Eligible for Auction</h3>
        </div>
        <div className="p-4">
          <DataTable
            columns={columns}
            data={auctionItems}
            searchable
            emptyMessage="No items eligible for auction"
          />
        </div>
      </Card>
    </PageWrapper>
  )
}
