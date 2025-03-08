"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function VendorDetailView({ vendor }) {
  if (!vendor) return null;

  return (
    <Tabs defaultValue="basic">
      <TabsList className="mb-4">
        <TabsTrigger value="basic">Basic Info</TabsTrigger>
        <TabsTrigger value="contact">Contact</TabsTrigger>
        <TabsTrigger value="items">Supplied Items</TabsTrigger>
        <TabsTrigger value="transactions">Transactions</TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Vendor ID:
                </dt>
                <dd className="text-sm font-medium">{vendor.id}</dd>
              </div>
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Name:
                </dt>
                <dd className="text-sm font-medium">{vendor.name}</dd>
              </div>
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Category:
                </dt>
                <dd className="text-sm font-medium">{vendor.category}</dd>
              </div>
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Status:
                </dt>
                <dd className="text-sm font-medium">
                  <Badge
                    variant={
                      vendor.status === "Active" ? "outline" : "secondary"
                    }
                  >
                    {vendor.status}
                  </Badge>
                </dd>
              </div>
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Registration Date:
                </dt>
                <dd className="text-sm font-medium">
                  {vendor.registrationDate}
                </dd>
              </div>
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Tax ID:
                </dt>
                <dd className="text-sm font-medium">{vendor.taxId || "N/A"}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Accreditation</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Accreditation Date:
                </dt>
                <dd className="text-sm font-medium">
                  {vendor.accreditationDate || "N/A"}
                </dd>
              </div>
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Expiry Date:
                </dt>
                <dd className="text-sm font-medium">
                  {vendor.accreditationExpiry || "N/A"}
                </dd>
              </div>
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Accreditation Level:
                </dt>
                <dd className="text-sm font-medium">
                  {vendor.accreditationLevel || "N/A"}
                </dd>
              </div>
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Accreditation Number:
                </dt>
                <dd className="text-sm font-medium">
                  {vendor.accreditationNumber || "N/A"}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="contact" className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Contact Person:
                </dt>
                <dd className="text-sm font-medium">{vendor.contactPerson}</dd>
              </div>
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Position:
                </dt>
                <dd className="text-sm font-medium">
                  {vendor.position || "N/A"}
                </dd>
              </div>
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Phone:
                </dt>
                <dd className="text-sm font-medium">{vendor.phone}</dd>
              </div>
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Email:
                </dt>
                <dd className="text-sm font-medium">{vendor.email}</dd>
              </div>
              <div className="col-span-1 sm:col-span-2">
                <dt className="text-sm font-medium text-muted-foreground">
                  Address:
                </dt>
                <dd className="text-sm">{vendor.address}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Additional Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {vendor.additionalContacts &&
            vendor.additionalContacts.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendor.additionalContacts.map((contact, index) => (
                    <TableRow key={index}>
                      <TableCell>{contact.name}</TableCell>
                      <TableCell>{contact.position}</TableCell>
                      <TableCell>{contact.phone}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground">
                No additional contacts available
              </p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="items" className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Supplied Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            {vendor.suppliedItems && vendor.suppliedItems.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item ID</TableHead>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">
                      Last Supply Date
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendor.suppliedItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="text-right">
                        {item.lastSupplyDate}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground">
                No items supplied by this vendor
              </p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="transactions" className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Purchase Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            {vendor.purchaseOrders && vendor.purchaseOrders.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PO Number</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount (₱)</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendor.purchaseOrders.map((po, index) => (
                    <TableRow key={index}>
                      <TableCell>{po.poNumber}</TableCell>
                      <TableCell>{po.date}</TableCell>
                      <TableCell className="text-right">
                        {po.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            po.status === "Completed" ? "outline" : "secondary"
                          }
                        >
                          {po.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground">
                No purchase orders available
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Payment History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {vendor.paymentHistory && vendor.paymentHistory.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount (₱)</TableHead>
                    <TableHead>Method</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendor.paymentHistory.map((payment, index) => (
                    <TableRow key={index}>
                      <TableCell>{payment.reference}</TableCell>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell className="text-right">
                        {payment.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>{payment.method}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground">
                No payment history available
              </p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
