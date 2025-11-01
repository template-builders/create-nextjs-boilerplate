"use client";

import {useEffect, useCallback, useState} from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CreditCard,
  Calendar,
  Settings,
  XCircle,
  RotateCcw,
  Clock,
  AlertCircle,
  CheckCircle,
  Users,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { UserWithRole } from "better-auth/plugins";
import { Subscription } from "@better-auth/stripe";
import { authClient } from "@/lib/auth-client";

type ActionTypes = "modify" | "extend" | "reactivate" | "seats";
type PlanTypes = "basic" | "plus" | "pro";

interface ManageSubscriptionProps {
  user: UserWithRole;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled?: boolean;
  hideTrigger?: boolean;
  onSubscriptionUpdated?: () => void;
}

function formatDate(date: Date | string | undefined): string {
  if (!date) return "N/A";

  const dateObj = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(dateObj.getTime())) return "N/A";

  return dateObj.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function formatPlanName(plan: string): string {
  return plan.slice(0, 1).toUpperCase() + plan.slice(1);
}

function getStatusBadge(status: Subscription["status"]) {
  switch (status) {
    case "active":
      return { label: "Active", variant: "default" as const, icon: CheckCircle };
    case "canceled":
      return {
        label: "Canceled",
        variant: "destructive" as const,
        icon: XCircle,
      };
    case "past_due":
      return {
        label: "Past Due",
        variant: "destructive" as const,
        icon: AlertCircle,
      };
    case "unpaid":
      return {
        label: "Unpaid",
        variant: "destructive" as const,
        icon: XCircle,
      };
    case "trialing":
      return {
        label: "Trial",
        variant: "secondary" as const,
        icon: Clock,
      };
    case "incomplete":
    case "incomplete_expired":
      return {
        label: "Incomplete",
        variant: "secondary" as const,
        icon: AlertCircle,
      };
    case "paused":
      return {
        label: "Paused",
        variant: "secondary" as const,
        icon: Clock,
      };
    default:
      return {
        label: "Unknown",
        variant: "outline" as const,
        icon: AlertCircle,
      };
  }
}

