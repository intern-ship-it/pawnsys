import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAppDispatch } from '@/app/hooks'
import { addToast } from '@/features/ui/uiSlice'
import { cn } from '@/lib/utils'
import PageWrapper from '@/components/layout/PageWrapper'
import { Card, Button, Input, Select } from '@/components/common'
import { ArrowLeft, ArrowRight, Check, User, Package, Calculator, Wallet, FileSignature } from 'lucide-react'

const steps = [
  { id: 1, title: 'Customer', icon: User, description: 'Select or add customer' },
  { id: 2, title: 'Items', icon: Package, description: 'Add pledge items' },
  { id: 3, title: 'Valuation', icon: Calculator, description: 'Calculate value' },
  { id: 4, title: 'Payout', icon: Wallet, description: 'Payment method' },
  { id: 5, title: 'Confirm', icon: FileSignature, description: 'Review & sign' },
]

export default function NewPledge() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [currentStep, setCurrentStep] = useState(1)

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    dispatch(addToast({
      type: 'success',
      title: 'Pledge Created',
      message: 'New pledge has been created successfully!',
    }))
    navigate('/pledges')
  }

  return (
    <PageWrapper
      title="New Pledge"
      subtitle="Create a new pledge transaction"
      actions={
        <Button variant="outline" leftIcon={ArrowLeft} onClick={() => navigate('/pledges')}>
          Cancel
        </Button>
      }
    >
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id

            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all',
                      isActive && 'border-amber-500 bg-amber-50 text-amber-600',
                      isCompleted && 'border-emerald-500 bg-emerald-500 text-white',
                      !isActive && !isCompleted && 'border-zinc-300 bg-white text-zinc-400'
                    )}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={cn(
                      'text-sm font-medium',
                      isActive && 'text-amber-600',
                      isCompleted && 'text-emerald-600',
                      !isActive && !isCompleted && 'text-zinc-400'
                    )}>
                      {step.title}
                    </p>
                    <p className="text-xs text-zinc-500 hidden sm:block">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    'w-16 lg:w-24 h-0.5 mx-2',
                    isCompleted ? 'bg-emerald-500' : 'bg-zinc-200'
                  )} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Step Content */}
      <Card padding="lg" className="max-w-4xl mx-auto">
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Information</h3>
            <Input label="Search Customer by IC" placeholder="Enter IC number or name..." />
            <p className="text-sm text-zinc-500">Or <button className="text-amber-600 font-medium">add new customer</button></p>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Pledge Items</h3>
            <div className="grid grid-cols-2 gap-4">
              <Select label="Item Category" options={[{ value: 'gold', label: 'Gold' }]} />
              <Select label="Purity" options={[
                { value: '916', label: '916 (22K)' },
                { value: '999', label: '999 (24K)' },
                { value: '750', label: '750 (18K)' },
              ]} />
              <Input label="Weight (grams)" type="number" placeholder="0.00" />
              <Input label="Description" placeholder="Item description" />
            </div>
            <Button variant="outline">+ Add Another Item</Button>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Valuation & Loan Amount</h3>
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-700">Current Gold Price: RM 295.00/g (916)</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Estimated Value" value="RM 7,500.00" disabled />
              <Input label="Loan Amount (70%)" value="RM 5,250.00" disabled />
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Payout Method</h3>
            <Select label="Payment Method" options={[
              { value: 'cash', label: 'Cash' },
              { value: 'bank', label: 'Bank Transfer' },
              { value: 'cheque', label: 'Cheque' },
            ]} />
            <Input label="Bank Account (if applicable)" placeholder="Account number" />
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Review & Confirm</h3>
            <div className="p-4 bg-zinc-50 rounded-lg space-y-2">
              <p><strong>Customer:</strong> Ahmad bin Abdullah</p>
              <p><strong>Item:</strong> Gold Chain 916 - 25.5g</p>
              <p><strong>Loan Amount:</strong> RM 5,250.00</p>
              <p><strong>Interest Rate:</strong> 1.5% per month</p>
              <p><strong>Maturity Date:</strong> 23 June 2025</p>
            </div>
            <div className="border-2 border-dashed border-zinc-300 rounded-lg p-8 text-center">
              <p className="text-zinc-500">Signature pad will appear here</p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button 
            variant="outline" 
            leftIcon={ArrowLeft} 
            onClick={handlePrev}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          {currentStep < 5 ? (
            <Button variant="accent" rightIcon={ArrowRight} onClick={handleNext}>
              Next Step
            </Button>
          ) : (
            <Button variant="success" leftIcon={Check} onClick={handleSubmit}>
              Create Pledge
            </Button>
          )}
        </div>
      </Card>
    </PageWrapper>
  )
}
