import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-dark-950 text-white">
          <div className="glass-card p-8 max-w-2xl">
            <h1 className="text-2xl font-bold text-red-400 mb-4">Something went wrong</h1>
            <p className="text-gray-300 mb-4">
              The application encountered an error and cannot display content.
            </p>
            <div className="bg-white/5 p-4 rounded-lg overflow-auto">
              <pre className="text-sm text-red-300 whitespace-pre-wrap">
                {this.state.error?.toString()}
                {this.state.error?.stack}
              </pre>
            </div>
            <p className="text-gray-400 text-sm mt-4">
              Please open the browser console (F12) for more details and report this issue.
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