export function ManageSubscription({
  user,
  open,
  onOpenChange,
  disabled = false,
  hideTrigger = false,
  onSubscriptionUpdated,
}: ManageSubscriptionProps) {
  const [subscription, setSubscription] = useState<Subscription | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [extendMonths, setExtendMonths] = useState<string>("1");
  const [seats, setSeats] = useState<string>("1");
  const [actionType, setActionType] = useState<ActionTypes | null>(null);

  const resetInteractiveState = useCallback(() => {
    setActionType(null);
    setExtendMonths("1");
  }, []);

  const fetchSubscription = useCallback(async () => {
    setIsLoading(true);
    try {
      await authClient.subscription.list({
        query: {
          referenceId: user.id,
        },
        fetchOptions: {
          onSuccess: (ctx) => {
            const nextSubscription = ctx.data?.[0] ?? null;
            setSubscription(nextSubscription);
            if (nextSubscription) {
              setSelectedPlan(nextSubscription.plan);
              setSeats(nextSubscription.seats?.toString() || "1");
            } else {
              setSelectedPlan("");
              setSeats("1");
            }
          },
          onError: (ctx) => {
            toast.error(
              ctx.error.message || "Failed to get user subscription",
            );
            setSubscription(null);
          },
        },
      });
    } catch (error) {
      toast.error("Failed to get user subscription");
      setSubscription(null);
    } finally {
      setIsLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    if (!open) {
      setSubscription(null);
      setSelectedPlan("");
      setSeats("1");
      resetInteractiveState();
      return;
    }

    fetchSubscription();
  }, [open, fetchSubscription, resetInteractiveState]);

  const availablePlans: PlanTypes[] = ["basic", "plus", "pro"];
  const otherPlans = subscription ? availablePlans.filter((plan) => plan !== subscription.plan) : availablePlans;

  const statusInfo = subscription ? getStatusBadge(subscription.status) : null;
  const StatusIcon = statusInfo?.icon || AlertCircle;

  const handleAction = useCallback(
    async (action: ActionTypes): Promise<boolean> => {
      if (disabled) return false;

      const payload: Record<string, unknown> = {
        ...subscription,
        action,
      };

      if (action === "modify") {
        if (!selectedPlan) {
          toast.error("Select a plan before modifying.");
          return false;
        }
        payload.plan = selectedPlan;
      }

      if (action === "extend") {
        const monthsValue = Number.parseInt(extendMonths, 10);
        if (Number.isNaN(monthsValue) || monthsValue <= 0) {
          toast.error("Enter a valid number of months.");
          return false;
        }
        payload.months = monthsValue;
      }

      if (action === "seats") {
        const seatsValue = Number.parseInt(seats, 10);
        if (Number.isNaN(seatsValue) || seatsValue <= 0) {
          toast.error("Enter a valid number of seats.");
          return false;
        }
        payload.seats = seatsValue;
      }

      if (action !== "modify" && action !== "seats" && subscription?.plan && !payload.plan) payload.plan = subscription.plan;

      setIsLoading(true);
      try {
        const response = await fetch("/api/admin/subscription", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorText = await response.json();
          throw new Error(errorText.message || "Failed to update subscription.");
        }

        toast.success("Subscription updated.");
        resetInteractiveState();
        await fetchSubscription();
        onSubscriptionUpdated?.();
        return true;
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to update subscription.",
        );
        return false;
      } finally {
        setIsLoading(false);
      }
    },[disabled, extendMonths, fetchSubscription, onSubscriptionUpdated, resetInteractiveState, seats, selectedPlan, subscription, user,]
  );

  const handleSheetToggle = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        resetInteractiveState();
      }
      onOpenChange(nextOpen);
    },
    [onOpenChange, resetInteractiveState],
  );

  return (
    <Sheet open={open} onOpenChange={handleSheetToggle}>
      {!hideTrigger && (
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" disabled={isLoading || disabled}>
            <CreditCard className="h-4 w-4 mr-1" />
            Subscription
          </Button>
        </SheetTrigger>
      )}
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto px-3">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Subscription Management
          </SheetTitle>
          <SheetDescription>
            Manage subscription for {user.name || user.email}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {isLoading && !subscription ? (
            <div className="flex items-center justify-center gap-2 py-20 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading subscription details...
            </div>
          ) : subscription ? (
            <>
              <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {formatPlanName(subscription.plan)} Plan
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Subscription ID: {subscription.id}
                    </p>
                  </div>
                  <Badge variant={statusInfo?.variant || "outline"}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusInfo?.label}
                  </Badge>
                </div>

                {subscription.cancelAtPeriodEnd && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <div className="flex items-center gap-2 text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      <p className="text-sm font-medium">
                        Cancels at period end
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  Subscription Details
                </h4>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Current Period</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(subscription.periodStart)} -{" "}
                        {formatDate(subscription.periodEnd)}
                      </p>
                    </div>
                  </div>

                  {subscription.trialStart && subscription.trialEnd && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Trial Period</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(subscription.trialStart)} -{" "}
                          {formatDate(subscription.trialEnd)}
                        </p>
                      </div>
                    </div>
                  )}

                  {subscription.seats !== undefined && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Seats</p>
                        <p className="text-sm text-muted-foreground">
                          {subscription.seats} seat(s)
                        </p>
                      </div>
                    </div>
                  )}

                  {subscription.stripeCustomerId && (
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Stripe Customer ID
                        </p>
                        <p className="text-sm text-muted-foreground font-mono text-xs">
                          {subscription.stripeCustomerId}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  Actions
                </h4>

                <div className="space-y-3">
                  {otherPlans.length > 0 && subscription.status === "active" && (
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() =>
                          setActionType((prev) =>
                            prev === "modify" ? null : "modify",
                          )
                        }
                        disabled={isLoading}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Modify Plan
                      </Button>
                      {actionType === "modify" && (
                        <div className="space-y-2 p-3 border rounded-lg">
                          <Label htmlFor="modify-plan">Select Plan</Label>
                          <Select
                            value={selectedPlan}
                            onValueChange={setSelectedPlan}
                          >
                            <SelectTrigger id="modify-plan" className="w-full">
                              <SelectValue placeholder="Select a plan" />
                            </SelectTrigger>
                            <SelectContent>
                              {otherPlans.map((plan) => (
                                <SelectItem key={plan} value={plan}>
                                  {formatPlanName(plan)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setActionType(null);
                                setSelectedPlan(subscription.plan);
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={async () => {
                                const success = await handleAction("modify");
                                if (success) {
                                  setActionType(null);
                                }
                              }}
                              disabled={
                                !selectedPlan ||
                                selectedPlan === subscription.plan ||
                                isLoading
                              }
                            >
                              <Settings className="h-4 w-4 mr-1" />
                              Modify
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {subscription.status === "active" && (
                    <div className="space-y-2">
                      {actionType === "extend" ? (
                        <div className="space-y-2 p-3 border rounded-lg">
                          <Label htmlFor="extend-months">
                            Extend by (months)
                          </Label>
                          <Input
                            id="extend-months"
                            type="number"
                            min="1"
                            value={extendMonths}
                            onChange={(e) => setExtendMonths(e.target.value)}
                            placeholder="Enter number of months"
                          />
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setActionType(null);
                                setExtendMonths("1");
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={async () => {
                                const success = await handleAction("extend");
                                if (success) {
                                  setActionType(null);
                                }
                              }}
                              disabled={isLoading}
                            >
                              <Calendar className="h-4 w-4 mr-1" />
                              Extend
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => setActionType("extend")}
                          disabled={isLoading}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Extend Subscription
                        </Button>
                      )}
                    </div>
                  )}

                  {subscription.seats !== undefined &&
                    subscription.status === "active" && (
                      <div className="space-y-2">
                        {actionType === "seats" ? (
                          <div className="space-y-2 p-3 border rounded-lg">
                            <Label htmlFor="seats">Number of Seats</Label>
                            <Input
                              id="seats"
                              type="number"
                              min="1"
                              value={seats}
                              onChange={(e) => setSeats(e.target.value)}
                              placeholder="Enter number of seats"
                            />
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setActionType(null);
                                  setSeats(
                                    subscription.seats?.toString() || "1",
                                  );
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={async () => {
                                  const success = await handleAction("seats");
                                  if (success) {
                                    setActionType(null);
                                  }
                                }}
                                disabled={
                                  !seats ||
                                  Number.parseInt(seats, 10) ===
                                    subscription.seats ||
                                  isLoading
                                }
                              >
                                <Users className="h-4 w-4 mr-1" />
                                Update Seats
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => setActionType("seats")}
                            disabled={isLoading}
                          >
                            <Users className="h-4 w-4 mr-2" />
                            Update Seats
                          </Button>
                        )}
                      </div>
                    )}

                  {subscription.status === "active" && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          disabled={isLoading}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Cancel Subscription
                          <ChevronDown className="h-3 w-3 ml-auto" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem disabled={isLoading}>
                          <Clock className="h-4 w-4 mr-2" />
                          Cancel at Period End
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled={isLoading}>
                          <XCircle className="h-4 w-4 mr-2" />
                          Cancel Immediately
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}

                  {subscription.status === "canceled" && (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      disabled={isLoading}
                      onClick={() => handleAction("reactivate")}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reactivate Subscription
                    </Button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">No Subscription</h3>
              <p className="text-sm text-muted-foreground">
                This user does not have an active subscription.
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
