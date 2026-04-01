import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  isLoading: boolean
  error?: string
}

export default function FileUpload({ onFileSelect, isLoading, error }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0])
    }
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    multiple: false
  })

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div
        {...getRootProps()}
        className={`
          relative cursor-pointer transition-all duration-300
          glass-card p-12 text-center
          ${isDragActive ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-dark-950 scale-[1.02]' : ''}
          ${isLoading ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input {...getInputProps()} />

        <input type="file" {...getInputProps()} />

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-cyan-400 font-medium">Analyzing your CV...</p>
              <p className="text-gray-400 text-sm">This may take a few seconds</p>
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6"
            >
              <div className={`
                w-24 h-24 rounded-full flex items-center justify-center
                transition-all duration-300
                ${isDragActive ? 'bg-cyan-500/20 scale-110' : 'bg-gradient-to-br from-cyan-500/20 to-purple-500/20'}
              `}>
                <Upload className={`w-10 h-10 transition-colors ${isDragActive ? 'text-cyan-400' : 'text-gray-300'}`} />
              </div>

              <div className="space-y-2">
                <p className="text-xl font-semibold text-white">
                  {isDragActive ? 'Drop your CV here' : 'Upload Your CV'}
                </p>
                <p className="text-gray-400">
                  Drag & drop your PDF, DOCX, or TXT file
                </p>
                <p className="text-sm text-gray-500">
                  or click to browse
                </p>
              </div>

              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <FileText className="w-4 h-4" />
                <span>Max file size: 10MB</span>
              </div>

              <div className="flex gap-2 flex-wrap justify-center">
                {['.pdf', '.docx', '.txt'].map(ext => (
                  <span
                    key={ext}
                    className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400"
                  >
                    {ext}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-0 left-0 right-0 bg-red-500/20 border-t border-red-500/50 p-4 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
