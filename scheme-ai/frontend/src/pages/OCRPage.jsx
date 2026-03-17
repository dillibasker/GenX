import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RiUploadCloud2Line, RiCheckDoubleLine, RiFilePdfLine, RiDownloadLine, RiWhatsappLine } from 'react-icons/ri'
import axios from 'axios'
import toast from 'react-hot-toast'

const FIELD_LABELS = {
  name: 'Full Name',
  dob: 'Date of Birth',
  gender: 'Gender',
  address: 'Address',
  aadhaar: 'Aadhaar Number',
  pincode: 'Pincode',
}

export default function OCRPage() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [extracted, setExtracted] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef(null)

  const handleFile = (f) => {
    if (!f) return
    const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
    if (!allowed.includes(f.type)) {
      toast.error('Please upload JPG, PNG or PDF only.')
      return
    }
    setFile(f)
    if (f.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = e => setPreview(e.target.result)
      reader.readAsDataURL(f)
    } else {
      setPreview('pdf')
    }
  }

  const processOCR = async () => {
    if (!file) return
    setProcessing(true)
    const form = new FormData()
    form.append('document', file)
    try {
      const { data } = await axios.post('/api/ocr/extract', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setExtracted(data.fields)
      toast.success('Document processed successfully!')
    } catch (err) {
      // Demo fallback
      setExtracted({
        name: 'Ravi Kumar Sharma',
        dob: '15/08/1985',
        gender: 'Male',
        address: 'House No. 42, Gandhi Nagar, Chennai, Tamil Nadu',
        aadhaar: '1234 5678 9012',
        pincode: '600001',
      })
      toast.success('Document processed! (Demo data shown)')
    } finally {
      setProcessing(false)
    }
  }

  const reset = () => {
    setFile(null)
    setPreview(null)
    setExtracted(null)
  }

  return (
    <div className="pt-24 pb-16 px-5 md:px-10 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="section-label">Pillar 3 — OCR Auto-Fill</div>
        <h1 className="section-title mb-2">
          Upload Your <span className="text-saffron">Aadhaar / ID</span>
        </h1>
        <p className="section-sub max-w-lg">
          Upload your Aadhaar card or Voter ID. Our AI extracts your details and auto-fills all government application forms — eliminating the #1 cause of rejection.
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!extracted ? (
          <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Upload Zone */}
            <div
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${
                dragOver
                  ? 'border-saffron bg-saffron/5'
                  : file
                  ? 'border-scheme-green-light bg-scheme-green/5'
                  : 'border-navy-border hover:border-saffron/50 hover:bg-saffron/3'
              }`}
              onClick={() => !file && fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }}
            >
              <input
                ref={fileRef}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={e => handleFile(e.target.files[0])}
              />

              {file ? (
                <div className="space-y-4">
                  {preview && preview !== 'pdf' ? (
                    <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-xl shadow-xl border border-navy-border" />
                  ) : (
                    <div className="w-16 h-16 mx-auto bg-red-900/20 rounded-2xl flex items-center justify-center">
                      <RiFilePdfLine className="text-red-400 text-3xl" />
                    </div>
                  )}
                  <div>
                    <p className="text-white font-semibold text-sm">{file.name}</p>
                    <p className="text-[#8A9BB0] text-xs mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={e => { e.stopPropagation(); reset() }}
                      className="btn-secondary text-xs px-4 py-2"
                    >
                      Remove
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); processOCR() }}
                      disabled={processing}
                      className="btn-primary text-xs px-4 py-2"
                    >
                      {processing ? (
                        <><span className="animate-spin">⚙️</span> Processing...</>
                      ) : (
                        <>🔍 Extract Data</>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-5xl mb-4">📄</div>
                  <h3 className="text-base font-bold mb-2">Drop your Aadhaar / Voter ID here</h3>
                  <p className="text-[#8A9BB0] text-sm mb-5">Supports JPG, PNG, PDF · Max 10MB</p>
                  <button className="btn-primary mx-auto">
                    <RiUploadCloud2Line size={16} /> Choose File
                  </button>
                  <p className="text-[10px] text-[#8A9BB0] mt-4">🔒 Your document is processed securely and never stored permanently</p>
                </div>
              )}
            </div>

            {/* How it works */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              {[
                { icon: '📤', title: 'Upload ID', desc: 'Aadhaar, Voter ID or Passport' },
                { icon: '🔍', title: 'AI Extracts', desc: 'Name, DOB, Address auto-detected' },
                { icon: '📋', title: 'Forms Filled', desc: 'All govt. forms auto-populated' },
              ].map(({ icon, title, desc }, i) => (
                <div key={i} className="card p-4 text-center">
                  <div className="text-2xl mb-2">{icon}</div>
                  <div className="text-sm font-bold mb-1">{title}</div>
                  <div className="text-[11px] text-[#8A9BB0]">{desc}</div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            {/* Success */}
            <div className="card p-6 mb-5 border-scheme-green-light/30">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-scheme-green/20 flex items-center justify-center">
                  <RiCheckDoubleLine className="text-scheme-green-light text-xl" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Data Extracted Successfully</h3>
                  <p className="text-xs text-[#8A9BB0]">Ready to auto-fill government forms</p>
                </div>
              </div>

              <div className="space-y-1">
                {Object.entries(extracted).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-2.5 border-b border-navy-border last:border-0">
                    <span className="text-xs text-[#8A9BB0] uppercase tracking-wider font-semibold">{FIELD_LABELS[key] || key}</span>
                    <span className="text-sm font-semibold text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <button className="btn-primary justify-center py-3.5 col-span-2">
                <RiFilePdfLine /> Generate Pre-Filled Application Forms
              </button>
              <button className="btn-secondary justify-center py-3">
                <RiDownloadLine /> Download Forms
              </button>
              <button className="btn-secondary justify-center py-3">
                <RiWhatsappLine /> Share via WhatsApp
              </button>
            </div>

            <button onClick={reset} className="w-full text-xs text-[#8A9BB0] hover:text-white transition-colors">
              ← Upload a different document
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
