import { useState } from 'react'
import PageWrapper from '@/components/layout/PageWrapper'
import { Card, Button, Select, Input, Badge } from '@/components/common'
import { BarChart3, Download, FileText, Calendar, TrendingUp, Users, Package } from 'lucide-react'
import { cn } from '@/lib/utils'

const reportTypes = [
  { id: 'daily', name: 'Daily Transaction Report', icon: Calendar, description: 'All transactions for a specific day' },
  { id: 'pledges', name: 'Pledges Report', icon: FileText, description: 'Active, renewed, and redeemed pledges' },
  { id: 'inventory', name: 'Inventory Report', icon: Package, description: 'Current stock and valuations' },
  { id: 'customers', name: 'Customer Report', icon: Users, description: 'Customer activity and history' },
  { id: 'financial', name: 'Financial Summary', icon: TrendingUp, description: 'Revenue, interest, and collections' },
  { id: 'kpkt', name: 'KPKT Compliance Report', icon: FileText, description: 'Regulatory compliance documentation' },
]

export default function ReportsScreen() {
  const [selectedReport, setSelectedReport] = useState(null)
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

  return (
    <PageWrapper
      title="Reports"
      subtitle="Generate and export various reports"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Types */}
        <Card padding="lg" className="lg:col-span-2">
          <Card.Header title="Select Report Type" icon={BarChart3} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {reportTypes.map((report) => {
              const Icon = report.icon
              const isSelected = selectedReport === report.id
              
              return (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report.id)}
                  className={cn(
                    'flex items-start gap-3 p-4 rounded-xl border text-left transition-all',
                    isSelected
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                  )}
                >
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                    isSelected ? 'bg-amber-500 text-white' : 'bg-zinc-100 text-zinc-600'
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className={cn(
                      'font-medium',
                      isSelected ? 'text-amber-800' : 'text-zinc-800'
                    )}>
                      {report.name}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">{report.description}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </Card>

        {/* Report Configuration */}
        <Card padding="lg">
          <Card.Header title="Report Options" />
          <div className="space-y-4">
            <Input
              label="Start Date"
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            />
            <Input
              label="End Date"
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            />
            <Select
              label="Format"
              options={[
                { value: 'pdf', label: 'PDF Document' },
                { value: 'excel', label: 'Excel Spreadsheet' },
                { value: 'csv', label: 'CSV File' },
              ]}
            />

            <div className="pt-4 space-y-3">
              <Button 
                variant="accent" 
                fullWidth 
                leftIcon={BarChart3}
                disabled={!selectedReport}
              >
                Generate Report
              </Button>
              <Button 
                variant="outline" 
                fullWidth 
                leftIcon={Download}
                disabled={!selectedReport}
              >
                Download
              </Button>
            </div>
          </div>

          {selectedReport && (
            <div className="mt-6 p-3 bg-zinc-50 rounded-lg">
              <p className="text-xs text-zinc-500">
                Selected: <span className="font-medium text-zinc-700">
                  {reportTypes.find(r => r.id === selectedReport)?.name}
                </span>
              </p>
            </div>
          )}
        </Card>
      </div>
    </PageWrapper>
  )
}
