import { useParams, useNavigate } from 'react-router'
import PageWrapper from '@/components/layout/PageWrapper'
import { Card, Button, Badge } from '@/components/common'
import { ArrowLeft, Printer, RefreshCw, Wallet } from 'lucide-react'

export default function PledgeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  return (
    <PageWrapper
      title="Pledge Details"
      subtitle={`Pledge ID: ${id}`}
      actions={
        <>
          <Button variant="outline" leftIcon={ArrowLeft} onClick={() => navigate('/pledges')}>
            Back
          </Button>
          <Button variant="outline" leftIcon={Printer}>Print Ticket</Button>
          <Button variant="secondary" leftIcon={RefreshCw} onClick={() => navigate('/renewals')}>
            Renew
          </Button>
          <Button variant="accent" leftIcon={Wallet} onClick={() => navigate('/redemptions')}>
            Redeem
          </Button>
        </>
      }
    >
      <Card>
        <p className="text-zinc-600">Pledge detail page for ID: {id}</p>
        <p className="text-sm text-zinc-500 mt-2">Full pledge details, item information, payment history, and actions will be displayed here.</p>
      </Card>
    </PageWrapper>
  )
}
