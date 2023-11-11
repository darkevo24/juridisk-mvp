"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FileType2, Folder, MoreVertical, Trash } from "lucide-react"
import { formatFileSize } from "@/lib/utils"
import { format } from "date-fns"
import { useState, useTransition } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import bulkDelete, { S3Response, deleteFolder, deleteObject } from "../_actions"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePathname } from "next/navigation"
import { useUser } from "@clerk/nextjs"

export const columns: ColumnDef<S3Response>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "Key",
    header: "Name",
    cell: ({ row }) => {
      const { user } = useUser()
      const type: string = row.getValue("StorageClass")
      const title: string = row.getValue("Key")
      const { OriginalKey } = row.original
      return (
        <div className="flex gap-3 items-center">
          <div className="p-2 w-fit rounded-md bg-blue-500/10">
            {type === "DIRECTORY" ? (
              <Folder className="w-5 h-5 text-blue-500" />
            ) : (
              <FileType2 className="w-5 h-5 text-blue-500" />
            )}
          </div>
          {type === "DIRECTORY" ? (
            <Button
              className="font-bold text-neutral-700 px-0"
              asChild
              variant={"link"}
            >
              <Link
                href={OriginalKey!.replace(
                  user?.emailAddresses[0].emailAddress ?? "",
                  "/files"
                )}
              >
                {title}
              </Link>
            </Button>
          ) : (
            <span className="font-bold text-neutral-700">{title}</span>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "Size",
    header: "Size",
    cell: ({ row }) => {
      const size: number = row.getValue("Size")
      const type: string = row.getValue("StorageClass")
      const showSize = formatFileSize(size)
      return (
        <div className="text-neutral-400 font-bold">
          {type === "DIRECTORY" ? <>&mdash;</> : showSize}
        </div>
      )
    },
  },
  {
    accessorKey: "LastModified",
    header: "Last Modified",
    cell: ({ row }) => {
      const date: Date = row.getValue("LastModified")
      const showDate = format(date, "PPPp")
      return <div className="text-neutral-400 font-bold">{showDate}</div>
    },
  },
  {
    accessorKey: "StorageClass",
    header: "Content Type",
    cell: ({ row }) => {
      const type: string = row.getValue("StorageClass")
      const showText = type === "DIRECTORY" ? "FOLDER" : "FILE"
      return <div className="text-neutral-400 font-bold">{showText}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { OriginalKey, StorageClass } = row.original
      const pathname = usePathname()
      const [deletePending, startDeleteTransition] = useTransition()
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              {deletePending ? (
                <div className="w-6 h-6 border-[3px] border-gray-200 rounded-full border-t-current animate-spin"></div>
              ) : (
                <MoreVertical className="h-4 w-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Rename</DropdownMenuItem>
            <DropdownMenuItem>Move</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                startDeleteTransition(async () => {
                  if (StorageClass === "DIRECTORY")
                    await deleteFolder(OriginalKey!, pathname)
                  else await deleteObject(OriginalKey!, pathname)
                })
              }
              className="text-red-700 hover:!text-red-700 hover:!bg-red-700/10"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function FilesDataTable({ data }: { data: S3Response[] }) {
  const [rowSelection, setRowSelection] = useState({})
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  })
  const [isPending, startTransition] = useTransition()
  const pathname = usePathname()
  const selectedRows = table.getSelectedRowModel().rows

  return (
    <>
      {!!selectedRows.length && (
        <Button
          onClick={() =>
            startTransition(async () => {
              await bulkDelete(
                [...selectedRows.map((row) => row.original)],
                pathname
              )
            })
          }
          variant={isPending ? "outline" : "destructive"}
          className="w-fit"
        >
          {isPending ? (
            <>
              <div className="w-6 h-6 border-[3px] border-gray-200 rounded-full border-t-current animate-spin"></div>
              <span className="ml-2">Deleting...</span>
            </>
          ) : (
            <>
              <Trash className="w-5 h-5 mr-2" />
              Delete Selected Rows
            </>
          )}
        </Button>
      )}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="h-16 font-bold">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No files or folders to show.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
