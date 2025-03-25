import React, { ErrorInfo, Component, ReactNode } from 'react'

interface Props {
    children: ReactNode
    fallback?: ReactNode
}

interface State {
    hasError: boolean
    error?: Error
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('Error caught by boundary:', error, errorInfo)
    }

    render(): ReactNode {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="p-4 bg-red-50 text-red-800 rounded">
                    <h3 className="font-bold">Something went wrong</h3>
                    <p>Please try refreshing the page</p>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary