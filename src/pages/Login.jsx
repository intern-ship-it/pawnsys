import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAppDispatch } from '@/app/hooks'
import { loginStart, loginSuccess, loginFailure } from '@/features/auth/authSlice'
import { addToast } from '@/features/ui/uiSlice'
import { cn } from '@/lib/utils'
import mockUsers from '@/data/mockUsers'
import { setStorageItem, STORAGE_KEYS } from '@/utils/localStorage'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import { User, Lock, Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    dispatch(loginStart())
    
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    // Find user in mock data
    const user = mockUsers.find(
      (u) => u.username === formData.username && u.password === formData.password
    )
    
    if (user) {
      const authData = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
        },
        role: user.role,
        isAuthenticated: true,
      }
      
      // Save to localStorage
      setStorageItem(STORAGE_KEYS.AUTH, authData)
      
      // Update Redux state
      dispatch(loginSuccess(authData))
      
      // Show success toast
      dispatch(addToast({
        type: 'success',
        title: 'Welcome back!',
        message: `Logged in as ${user.name}`,
      }))
      
      // Navigate to dashboard
      navigate('/')
    } else {
      dispatch(loginFailure('Invalid credentials'))
      setErrors({ form: 'Invalid username or password' })
      
      dispatch(addToast({
        type: 'error',
        title: 'Login Failed',
        message: 'Invalid username or password',
      }))
    }
    
    setLoading(false)
  }

  // Demo accounts for quick login
  const demoAccounts = [
    { username: 'admin', password: 'admin123', role: 'Administrator' },
    { username: 'manager', password: 'manager123', role: 'Manager' },
    { username: 'cashier', password: 'cashier123', role: 'Cashier' },
    { username: 'auditor', password: 'auditor123', role: 'Auditor' },
  ]

  const handleDemoLogin = (account) => {
    setFormData({ username: account.username, password: account.password })
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          {/* Logo */}
          <div className="flex items-center gap-4 mb-12">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/30">
              <span className="text-2xl font-bold text-zinc-900">PS</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">PawnSys</h1>
              <p className="text-amber-500/80 text-sm">Pajak Kedai Management</p>
            </div>
          </div>

          {/* Tagline */}
          <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            Streamline Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
              Pawn Business
            </span>
          </h2>
          
          <p className="text-zinc-400 text-lg max-w-md mb-8">
            Complete pawn shop management system compliant with KPKT Malaysia regulations. 
            Manage pledges, customers, inventory, and auctions effortlessly.
          </p>

          {/* Features */}
          <div className="space-y-4">
            {[
              'KPKT Malaysia Compliant',
              'Real-time Gold Price Tracking',
              'Comprehensive Reporting',
              'Multi-branch Support',
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <svg className="w-3 h-3 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-zinc-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute top-20 right-20 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-stone-100">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg">
              <span className="text-xl font-bold text-zinc-900">PS</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-zinc-800">PawnSys</h1>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-zinc-200">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-zinc-800">Welcome Back</h2>
              <p className="text-zinc-500 mt-1">Sign in to your account</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Form Error */}
              {errors.form && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  {errors.form}
                </div>
              )}

              {/* Username */}
              <Input
                label="Username"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                error={errors.username}
                leftIcon={User}
                required
                autoComplete="username"
              />

              {/* Password */}
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                leftIcon={Lock}
                required
                autoComplete="current-password"
              />

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-zinc-300 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-sm text-zinc-600">Remember me</span>
                </label>
                <button type="button" className="text-sm text-amber-600 hover:text-amber-700 font-medium">
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="accent"
                size="lg"
                fullWidth
                loading={loading}
              >
                Sign In
              </Button>
            </form>

            {/* Demo Accounts */}
            <div className="mt-8 pt-6 border-t border-zinc-200">
              <p className="text-xs text-zinc-500 text-center mb-3">
                Demo Accounts (Click to autofill)
              </p>
              <div className="grid grid-cols-2 gap-2">
                {demoAccounts.map((account) => (
                  <button
                    key={account.username}
                    type="button"
                    onClick={() => handleDemoLogin(account)}
                    className={cn(
                      'px-3 py-2 rounded-lg border text-xs font-medium transition-all',
                      'border-zinc-200 hover:border-amber-300 hover:bg-amber-50',
                      formData.username === account.username && 'border-amber-400 bg-amber-50'
                    )}
                  >
                    <span className="text-zinc-700">{account.role}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-zinc-500 mt-6">
            © 2024 PawnSys. KPKT Malaysia Compliant System.
          </p>
        </div>
      </div>
    </div>
  )
}
