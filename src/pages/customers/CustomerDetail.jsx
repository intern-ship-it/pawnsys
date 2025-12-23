import { useParams, useNavigate } from 'react-router'
import PageWrapper from '@/components/layout/PageWrapper'
import { Card, Button, Badge } from '@/components/common'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'

export default function CustomerDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  return (
    <PageWrapper
      title="Customer Details"
      subtitle={`Customer ID: ${id}`}
      actions={
        <>
          <Button variant="outline" leftIcon={ArrowLeft} onClick={() => navigate('/customers')}>
            Back
          </Button>
          <Button variant="outline" leftIcon={Edit}>Edit</Button>
          <Button variant="danger" leftIcon={Trash2}>Delete</Button>
        </>
      }
    >
      <Card>
        <p className="text-zinc-600">Customer detail page for ID: {id}</p>
        <p className="text-sm text-zinc-500 mt-2">Full customer details, pledge history, and documents will be displayed here.</p>
      </Card>
    </PageWrapper>
  )
}
