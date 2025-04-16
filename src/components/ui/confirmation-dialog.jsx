import * as React from "react"
import * as AlertDialog from "@radix-ui/react-alert-dialog"
import { Trash2 } from "lucide-react"

export function ConfirmationDialog({ open, onOpenChange, onConfirm, title, description }) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/0 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <AlertDialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[400px] translate-x-[-50%] translate-y-[-50%] bg-white shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg p-6">
          <div className="flex flex-col items-center gap-6">
            <div className="rounded-full bg-red-100 p-3">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            
            <div className="flex flex-col gap-2 text-center">
              <AlertDialog.Title className="text-lg font-semibold text-gray-900">
                {title || "Are you sure?"}
              </AlertDialog.Title>
              <AlertDialog.Description className="text-sm text-gray-500">
                {description || "Do you really want to delete these records? This process cannot be undone."}
              </AlertDialog.Description>
            </div>

            <div className="flex w-full gap-3">
              <AlertDialog.Cancel asChild>
                <button className="flex-1 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">
                  Cancel
                </button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <button 
                  onClick={onConfirm}
                  className="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Delete
                </button>
              </AlertDialog.Action>
            </div>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
} 