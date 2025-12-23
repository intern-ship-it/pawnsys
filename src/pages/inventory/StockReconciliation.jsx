import { useState } from 'react'
import PageWrapper from '@/components/layout/PageWrapper'
import { Card, Button, Input, Badge } from '@/components/common'
import { QrCode, CheckCircle, XCircle, ClipboardCheck } from 'lucide-react'

export default function StockReconciliation() {
  const [scannedItems, setScannedItems] = useState([])
  const [scanInput, setScanInput] = useState('')

  const handleScan = () => {
    if (scanInput) {
      setScannedItems([...scannedItems, { barcode: scanInput, status: 'verified', time: new Date().toLocaleTimeString() }])
      setScanInput('')
    }
  }

  return (
    <PageWrapper
      title="Day-End Reconciliation"
      subtitle="Verify inventory against system records"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scanner Section */}
        <Card padding="lg">
          <Card.Header title="Barcode Scanner" icon={QrCode} />
          <div className="space-y-4">
            <Input
              placeholder="Scan or enter barcode..."
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleScan()}
            />
            <Button variant="accent" fullWidth onClick={handleScan}>
              Verify Item
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t">
            <h4 className="font-medium text-zinc-700 mb-3">Summary</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <p className="text-2xl font-bold text-emerald-600">{scannedItems.length}</p>
                <p className="text-xs text-emerald-700">Verified</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-600">0</p>
                <p className="text-xs text-red-700">Missing</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Scanned Items List */}
        <Card padding="lg" className="lg:col-span-2">
          <Card.Header 
            title="Scanned Items" 
            icon={ClipboardCheck}
            action={
              <Button variant="success" size="sm">Complete Reconciliation</Button>
            }
          />
          {scannedItems.length > 0 ? (
            <div className="space-y-2">
              {scannedItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span className="font-mono text-sm">{item.barcode}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="success">Verified</Badge>
                    <span className="text-xs text-zinc-500">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-zinc-500">
              <QrCode className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Start scanning items to verify</p>
            </div>
          )}
        </Card>
      </div>
    </PageWrapper>
  )
}
