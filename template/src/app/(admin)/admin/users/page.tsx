"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useListUsers } from "./userQuery";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
}

function toTitle(name: string | undefined): string {
  if (!name) return "User"
  return name.slice(0, 1).toUpperCase() + name.slice(1)
}

function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export default function AdminUsersPage() {
  const [query, setQuery] = useState("");
  const listData = useListUsers()

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Users</CardTitle>
            <CardDescription>View and manage all users in your workspace.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="w-full min-w-[720px] table-auto">
              <TableHeader>
                <TableRow className="text-left text-sm text-muted-foreground">
                  <TableCell className="px-2 py-2 font-medium">User</TableCell>
                  <TableCell className="px-2 py-2 font-medium">Email</TableCell>
                  <TableCell className="px-2 py-2 font-medium">Role</TableCell>
                  <TableCell className="px-2 py-2 font-medium">Status</TableCell>
                  <TableCell className="px-2 py-2 font-medium">Created</TableCell>
                  <TableCell className="px-2 py-2 font-medium text-right">Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listData.users.map((user) => (
                  <TableRow key={user.id} className="border-t">
                    <TableCell className="px-2 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          {user.image ? (
                            <AvatarImage src={user.image} alt={user.name} />
                          ) : (
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                          )}
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium leading-none">{user.name}</span>
                          <span className="text-xs text-muted-foreground">{user.id}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-2 py-3 align-middle text-sm">{user.email}</TableCell>
                    <TableCell className="px-2 py-3 align-middle">
                      <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                        {toTitle(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-2 py-3 align-middle">
                      <Badge
                        variant={
                          user.banned ? "destructive" : "default"
                        }
                      >
                        {user.banned ? "Disabled" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-2 py-3 align-middle text-sm">{formatDate(user.createdAt)}</TableCell>
                    <TableCell className="px-2 py-3 align-middle text-right">
                      <div className="inline-flex gap-2">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                        <Button size="sm" variant="ghost">
                          More
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {listData.users.length === 0 && (
                  <TableRow className="border-t">
                    <TableCell className="px-2 py-8 text-center text-sm text-muted-foreground" colSpan={6}>
                      No users match your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
