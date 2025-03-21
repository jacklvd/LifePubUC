// components/ui/ticket-ui/sidebar-content.tsx
import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const SidebarContent: React.FC = () => {
    return (
        <div className="space-y-4">
            <Card>
                <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">Quick tips</h3>
                    <ul className="text-sm space-y-2">
                        <li>• Create different ticket types (Free, Paid, Donation)</li>
                        <li>• Set limits on tickets per order</li>
                        <li>• Add promotional tickets for special groups</li>
                    </ul>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">Need help?</h3>
                    <p className="text-sm">
                        Check out our guides on creating and managing tickets for your event.
                    </p>
                    <Button variant="link" className="text-blue-600 text-sm p-0 mt-2">
                        View guides
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}

export default SidebarContent