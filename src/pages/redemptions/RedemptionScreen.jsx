import { useState } from 'react'
import { useNavigate } from 'react-router'
import PageWrapper from '@/components/layout/PageWrapper'
import { Card, Button, Input, Badge } from '@/components/common'
import { Search, Wallet, FileSignature } from 'lucide-react'
import { formatCurrency } from '@/utils/formatters'

export default function RedemptionScreen() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPledge, setSelectedPledge] = useState(null)

  const mockPledge = {
    id: 'PLG-2024-001234',
    customerName: 'Ahmad bin Abdullah',
    principalAmount: 6000,
    interestDue: 270,
    totalRedemption: 6270,
    items: [{ description: 'Rantai Emas 916 (22K)', weight: '25.5g' }],
  }

  return (
    <PageWrapper
      title="Item Redemption"
      subtitle="Process item redemptions and returns"
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
                <p><span className="text-zinc-500">Items:</span> {selectedPledge.items[0].description}</p>
              </div>
            </div>
          )}
        </Card>

        {/* Redemption Details */}
        <Card padding="lg">
          <Card.Header title="Redemption Details" icon={Wallet} />
          {selectedPledge ? (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <p className="text-sm text-emerald-700 font-medium">Total Redemption Amount</p>
                <p className="text-2xl font-bold text-emerald-800 mt-1">
                  {formatCurrency(selectedPledge.totalRedemption)}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-zinc-600">Principal Amount</span>
                  <span className="font-semibold">{formatCurrency(selectedPledge.principalAmount)}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-zinc-600">Interest Due</span>
                  <span className="font-semibold">{formatCurrency(selectedPledge.interestDue)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-zinc-600 font-medium">Total to Pay</span>
                  <span className="font-bold text-lg">{formatCurrency(selectedPledge.totalRedemption)}</span>
                </div>
              </div>

              <div className="border-2 border-dashed border-zinc-300 rounded-lg p-6 text-center">
                <FileSignature className="w-8 h-8 mx-auto mb-2 text-zinc-400" />
                <p className="text-sm text-zinc-500">Customer Signature</p>
              </div>

              <div className="pt-4 space-y-3">
                <Button variant="success" fullWidth leftIcon={Wallet}>
                  Process Redemption
                </Button>
                <Button variant="outline" fullWidth>
                  Partial Redemption
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-zinc-500">
              <Wallet className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Search for a pledge to process redemption</p>
            </div>
          )}
        </Card>
      </div>
    </PageWrapper>
  )
}
