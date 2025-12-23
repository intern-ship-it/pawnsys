import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { setPledges } from '@/features/pledges/pledgesSlice'
import { addToast } from '@/features/ui/uiSlice'
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '@/utils/localStorage'
import { formatCurrency, formatDate, formatIC } from '@/utils/formatters'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import PageWrapper from '@/components/layout/PageWrapper'
import { Card, Button, Input, Select, Badge, Modal } from '@/components/common'
import {
  Package,
  Search,
  Filter,
  MapPin,
  Scale,
  Gem,
  QrCode,
  Eye,
  Edit,
  CheckCircle,
  AlertTriangle,
  Clock,
  Download,
  Printer,
  Grid3X3,
  List,
  Camera,
  X,
  Save,
  Box,
  Layers,
} from 'lucide-react'

// Purity labels
const purityLabels = {
  '999': '999 (24K)',
  '916': '916 (22K)',
  '875': '875 (21K)',
  '750': '750 (18K)',
}

// Status config
const statusConfig = {
  active: { label: 'In Storage', variant: 'success', icon: CheckCircle },
  overdue: { label: 'Overdue', variant: 'error', icon: AlertTriangle },
  redeemed: { label: 'Released', variant: 'info', icon: Package },
}

export default function InventoryList() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { pledges } = useAppSelector((state) => state.pledges)

  // State
  const [searchQuery, setSearchQuery] = useState('')
  const [purityFilter, setPurityFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('active')
  const [viewMode, setViewMode] = useState('table') // 'table' or 'grid'

  // Modal state
  const [showRackModal, setShowRackModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [rackLocation, setRackLocation] = useState('')
  const [showImageModal, setShowImageModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)

  // Load pledges on mount
  useEffect(() => {
    const storedPledges = getStorageItem(STORAGE_KEYS.PLEDGES, [])
    dispatch(setPledges(storedPledges))
  }, [dispatch])

  // Flatten all items from pledges
  const allItems = pledges.flatMap(pledge =>
    (pledge.items || []).map(item => ({
      ...item,
      pledgeId: pledge.id,
      pledgeStatus: pledge.status,
      customerName: pledge.customerName,
      customerIC: pledge.customerIC,
      createdAt: pledge.createdAt,
      dueDate: pledge.dueDate,
      rackLocation: pledge.rackLocation,
    }))
  )

  // Get unique categories
  const categories = [...new Set(allItems.map(item => item.category).filter(Boolean))]

  // Filter items
  const filteredItems = allItems.filter(item => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchBarcode = item.barcode?.toLowerCase().includes(query)
      const matchPledge = item.pledgeId?.toLowerCase().includes(query)
      const matchCustomer = item.customerName?.toLowerCase().includes(query)
      const matchCategory = item.category?.toLowerCase().includes(query)
      const matchRack = item.rackLocation?.toLowerCase().includes(query)
      if (!matchBarcode && !matchPledge && !matchCustomer && !matchCategory && !matchRack) return false
    }

    // Purity filter
    if (purityFilter !== 'all' && item.purity !== purityFilter) return false

    // Category filter
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false

    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'active' && item.pledgeStatus !== 'active' && item.pledgeStatus !== 'overdue') return false
      if (statusFilter === 'overdue' && item.pledgeStatus !== 'overdue') return false
      if (statusFilter === 'redeemed' && item.pledgeStatus !== 'redeemed') return false
    }

    return true
  })

  // Calculate stats
  const stats = {
    totalItems: allItems.filter(i => i.pledgeStatus === 'active' || i.pledgeStatus === 'overdue').length,
    totalWeight: allItems
      .filter(i => i.pledgeStatus === 'active' || i.pledgeStatus === 'overdue')
      .reduce((sum, i) => sum + (parseFloat(i.weight) || 0), 0),
    totalValue: allItems
      .filter(i => i.pledgeStatus === 'active' || i.pledgeStatus === 'overdue')
      .reduce((sum, i) => sum + (i.netValue || 0), 0),
    noLocation: allItems.filter(i =>
      (i.pledgeStatus === 'active' || i.pledgeStatus === 'overdue') && !i.rackLocation
    ).length,
  }

  // Save rack location
  const handleSaveRack = () => {
    if (!selectedItem) return

    const storedPledges = getStorageItem(STORAGE_KEYS.PLEDGES, [])
    const updatedPledges = storedPledges.map(pledge => {
      if (pledge.id === selectedItem.pledgeId) {
        return { ...pledge, rackLocation }
      }
      return pledge
    })

    setStorageItem(STORAGE_KEYS.PLEDGES, updatedPledges)
    dispatch(setPledges(updatedPledges))
    setShowRackModal(false)
    setSelectedItem(null)
    setRackLocation('')

    dispatch(addToast({
      type: 'success',
      title: 'Saved',
      message: `Location updated to ${rackLocation}`,
    }))
  }

  // Open rack modal
  const openRackModal = (item) => {
    setSelectedItem(item)
    setRackLocation(item.rackLocation || '')
    setShowRackModal(true)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <PageWrapper
      title="Inventory"
      subtitle="Track all pledged items in storage"
      actions={
        <div className="flex items-center gap-3">
          <Button variant="outline" leftIcon={Download}>
            Export
          </Button>
          <Button variant="outline" leftIcon={Printer}>
            Print Labels
          </Button>
        </div>
      }
    >
      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Package className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">Total Items</p>
                <p className="text-xl font-bold text-zinc-800">{stats.totalItems}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Scale className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">Total Weight</p>
                <p className="text-xl font-bold text-zinc-800">{stats.totalWeight.toFixed(2)}g</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Gem className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">Total Value</p>
                <p className="text-xl font-bold text-emerald-600">{formatCurrency(stats.totalValue)}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                stats.noLocation > 0 ? "bg-red-100" : "bg-zinc-100"
              )}>
                <MapPin className={cn(
                  "w-5 h-5",
                  stats.noLocation > 0 ? "text-red-600" : "text-zinc-600"
                )} />
              </div>
              <div>
                <p className="text-sm text-zinc-500">No Location</p>
                <p className={cn(
                  "text-xl font-bold",
                  stats.noLocation > 0 ? "text-red-600" : "text-zinc-800"
                )}>
                  {stats.noLocation}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <Input
              placeholder="Search by barcode, pledge ID, customer, category, or rack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={Search}
            />
          </div>

          {/* Purity Filter */}
          <Select
            value={purityFilter}
            onChange={(e) => setPurityFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Purity' },
              { value: '999', label: '999 (24K)' },
              { value: '916', label: '916 (22K)' },
              { value: '875', label: '875 (21K)' },
              { value: '750', label: '750 (18K)' },
            ]}
            className="w-36"
          />

          {/* Category Filter */}
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Categories' },
              ...categories.map(c => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }))
            ]}
            className="w-40"
          />

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'active', label: 'In Storage' },
              { value: 'overdue', label: 'Overdue' },
              { value: 'redeemed', label: 'Released' },
            ]}
            className="w-36"
          />

          {/* View Toggle */}
          <div className="flex border border-zinc-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('table')}
              className={cn(
                'p-2 transition-colors',
                viewMode === 'table' ? 'bg-zinc-800 text-white' : 'bg-white text-zinc-600 hover:bg-zinc-50'
              )}
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 transition-colors',
                viewMode === 'grid' ? 'bg-zinc-800 text-white' : 'bg-white text-zinc-600 hover:bg-zinc-50'
              )}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Card>

      {/* Items Display */}
      <AnimatePresence mode="wait">
        {viewMode === 'table' ? (
          /* Table View */
          <motion.div
            key="table"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50">
                      <th className="text-left p-4 text-sm font-semibold text-zinc-600">Barcode</th>
                      <th className="text-left p-4 text-sm font-semibold text-zinc-600">Item</th>
                      <th className="text-left p-4 text-sm font-semibold text-zinc-600">Purity</th>
                      <th className="text-right p-4 text-sm font-semibold text-zinc-600">Weight</th>
                      <th className="text-right p-4 text-sm font-semibold text-zinc-600">Value</th>
                      <th className="text-left p-4 text-sm font-semibold text-zinc-600">Customer</th>
                      <th className="text-left p-4 text-sm font-semibold text-zinc-600">Location</th>
                      <th className="text-left p-4 text-sm font-semibold text-zinc-600">Status</th>
                      <th className="text-center p-4 text-sm font-semibold text-zinc-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="p-8 text-center">
                          <Box className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
                          <p className="text-zinc-500">No items found</p>
                        </td>
                      </tr>
                    ) : (
                      filteredItems.map((item, index) => {
                        const status = statusConfig[item.pledgeStatus] || statusConfig.active
                        const StatusIcon = status.icon

                        return (
                          <motion.tr
                            key={item.barcode || index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors"
                          >
                            {/* Barcode */}
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <QrCode className="w-4 h-4 text-zinc-400" />
                                <span className="font-mono text-sm">{item.barcode}</span>
                              </div>
                            </td>

                            {/* Item */}
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                {item.photo ? (
                                  <img
                                    src={item.photo}
                                    alt={item.category}
                                    className="w-10 h-10 object-cover rounded-lg cursor-pointer hover:opacity-80"
                                    onClick={() => {
                                      setSelectedImage(item.photo)
                                      setShowImageModal(true)
                                    }}
                                  />
                                ) : (
                                  <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center">
                                    <Package className="w-5 h-5 text-zinc-400" />
                                  </div>
                                )}
                                <div>
                                  <p className="font-medium text-zinc-800 capitalize">{item.category}</p>
                                  <p className="text-xs text-zinc-500">{item.description || '-'}</p>
                                </div>
                              </div>
                            </td>

                            {/* Purity */}
                            <td className="p-4">
                              <Badge variant="outline">{purityLabels[item.purity] || item.purity}</Badge>
                            </td>

                            {/* Weight */}
                            <td className="p-4 text-right">
                              <span className="font-medium">{parseFloat(item.weight).toFixed(2)}g</span>
                            </td>

                            {/* Value */}
                            <td className="p-4 text-right">
                              <span className="font-semibold text-emerald-600">{formatCurrency(item.netValue)}</span>
                            </td>

                            {/* Customer */}
                            <td className="p-4">
                              <p className="text-sm text-zinc-800">{item.customerName}</p>
                              <p className="text-xs text-zinc-500 font-mono">{item.pledgeId}</p>
                            </td>

                            {/* Location */}
                            <td className="p-4">
                              {item.rackLocation ? (
                                <div className="flex items-center gap-1 text-sm">
                                  <MapPin className="w-4 h-4 text-blue-500" />
                                  <span className="font-medium text-blue-600">{item.rackLocation}</span>
                                </div>
                              ) : (
                                <span className="text-red-500 text-sm">Not assigned</span>
                              )}
                            </td>

                            {/* Status */}
                            <td className="p-4">
                              <Badge variant={status.variant}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {status.label}
                              </Badge>
                            </td>

                            {/* Actions */}
                            <td className="p-4">
                              <div className="flex items-center justify-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  onClick={() => navigate(`/pledges/${item.pledgeId}`)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                {(item.pledgeStatus === 'active' || item.pledgeStatus === 'overdue') && (
                                  <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    onClick={() => openRackModal(item)}
                                  >
                                    <MapPin className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </td>
                          </motion.tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {filteredItems.length > 0 && (
                <div className="p-4 border-t border-zinc-200">
                  <p className="text-sm text-zinc-500">
                    Showing {filteredItems.length} items
                  </p>
                </div>
              )}
            </Card>
          </motion.div>
        ) : (
          /* Grid View */
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {filteredItems.length === 0 ? (
              <Card className="col-span-full p-12 text-center">
                <Box className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
                <p className="text-zinc-500">No items found</p>
              </Card>
            ) : (
              filteredItems.map((item, index) => {
                const status = statusConfig[item.pledgeStatus] || statusConfig.active

                return (
                  <motion.div
                    key={item.barcode || index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                      {/* Image */}
                      <div className="aspect-square bg-zinc-100 relative">
                        {item.photo ? (
                          <img
                            src={item.photo}
                            alt={item.category}
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => {
                              setSelectedImage(item.photo)
                              setShowImageModal(true)
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-12 h-12 text-zinc-300" />
                          </div>
                        )}
                        <Badge
                          variant={status.variant}
                          className="absolute top-2 right-2"
                        >
                          {status.label}
                        </Badge>
                      </div>

                      {/* Details */}
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-zinc-800 capitalize">{item.category}</span>
                          <Badge variant="outline" className="text-xs">{item.purity}</Badge>
                        </div>

                        <p className="text-xs text-zinc-500 font-mono mb-2">{item.barcode}</p>

                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-zinc-500">{parseFloat(item.weight).toFixed(2)}g</span>
                          <span className="font-semibold text-emerald-600">{formatCurrency(item.netValue)}</span>
                        </div>

                        {item.rackLocation ? (
                          <div className="flex items-center gap-1 text-xs text-blue-600">
                            <MapPin className="w-3 h-3" />
                            {item.rackLocation}
                          </div>
                        ) : (
                          <p className="text-xs text-red-500">No location</p>
                        )}

                        <div className="flex gap-2 mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            fullWidth
                            onClick={() => navigate(`/pledges/${item.pledgeId}`)}
                          >
                            View
                          </Button>
                          {(item.pledgeStatus === 'active' || item.pledgeStatus === 'overdue') && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openRackModal(item)}
                            >
                              <MapPin className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rack Location Modal */}
      <Modal
        isOpen={showRackModal}
        onClose={() => setShowRackModal(false)}
        title="Set Storage Location"
        size="sm"
      >
        <div className="p-5">
          {selectedItem && (
            <div className="mb-4 p-3 bg-zinc-50 rounded-lg">
              <p className="text-sm text-zinc-500">Item</p>
              <p className="font-medium capitalize">{selectedItem.category} - {selectedItem.purity}</p>
              <p className="text-xs text-zinc-400 font-mono">{selectedItem.barcode}</p>
            </div>
          )}

          <Input
            label="Rack / Shelf Location"
            placeholder="e.g., A1-S3, Rack B Row 2"
            value={rackLocation}
            onChange={(e) => setRackLocation(e.target.value)}
            leftIcon={MapPin}
          />

          <div className="flex gap-3 mt-4">
            <Button variant="outline" fullWidth onClick={() => setShowRackModal(false)}>
              Cancel
            </Button>
            <Button variant="accent" fullWidth leftIcon={Save} onClick={handleSaveRack}>
              Save Location
            </Button>
          </div>
        </div>
      </Modal>

      {/* Image Modal */}
      <Modal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        title="Item Photo"
        size="lg"
      >
        <div className="p-4">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Item"
              className="w-full max-h-[70vh] object-contain rounded-lg"
            />
          )}
        </div>
      </Modal>
    </PageWrapper>
  )
}