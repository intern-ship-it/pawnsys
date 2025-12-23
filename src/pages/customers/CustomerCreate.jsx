import { useState } from 'react'
import { useNavigate } from 'react-router'
import PageWrapper from '@/components/layout/PageWrapper'
import { Card, Button, Input, Select } from '@/components/common'
import { ArrowLeft, Save, User } from 'lucide-react'

export default function CustomerCreate() {
  const navigate = useNavigate()

  return (
    <PageWrapper
      title="Add New Customer"
      subtitle="Register a new customer in the system"
      actions={
        <Button variant="outline" leftIcon={ArrowLeft} onClick={() => navigate('/customers')}>
          Back to List
        </Button>
      }
    >
      <Card padding="lg">
        <Card.Header title="Customer Information" icon={User} />
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Full Name (as per IC)" placeholder="Enter full name" required />
            <Input label="IC Number" placeholder="XXXXXX-XX-XXXX" required />
            <Input label="Phone Number" placeholder="01X-XXX XXXX" required />
            <Input label="Email" type="email" placeholder="email@example.com" />
          </div>
          <Input label="Address" placeholder="Full address" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Date of Birth" type="date" />
            <Select 
              label="Gender" 
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
              ]} 
            />
            <Input label="Occupation" placeholder="Enter occupation" />
          </div>
          <Card.Footer>
            <Button variant="secondary" onClick={() => navigate('/customers')}>Cancel</Button>
            <Button variant="accent" leftIcon={Save}>Save Customer</Button>
          </Card.Footer>
        </form>
      </Card>
    </PageWrapper>
  )
}
