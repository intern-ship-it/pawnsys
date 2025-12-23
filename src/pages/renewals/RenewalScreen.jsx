import { useState } from 'react'
import { useNavigate } from 'react-router'
import PageWrapper from '@/components/layout/PageWrapper'
import { Card, Button, Input, Badge } from '@/components/common'
import { Search, RefreshCw, Calculator } from 'lucide-react'
import { formatCurrency } from '@/utils/formatters'

export default function RenewalScreen() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPledge, setSelectedPledge] = useState(null)

  // Mock selected pledge data
  const mockPledge = {
    id: 'PLG-2024-001234',
    customerName: 'Ahmad bin Abdullah',
    principalAmount: 6000,
    interestDue: 270,
    totalDue: 6270,
    maturityDate: '2025-05-15',
  }

  return (
    <PageWrapper
      title="Pledge Renewal"
      subtitle="Process pledge renewals and interest payments"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Search Section */}
        <Card padding="lg">
          <Card.Header title="Search Pledge" icon={Search} />
          <div className="space-y-4">
            <Input
              placeholder="Enter Pledge ID or Customer IC..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={Search}
            />
            <Button variant="accent" fullWidth onClick={() => setSelectedPledge(mockPledge)}>
              Search
            </Button>
          </div>

          {selectedPledge && (
            <div className="mt-6 p-4 bg-zinc-50 rounded-lg">
              <h4 className="font-semibold text-zinc-800 mb-3">Pledge Found</h4>
              <div className="space-y-2 text-sm">
                <p><span className="text-zinc-500">Pledge ID:</span> <span className="font-mono">{selectedPledge.id}</span></p>
                <p><span className="text-zinc-500">Customer:</span> {selectedPledge.customerName}</p>
                <p><span className="text-zinc-500">Principal:</span> {formatCurrency(selectedPledge.principalAmount)}</p>
                <p><span className="text-zinc-500">Interest Due:</span> <span className="text-amber-600 font-semibold">{formatCurrency(selectedPledge.interestDue)}</span></p>
              </div>
            </div>
          )}
        </Card>

        {/* Renewal Calculation */}
        <Card padding="lg">
          <Card.Header title="Renewal Details" icon={Calculator} />
          {selectedPledge ? (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-700 font-medium">Interest Calculation</p>
                <p className="text-2xl font-bold text-amber-800 mt-1">
                  {formatCurrency(selectedPledge.interestDue)}
                </p>
                <p className="text-xs text-amber-600 mt-1">3 months × 1.5% = 4.5%</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-zinc-600">Principal Amount</span>
                  <span className="font-semibold">{formatCurrency(selectedPledge.principalAmount)}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-zinc-600">Interest Due</span>
                  <span className="font-semibold text-amber-600">{formatCurrency(selectedPledge.interestDue)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-zinc-600 font-medium">Amount to Pay</span>
                  <span className="font-bold text-lg">{formatCurrency(selectedPledge.interestDue)}</span>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <Button variant="accent" fullWidth leftIcon={RefreshCw}>
                  Process Renewal
                </Button>
                <Button variant="outline" fullWidth>
                  Print Receipt
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-zinc-500">
              <RefreshCw className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Search for a pledge to process renewal</p>
            </div>
          )}
        </Card>
      </div>
    </PageWrapper>
  )
}
