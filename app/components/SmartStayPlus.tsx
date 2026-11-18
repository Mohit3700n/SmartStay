'use client';

import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  Accessibility,
  AlertTriangle,
  Baby,
  ArrowRight,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  HeartHandshake,
  LifeBuoy,
  MapPin,
  PackageCheck,
  Pencil,
  Plus,
  Receipt,
  ShieldCheck,
  ShoppingBasket,
  Sparkles,
  Trash2,
  Utensils,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PROPERTIES } from '../data/properties';
import { getStayReadiness } from '../data/stayReadiness';
import { UserBooking } from '../types';

type HubTab = 'readiness' | 'timeline' | 'care' | 'essentials' | 'budget' | 'support';
type RequestLine = { id: string; label: string; quantity: number; unitPrice: number };
type ExpenseCategory = 'food' | 'transport' | 'activities' | 'shopping' | 'other';
type ManualExpense = {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  paidBy: string;
  spentOn: string;
};
type BudgetBooking = Pick<UserBooking, 'id' | 'itemType' | 'title' | 'location' | 'totalPrice' | 'currency' | 'status'>;
type TripBudget = {
  limit: number | null;
  travelers: number;
  tripDays: number;
  linkedBookings: BudgetBooking[];
  expenses: ManualExpense[];
};
type SavedRequest = {
  id: string;
  bookingId: string;
  lines: RequestLine[];
  note: string;
  total: number;
  createdAt: string;
};
type SavedIssue = {
  id: string;
  bookingId: string;
  category: string;
  priority: 'standard' | 'urgent';
  description: string;
  createdAt: string;
};
type HubData = {
  version: 1;
  completedSteps: Record<string, string[]>;
  careRequests: SavedRequest[];
  essentialsRequests: SavedRequest[];
  issues: SavedIssue[];
  budgets?: Record<string, TripBudget>;
};

const EMPTY_HUB_DATA: HubData = {
  version: 1,
  completedSteps: {},
  careRequests: [],
  essentialsRequests: [],
  issues: [],
  budgets: {},
};

const STORAGE_PREFIX = 'smartstay_plus_v1';
const TRIP_STEPS = [
  { id: 'before', phase: 'Before arrival', title: 'Review your stay details', description: 'Check dates, guest count and host instructions.' },
  { id: 'arrival', phase: 'Arrival day', title: 'Plan your route to the stay', description: 'Confirm your pickup or save the property directions.' },
  { id: 'access', phase: 'Check-in', title: 'Keep access details handy', description: 'Open your booking to view check-in information when available.' },
  { id: 'during', phase: 'During your stay', title: 'Check your essentials', description: 'Review nearby services and any care requests.' },
  { id: 'checkout', phase: 'Before checkout', title: 'Review checkout instructions', description: 'Confirm checkout time and house rules with your host.' },
];

const CARE_CATALOG = [
  { id: 'wheelchair', title: 'Mobility support', description: 'Request a wheelchair or step-free arrival assistance.', price: 600, icon: Accessibility },
  { id: 'baby-kit', title: 'Baby-ready kit', description: 'Request a travel cot, high chair or child safety items.', price: 900, icon: Baby },
  { id: 'caregiver', title: 'Care companion', description: 'Request a callback about vetted local care support.', price: 1200, icon: HeartHandshake },
  { id: 'dietary', title: 'Dietary welcome pack', description: 'Share dietary needs for a tailored arrival basket.', price: 700, icon: Utensils },
];

const ESSENTIALS_CATALOG = [
  { id: 'water', title: 'Drinking water pack', unit: 'pack', price: 120 },
  { id: 'breakfast', title: 'Breakfast starter basket', unit: 'basket', price: 650 },
  { id: 'local', title: 'Local snacks & fruit', unit: 'basket', price: 450 },
  { id: 'baby', title: 'Baby essentials pack', unit: 'pack', price: 500 },
  { id: 'work', title: 'Work-from-stay kit', unit: 'kit', price: 350 },
];

const isRecord = (value: unknown): value is Record<string, unknown> => (
  typeof value === 'object' && value !== null
);

const isRequest = (value: unknown): value is SavedRequest => {
  if (!isRecord(value) || !Array.isArray(value.lines)) return false;
  return typeof value.id === 'string'
    && typeof value.bookingId === 'string'
    && typeof value.note === 'string'
    && typeof value.total === 'number'
    && Number.isFinite(value.total)
    && typeof value.createdAt === 'string'
    && Number.isFinite(Date.parse(value.createdAt))
    && value.lines.every((line) => isRecord(line)
      && typeof line.id === 'string'
      && typeof line.label === 'string'
      && typeof line.quantity === 'number'
      && Number.isInteger(line.quantity)
      && line.quantity > 0
      && typeof line.unitPrice === 'number'
      && Number.isFinite(line.unitPrice)
      && line.unitPrice >= 0);
};

const isIssue = (value: unknown): value is SavedIssue => (
  isRecord(value)
  && typeof value.id === 'string'
  && typeof value.bookingId === 'string'
  && typeof value.category === 'string'
  && (value.priority === 'standard' || value.priority === 'urgent')
  && typeof value.description === 'string'
  && typeof value.createdAt === 'string'
  && Number.isFinite(Date.parse(value.createdAt))
);

const isBudgetBooking = (value: unknown): value is BudgetBooking => (
  isRecord(value)
  && typeof value.id === 'string'
  && (value.itemType === 'stay' || value.itemType === 'experience' || value.itemType === 'cab')
  && typeof value.title === 'string'
  && typeof value.location === 'string'
  && typeof value.totalPrice === 'number'
  && Number.isFinite(value.totalPrice)
  && value.totalPrice >= 0
  && (value.currency === 'INR' || value.currency === 'USD' || value.currency === 'EUR' || value.currency === 'GBP')
  && (value.status === 'confirmed' || value.status === 'active' || value.status === 'completed' || value.status === 'cancelled')
);

const isExpenseCategory = (value: string): value is ExpenseCategory => (
  value === 'food' || value === 'transport' || value === 'activities' || value === 'shopping' || value === 'other'
);

const isManualExpense = (value: unknown): value is ManualExpense => (
  isRecord(value)
  && typeof value.id === 'string'
  && typeof value.title === 'string'
  && value.title.length <= 80
  && typeof value.amount === 'number'
  && Number.isFinite(value.amount)
  && value.amount > 0
  && value.amount <= 10000000
  && (value.category === 'food' || value.category === 'transport' || value.category === 'activities' || value.category === 'shopping' || value.category === 'other')
  && typeof value.paidBy === 'string'
  && value.paidBy.length <= 60
  && typeof value.spentOn === 'string'
  && Number.isFinite(Date.parse(value.spentOn))
);

const isTripBudget = (value: unknown): value is TripBudget => (
  isRecord(value)
  && (value.limit === null || (typeof value.limit === 'number' && Number.isInteger(value.limit) && value.limit > 0 && value.limit <= 100000000))
  && typeof value.travelers === 'number'
  && Number.isInteger(value.travelers)
  && value.travelers >= 1
  && value.travelers <= 50
  && typeof value.tripDays === 'number'
  && Number.isInteger(value.tripDays)
  && value.tripDays >= 1
  && value.tripDays <= 365
  && Array.isArray(value.linkedBookings)
  && value.linkedBookings.every(isBudgetBooking)
  && new Set(value.linkedBookings.map((booking) => booking.id)).size === value.linkedBookings.length
  && Array.isArray(value.expenses)
  && value.expenses.every(isManualExpense)
);

const isHubData = (value: unknown): value is HubData => {
  if (!isRecord(value) || !isRecord(value.completedSteps)) return false;
  return value.version === 1
    && Object.values(value.completedSteps).every(
      (steps) => Array.isArray(steps) && steps.every((step) => typeof step === 'string'),
    )
    && Array.isArray(value.careRequests)
    && value.careRequests.every(isRequest)
    && Array.isArray(value.essentialsRequests)
    && value.essentialsRequests.every(isRequest)
    && Array.isArray(value.issues)
    && value.issues.every(isIssue)
    && (value.budgets === undefined
      || (isRecord(value.budgets) && Object.values(value.budgets).every(isTripBudget)));
};

const makeId = (prefix: string) => {
  const suffix = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return `${prefix}-${suffix}`;
};

const formatDate = (date: Date) => new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
}).format(date);

const getBookingProperty = (booking: UserBooking | undefined) => (
  booking ? PROPERTIES.find((property) => property.title === booking.title) : undefined
);

const toBudgetBooking = (booking: UserBooking): BudgetBooking => ({
  id: booking.id,
  itemType: booking.itemType,
  title: booking.title,
  location: booking.location,
  totalPrice: booking.totalPrice,
  currency: booking.currency,
  status: booking.status,
});

const inferTripDays = (dateRange: string): number => {
  const nights = dateRange.match(/(\d+)\s*nights?/i);
  if (nights) return Math.min(365, Math.max(1, Number(nights[1]) + 1));

  const dates = dateRange.match(/([A-Za-z]{3,9})\s+(\d{1,2})\s*[–-]\s*(?:([A-Za-z]{3,9})\s+)?(\d{1,2})/);
  if (!dates) return 1;

  const monthNumber = (month: string) => new Date(`${month.slice(0, 3)} 1, 2020`).getMonth();
  const startMonth = monthNumber(dates[1]);
  const endMonth = dates[3] ? monthNumber(dates[3]) : startMonth;
  const startDay = Number(dates[2]);
  const endDay = Number(dates[4]);
  if ([startMonth, endMonth].some((month) => Number.isNaN(month)) || startDay < 1 || startDay > 31 || endDay < 1 || endDay > 31) {
    return 1;
  }

  const year = Number(dateRange.match(/\b(20\d{2})\b/)?.[1] ?? new Date().getFullYear());
  const endYear = endMonth < startMonth || (endMonth === startMonth && endDay < startDay) ? year + 1 : year;
  const start = Date.UTC(year, startMonth, startDay);
  const end = Date.UTC(endYear, endMonth, endDay);
  const days = Math.floor((end - start) / 86400000) + 1;
  return Number.isInteger(days) && days > 0 && days <= 365 ? days : 1;
};

const createTripBudget = (booking: UserBooking): TripBudget => ({
  limit: null,
  travelers: Math.min(50, Math.max(1, booking.guestsCount)),
  tripDays: inferTripDays(booking.dateRange),
  linkedBookings: [toBudgetBooking(booking)],
  expenses: [],
});

export const SmartStayPlus: React.FC = () => {
  const {
    bookings,
    currentUser,
    formatPrice,
    requireAuth,
    setActiveTab,
    setAuthModalConfig,
    setIsSosModalOpen,
  } = useApp();
  const [activeHubTab, setActiveHubTab] = useState<HubTab>('readiness');
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [hubData, setHubData] = useState<HubData>(EMPTY_HUB_DATA);
  const [hydratedKey, setHydratedKey] = useState('');
  const [careSelections, setCareSelections] = useState<string[]>([]);
  const [careNote, setCareNote] = useState('');
  const [essentialQuantities, setEssentialQuantities] = useState<Record<string, number>>({});
  const [essentialNote, setEssentialNote] = useState('');
  const [issueCategory, setIssueCategory] = useState('Access or check-in');
  const [issuePriority, setIssuePriority] = useState<'standard' | 'urgent'>('standard');
  const [issueDescription, setIssueDescription] = useState('');
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');

  const storageKey = `${STORAGE_PREFIX}_${currentUser?.id || 'visitor'}`;
  const eligibleBookings = useMemo(
    () => bookings.filter((booking) => booking.itemType === 'stay' && booking.status !== 'cancelled'),
    [bookings],
  );
  const selectedBooking = eligibleBookings.find((booking) => booking.id === selectedBookingId) ?? eligibleBookings[0];
  const selectedProperty = getBookingProperty(selectedBooking);
  const readiness = selectedProperty ? getStayReadiness(selectedProperty) : undefined;
  const savedBudget = selectedBooking ? hubData.budgets?.[selectedBooking.id] : undefined;
  const budget = selectedBooking
    ? savedBudget
      ? savedBudget.linkedBookings.some((booking) => booking.id === selectedBooking.id)
        ? savedBudget
        : { ...savedBudget, linkedBookings: [toBudgetBooking(selectedBooking), ...savedBudget.linkedBookings] }
      : createTripBudget(selectedBooking)
    : undefined;
  const linkedBookings = budget?.linkedBookings.map((savedBooking) => {
    const currentBooking = bookings.find((booking) => booking.id === savedBooking.id);
    return currentBooking ? toBudgetBooking(currentBooking) : savedBooking;
  }) ?? [];
  const budgetBookings = linkedBookings.filter((booking) => booking.status !== 'cancelled');
  const bookingSpend = budgetBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
  const manualSpend = budget?.expenses.reduce((sum, expense) => sum + expense.amount, 0) ?? 0;
  const totalSpend = bookingSpend + manualSpend;
  const remainingBudget = budget?.limit === null || budget?.limit === undefined
    ? null
    : budget.limit - totalSpend;
  const dailyPerPersonSpend = budget
    ? totalSpend / (budget.travelers * budget.tripDays)
    : 0;
  const isHydrated = hydratedKey === storageKey;

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed: unknown = JSON.parse(saved);
          if (isHubData(parsed)) {
            setHubData({ ...parsed, budgets: parsed.budgets ?? {} });
          } else {
            console.warn('SmartStay+ data has an unsupported format and was not loaded.');
            setHubData(EMPTY_HUB_DATA);
          }
        } else {
          setHubData(EMPTY_HUB_DATA);
        }
      } catch (error) {
        console.error('Unable to load saved SmartStay+ data.', error);
        setHubData(EMPTY_HUB_DATA);
      }
      setHydratedKey(storageKey);
    });
    return () => { cancelled = true; };
  }, [storageKey]);

  const updateHubData = (updater: (previous: HubData) => HubData): boolean => {
    const next = updater(hubData);
    setHubData(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
      setFeedback('');
      return true;
    } catch (error) {
      console.error('Unable to save SmartStay+ data in this browser.', error);
      setFeedback('Your change could not be saved in this browser. Check storage availability and try again.');
      return false;
    }
  };

  const requireGuest = (action: string) => {
    if (currentUser?.role === 'guest') return true;
    if (currentUser?.role === 'host') {
      setFeedback('Guest access is required for this action. Sign in with a guest account to continue.');
      setAuthModalConfig({ isOpen: true, mode: 'login', role: 'guest' });
      return false;
    }
    requireAuth('guest', action);
    return false;
  };

  const updateTripBudget = (updater: (previous: TripBudget) => TripBudget): boolean => {
    if (!selectedBooking || !budget) return false;
    return updateHubData((previous) => ({
      ...previous,
      budgets: {
        ...previous.budgets,
        [selectedBooking.id]: updater(previous.budgets?.[selectedBooking.id] ?? budget),
      },
    }));
  };

  const saveBudgetSettings = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedBooking || !requireGuest('manage your trip budget')) return;

    const formData = new FormData(event.currentTarget);
    const rawLimit = String(formData.get('budgetLimit') ?? '').trim();
    const limit = rawLimit ? Number(rawLimit) : null;
    const travelers = Number(formData.get('travelers'));
    const tripDays = Number(formData.get('tripDays'));

    if ((limit !== null && (!Number.isInteger(limit) || limit <= 0 || limit > 100000000))
      || !Number.isInteger(travelers) || travelers < 1 || travelers > 50
      || !Number.isInteger(tripDays) || tripDays < 1 || tripDays > 365) {
      setFeedback('Enter a positive budget (or leave it blank), 1–50 travellers and 1–365 trip days.');
      return;
    }

    if (!updateTripBudget((previous) => ({ ...previous, limit, travelers, tripDays }))) return;
    setFeedback('Trip budget settings saved.');
  };

  const toggleBudgetBooking = (booking: UserBooking, included: boolean) => {
    if (!selectedBooking || !requireGuest('manage trip budget bookings')) return;
    if (booking.id === selectedBooking.id && !included) return;

    const alreadyLinkedElsewhere = Object.entries(hubData.budgets ?? {}).some(([tripId, plan]) => (
      tripId !== selectedBooking.id && plan.linkedBookings.some((item) => item.id === booking.id)
    ));
    if (included && alreadyLinkedElsewhere) {
      setFeedback('This reservation is already included in another trip budget.');
      return;
    }

    if (!updateTripBudget((previous) => ({
      ...previous,
      linkedBookings: included
        ? previous.linkedBookings.some((item) => item.id === booking.id)
          ? previous.linkedBookings
          : [...previous.linkedBookings, toBudgetBooking(booking)]
        : previous.linkedBookings.filter((item) => item.id !== booking.id),
    }))) return;
    setFeedback(included ? 'Reservation added to this trip budget.' : 'Reservation removed from this trip budget.');
  };

  const saveExpense = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedBooking || !requireGuest('track trip expenses')) return;

    const formData = new FormData(event.currentTarget);
    const title = String(formData.get('expenseTitle') ?? '').trim();
    const amount = Number(formData.get('expenseAmount'));
    const category = String(formData.get('expenseCategory') ?? '');
    const spentOn = String(formData.get('spentOn') ?? '');
    const paidBy = String(formData.get('paidBy') ?? '').trim() || currentUser?.name || 'Me';

    if (!title || title.length > 80 || !Number.isFinite(amount) || amount <= 0 || amount > 10000000
      || !isExpenseCategory(category) || paidBy.length > 60
      || !Number.isFinite(Date.parse(spentOn))) {
      setFeedback('Enter an expense name, a positive INR amount and a valid date.');
      return;
    }

    const expense: ManualExpense = {
      id: editingExpenseId ?? makeId('EXP'),
      title,
      amount,
      category,
      paidBy,
      spentOn,
    };
    if (!updateTripBudget((previous) => ({
      ...previous,
      expenses: editingExpenseId
        ? previous.expenses.map((item) => item.id === editingExpenseId ? expense : item)
        : [expense, ...previous.expenses],
    }))) return;
    event.currentTarget.reset();
    setEditingExpenseId(null);
    setFeedback(editingExpenseId ? 'Expense updated.' : 'Expense added to your trip.');
  };

  const removeExpense = (expenseId: string) => {
    if (!requireGuest('remove a trip expense')) return;
    if (!updateTripBudget((previous) => ({
      ...previous,
      expenses: previous.expenses.filter((item) => item.id !== expenseId),
    }))) return;
    if (editingExpenseId === expenseId) setEditingExpenseId(null);
    setFeedback('Expense removed from your trip.');
  };

  const toggleStep = (stepId: string) => {
    if (!selectedBooking || !requireGuest('manage your trip checklist')) return;
    updateHubData((previous) => {
      const completed = previous.completedSteps[selectedBooking.id] ?? [];
      const next = completed.includes(stepId)
        ? completed.filter((id) => id !== stepId)
        : [...completed, stepId];
      return {
        ...previous,
        completedSteps: { ...previous.completedSteps, [selectedBooking.id]: next },
      };
    });
  };

  const submitCareRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedBooking || !requireGuest('request stay care services')) return;
    if (careSelections.length === 0) {
      setFeedback('Select at least one care option before saving your request.');
      return;
    }
    const lines = CARE_CATALOG
      .filter((item) => careSelections.includes(item.id))
      .map((item) => ({ id: item.id, label: item.title, quantity: 1, unitPrice: item.price }));
    const request: SavedRequest = {
      id: makeId('CARE'),
      bookingId: selectedBooking.id,
      lines,
      note: careNote.trim(),
      total: lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0),
      createdAt: new Date().toISOString(),
    };
    if (!updateHubData((previous) => ({ ...previous, careRequests: [request, ...previous.careRequests] }))) return;
    setCareSelections([]);
    setCareNote('');
    setFeedback('Care request draft saved on this device. No service provider has been contacted.');
  };

  const submitEssentialsRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedBooking || !requireGuest('prepare arrival essentials')) return;
    const lines = ESSENTIALS_CATALOG
      .filter((item) => (essentialQuantities[item.id] ?? 0) > 0)
      .map((item) => ({
        id: item.id,
        label: item.title,
        quantity: essentialQuantities[item.id],
        unitPrice: item.price,
      }));
    if (lines.length === 0) {
      setFeedback('Add at least one item before saving your list.');
      return;
    }
    const request: SavedRequest = {
      id: makeId('ESS'),
      bookingId: selectedBooking.id,
      lines,
      note: essentialNote.trim(),
      total: lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0),
      createdAt: new Date().toISOString(),
    };
    if (!updateHubData((previous) => ({ ...previous, essentialsRequests: [request, ...previous.essentialsRequests] }))) return;
    setEssentialQuantities({});
    setEssentialNote('');
    setFeedback('Essentials list saved as a local draft. No order was placed and no payment was taken.');
  };

  const submitIssue = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedBooking || !requireGuest('report a stay issue')) return;
    const description = issueDescription.trim();
    if (description.length < 10) {
      setFeedback('Please add at least 10 characters so the issue is clear.');
      return;
    }
    const issue: SavedIssue = {
      id: makeId('DRAFT'),
      bookingId: selectedBooking.id,
      category: issueCategory,
      priority: issuePriority,
      description,
      createdAt: new Date().toISOString(),
    };
    if (!updateHubData((previous) => ({ ...previous, issues: [issue, ...previous.issues] }))) return;
    setIssueDescription('');
    setFeedback('Issue report draft saved locally. SmartStay support was not contacted.');
  };

  const tabs: { id: HubTab; label: string; icon: typeof ShieldCheck }[] = [
    { id: 'readiness', label: 'Stay readiness', icon: ShieldCheck },
    { id: 'timeline', label: 'Trip timeline', icon: ClipboardCheck },
    { id: 'care', label: 'Care support', icon: HeartHandshake },
    { id: 'essentials', label: 'Arrival essentials', icon: ShoppingBasket },
    { id: 'budget', label: 'Trip budget', icon: Receipt },
    { id: 'support', label: 'Issue resolution', icon: LifeBuoy },
  ];

  const relatedRequests = (requests: SavedRequest[]) => requests.filter(
    (request) => request.bookingId === selectedBooking?.id,
  );
  const relatedIssues = hubData.issues.filter((issue) => issue.bookingId === selectedBooking?.id);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-8">
      <div className="relative overflow-hidden rounded-[2rem] bg-neutral-950 p-7 text-white sm:p-10">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-rose-500/20 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold text-rose-200">
              <Sparkles className="h-3.5 w-3.5" /> SMARTSTAY+
            </span>
            <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Your stay, thoughtfully planned.</h1>
            <p className="mt-2 text-sm leading-relaxed text-neutral-300">
              One place for stay details, trip preparation and requests. Service requests are saved locally in this prototype.
            </p>
          </div>
          {eligibleBookings.length > 0 && (
            <label className="w-full max-w-md text-xs font-semibold text-neutral-300">
              Select a stay
              <select
                value={selectedBooking?.id ?? ''}
                onChange={(event) => {
                  setSelectedBookingId(event.target.value);
                  setFeedback('');
                }}
                className="mt-1.5 w-full rounded-xl border border-white/15 bg-neutral-900 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-400"
              >
                {eligibleBookings.map((booking) => (
                  <option key={booking.id} value={booking.id}>{booking.title} · {booking.id}</option>
                ))}
              </select>
            </label>
          )}
        </div>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => { setActiveHubTab(id); setFeedback(''); }}
            className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-bold transition-colors ${
              activeHubTab === id
                ? 'border-neutral-900 bg-neutral-900 text-white'
                : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400'
            }`}
          >
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>

      {feedback && (
        <div role="status" className="mt-4 flex items-start justify-between gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs text-neutral-700">
          <span>{feedback}</span>
          <button type="button" onClick={() => setFeedback('')} aria-label="Dismiss message">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {!isHydrated ? (
        <div className="mt-5 rounded-2xl border border-neutral-200 p-10 text-center text-sm text-neutral-500" role="status">
          Loading your saved trip tools…
        </div>
      ) : !selectedBooking ? (
        <div className="mt-5 rounded-3xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-16 text-center">
          <MapPin className="mx-auto h-8 w-8 text-neutral-400" />
          <h2 className="mt-3 text-lg font-bold text-neutral-900">Your trip tools are ready when you are</h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-neutral-500">Book a stay to build its timeline, request care or prepare arrival essentials.</p>
          <button type="button" onClick={() => setActiveTab('stays')} className="mt-5 rounded-full bg-neutral-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-black">
            Explore stays
          </button>
        </div>
      ) : (
        <div className="mt-5">
          {activeHubTab === 'readiness' && (
            <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Listing information</p>
                    <h2 className="mt-1 text-xl font-black text-neutral-900">Stay readiness</h2>
                  </div>
                  <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800">
                    <span className="text-xl font-black">{readiness?.score ?? 0}/{readiness?.total ?? 5}</span>
                    <span className="text-[9px] font-bold uppercase">details</span>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-neutral-600">
                  {selectedProperty?.title ?? selectedBooking.title}
                </p>
                <div className="mt-5 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-[11px] leading-relaxed text-amber-900">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  This score checks which details are present in the listing. It is not an independent inspection or verification.
                </div>
              </div>
              <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs">
                <h3 className="text-sm font-bold text-neutral-900">Details available for this stay</h3>
                <div className="mt-4 space-y-3">
                  {readiness?.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-4 rounded-2xl bg-neutral-50 px-4 py-3">
                      <div className="flex min-w-0 items-center gap-3">
                        {item.available
                          ? <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                          : <span className="h-5 w-5 shrink-0 rounded-full border-2 border-neutral-300" />}
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-neutral-900">{item.label}</p>
                          <p className="mt-0.5 truncate text-[11px] text-neutral-500">{item.detail}</p>
                        </div>
                      </div>
                      <span className={`shrink-0 text-[10px] font-bold ${item.available ? 'text-emerald-700' : 'text-neutral-400'}`}>
                        {item.available ? 'Listed' : 'Not listed'}
                      </span>
                    </div>
                  ))}
                </div>
                {!selectedProperty && (
                  <p className="mt-4 text-xs text-amber-800">This reservation does not match a sample listing, so a detail score is unavailable.</p>
                )}
              </div>
            </div>
          )}

          {activeHubTab === 'timeline' && (
            <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
              <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-black text-neutral-900">Your trip checklist</h2>
                    <p className="mt-1 text-xs text-neutral-500">Relative milestones; no flight or calendar sync is connected.</p>
                  </div>
                  <Clock3 className="h-6 w-6 text-neutral-400" />
                </div>
                <div className="mt-6 space-y-4">
                  {TRIP_STEPS.map((step, index) => {
                    const complete = (hubData.completedSteps[selectedBooking.id] ?? []).includes(step.id);
                    return (
                      <div key={step.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <button
                            type="button"
                            aria-label={`${complete ? 'Mark incomplete' : 'Mark complete'}: ${step.title}`}
                            aria-pressed={complete}
                            onClick={() => toggleStep(step.id)}
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                              complete ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-neutral-300 bg-white text-neutral-500'
                            }`}
                          >
                            {complete ? <Check className="h-4 w-4" /> : <span className="text-xs font-bold">{index + 1}</span>}
                          </button>
                          {index < TRIP_STEPS.length - 1 && <span className="my-1 min-h-5 w-px flex-1 bg-neutral-200" />}
                        </div>
                        <div className="pb-4">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-rose-600">{step.phase}</p>
                          <h3 className={`mt-0.5 text-sm font-bold ${complete ? 'text-neutral-400 line-through' : 'text-neutral-900'}`}>{step.title}</h3>
                          <p className="mt-1 text-xs leading-relaxed text-neutral-500">{step.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="rounded-3xl bg-neutral-900 p-6 text-white">
                <span className="inline-flex rounded-full bg-white/10 p-2"><PackageCheck className="h-5 w-5 text-emerald-300" /></span>
                <h3 className="mt-4 text-lg font-black">Trip at a glance</h3>
                <p className="mt-1 text-xs text-neutral-400">{selectedBooking.location}</p>
                <div className="mt-5 space-y-3 text-xs">
                  <div className="flex justify-between gap-3 border-b border-white/10 pb-3"><span className="text-neutral-400">Reservation</span><strong>{selectedBooking.id}</strong></div>
                  <div className="flex justify-between gap-3 border-b border-white/10 pb-3"><span className="text-neutral-400">Stay dates</span><strong className="text-right">{selectedBooking.dateRange}</strong></div>
                  <div className="flex justify-between gap-3"><span className="text-neutral-400">Guests</span><strong>{selectedBooking.guestsCount}</strong></div>
                </div>
                <p className="mt-5 rounded-xl border border-white/10 bg-white/5 p-3 text-[11px] leading-relaxed text-neutral-300">
                  Timeline items are editable reminders saved in this browser. They do not update a host or travel provider.
                </p>
              </div>
            </div>
          )}

          {activeHubTab === 'care' && (
            <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
              <form onSubmit={submitCareRequest} className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs">
                <h2 className="text-xl font-black text-neutral-900">Care & accessibility</h2>
                <p className="mt-1 text-xs text-neutral-500">Choose what you need; these are request categories, not confirmed services.</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {CARE_CATALOG.map((item) => {
                    const Icon = item.icon;
                    const checked = careSelections.includes(item.id);
                    return (
                      <label key={item.id} className={`cursor-pointer rounded-2xl border p-4 transition-colors ${checked ? 'border-rose-400 bg-rose-50' : 'border-neutral-200 hover:border-neutral-400'}`}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => setCareSelections((previous) => checked ? previous.filter((id) => id !== item.id) : [...previous, item.id])}
                          className="sr-only"
                        />
                        <div className="flex items-start justify-between gap-3">
                          <span className="rounded-xl bg-neutral-100 p-2 text-neutral-700"><Icon className="h-4 w-4" /></span>
                          <span className="text-xs font-bold text-neutral-900">{formatPrice(item.price)} est.</span>
                        </div>
                        <h3 className="mt-3 text-sm font-bold text-neutral-900">{item.title}</h3>
                        <p className="mt-1 text-xs leading-relaxed text-neutral-500">{item.description}</p>
                        <span className="mt-3 block text-[10px] font-bold text-rose-700">{checked ? 'Selected' : 'Select request'}</span>
                      </label>
                    );
                  })}
                </div>
                <label className="mt-4 block text-xs font-bold text-neutral-700">
                  Access, care or dietary notes
                  <textarea value={careNote} onChange={(event) => setCareNote(event.target.value)} maxLength={400} rows={3} className="mt-1.5 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-rose-200" placeholder="Share only the information needed for this request." />
                  <span className="mt-1 block text-right text-[10px] font-normal text-neutral-400">{careNote.length}/400</span>
                </label>
                <button type="submit" className="mt-3 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-black">
                  <Plus className="h-4 w-4" /> Save care request draft
                </button>
              </form>
              <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6">
                <h3 className="text-sm font-bold text-neutral-900">Saved drafts for this stay</h3>
                <p className="mt-1 text-[11px] text-neutral-500">Estimate only; no provider is contacted or booked.</p>
                <div className="mt-4 space-y-3">
                  {relatedRequests(hubData.careRequests).length ? relatedRequests(hubData.careRequests).map((request) => (
                    <div key={request.id} className="rounded-2xl border border-neutral-200 bg-white p-4">
                      <div className="flex justify-between gap-3"><strong className="text-xs text-neutral-900">{request.id}</strong><span className="text-xs font-bold">{formatPrice(request.total)}</span></div>
                      <p className="mt-2 text-xs text-neutral-600">{request.lines.map((line) => line.label).join(' · ')}</p>
                      {request.note && <p className="mt-2 text-[11px] text-neutral-500">{request.note}</p>}
                      <p className="mt-2 text-[10px] text-neutral-400">{formatDate(new Date(request.createdAt))} · Draft only</p>
                    </div>
                  )) : <p className="rounded-2xl border border-dashed border-neutral-300 p-5 text-center text-xs text-neutral-500">No care requests saved yet.</p>}
                </div>
              </div>
            </div>
          )}

          {activeHubTab === 'essentials' && (
            <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
              <form onSubmit={submitEssentialsRequest} className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs">
                <h2 className="text-xl font-black text-neutral-900">Arrive to the essentials</h2>
                <p className="mt-1 text-xs text-neutral-500">Build a sample arrival list for your stay; prices are illustrative INR estimates.</p>
                <div className="mt-5 divide-y divide-neutral-100">
                  {ESSENTIALS_CATALOG.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-4 py-3">
                      <div>
                        <h3 className="text-xs font-bold text-neutral-900">{item.title}</h3>
                        <p className="mt-0.5 text-[11px] text-neutral-500">{formatPrice(item.price)} / {item.unit}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button type="button" aria-label={`Remove one ${item.title}`} disabled={!essentialQuantities[item.id]} onClick={() => setEssentialQuantities((previous) => ({ ...previous, [item.id]: Math.max(0, (previous[item.id] ?? 0) - 1) }))} className="h-8 w-8 rounded-full border border-neutral-200 text-lg disabled:opacity-40">−</button>
                        <span className="w-5 text-center text-xs font-bold">{essentialQuantities[item.id] ?? 0}</span>
                        <button type="button" aria-label={`Add one ${item.title}`} onClick={() => setEssentialQuantities((previous) => ({ ...previous, [item.id]: Math.min(10, (previous[item.id] ?? 0) + 1) }))} className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-lg"><Plus className="h-3.5 w-3.5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
                <label className="mt-3 block text-xs font-bold text-neutral-700">
                  Delivery preferences
                  <textarea value={essentialNote} onChange={(event) => setEssentialNote(event.target.value)} maxLength={300} rows={2} className="mt-1.5 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-rose-200" placeholder="Preferred arrival time or simple preferences." />
                </label>
                <button type="submit" className="mt-4 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-black">
                  <ShoppingBasket className="h-4 w-4" /> Save arrival list
                </button>
              </form>
              <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
                <div className="flex items-center gap-2 text-amber-900"><AlertTriangle className="h-5 w-5" /><h3 className="text-sm font-bold">Prototype notice</h3></div>
                <p className="mt-2 text-xs leading-relaxed text-amber-900">This catalogue is sample content. Saving a list does not place an order, reserve inventory, notify a host or charge your payment method.</p>
                <div className="mt-5 space-y-3">
                  {relatedRequests(hubData.essentialsRequests).length ? relatedRequests(hubData.essentialsRequests).map((request) => (
                    <div key={request.id} className="rounded-2xl border border-amber-200 bg-white p-4">
                      <div className="flex justify-between gap-3"><strong className="text-xs text-neutral-900">{request.id}</strong><span className="text-xs font-bold">{formatPrice(request.total)}</span></div>
                      <ul className="mt-2 space-y-1 text-xs text-neutral-600">{request.lines.map((line) => <li key={line.id}>{line.quantity} × {line.label}</li>)}</ul>
                      {request.note && <p className="mt-2 text-[11px] text-neutral-500">{request.note}</p>}
                      <p className="mt-2 text-[10px] text-neutral-400">{formatDate(new Date(request.createdAt))} · Not ordered</p>
                    </div>
                  )) : <p className="rounded-2xl border border-dashed border-amber-300 bg-white/70 p-5 text-center text-xs text-neutral-500">Your saved arrival lists will appear here.</p>}
                </div>
              </div>
            </div>
          )}

          {activeHubTab === 'budget' && budget && selectedBooking && (
            <div className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: 'Trip spend', value: formatPrice(totalSpend), note: 'Bookings + expenses' },
                  {
                    label: remainingBudget === null ? 'Budget limit' : remainingBudget >= 0 ? 'Budget remaining' : 'Over budget',
                    value: remainingBudget === null ? 'Not set' : formatPrice(Math.abs(remainingBudget)),
                    note: remainingBudget === null ? 'Set a cap below' : remainingBudget < 0 ? 'Reduce or adjust planned spend' : 'Across the trip',
                  },
                  { label: 'Average per traveller', value: formatPrice(totalSpend / budget.travelers), note: `${budget.travelers} traveller${budget.travelers === 1 ? '' : 's'} · equal split` },
                  { label: 'Average per traveller / day', value: formatPrice(dailyPerPersonSpend), note: `Based on ${budget.tripDays} trip day${budget.tripDays === 1 ? '' : 's'}` },
                ].map((metric) => (
                  <div key={metric.label} className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs">
                    <p className="text-[11px] font-bold text-neutral-500">{metric.label}</p>
                    <p className="mt-1 text-xl font-black text-neutral-900">{metric.value}</p>
                    <p className="mt-1 text-[10px] text-neutral-400">{metric.note}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="space-y-5">
                  <form onSubmit={saveBudgetSettings} key={selectedBooking.id} className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-black text-neutral-900">Set your trip guardrails</h2>
                        <p className="mt-1 text-xs text-neutral-500">Amounts are entered in INR; display follows your selected app currency.</p>
                      </div>
                      <Receipt className="h-5 w-5 shrink-0 text-neutral-400" />
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <label className="text-xs font-bold text-neutral-700 sm:col-span-3">
                        Total trip budget
                        <div className="mt-1.5 flex items-center rounded-xl border border-neutral-200 px-3 focus-within:ring-2 focus-within:ring-rose-200">
                          <span className="text-sm text-neutral-400">₹</span>
                          <input name="budgetLimit" type="number" min="1" max="100000000" step="1" defaultValue={budget.limit ?? ''} placeholder="Optional" className="w-full border-0 px-2 py-2.5 text-sm focus:outline-none" />
                        </div>
                        <span className="mt-1 block text-[10px] font-normal text-neutral-400">Leave blank to track spending without a limit.</span>
                      </label>
                      <label className="text-xs font-bold text-neutral-700">
                        Travellers
                        <input name="travelers" type="number" min="1" max="50" step="1" required defaultValue={budget.travelers} className="mt-1.5 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm font-normal" />
                      </label>
                      <label className="text-xs font-bold text-neutral-700">
                        Trip days
                        <input name="tripDays" type="number" min="1" max="365" step="1" required defaultValue={budget.tripDays} className="mt-1.5 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm font-normal" />
                      </label>
                      <div className="flex items-end sm:col-span-1">
                        <button type="submit" className="w-full rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-black">
                          Save budget
                        </button>
                      </div>
                    </div>
                    {budget.limit !== null && (
                      <div className="mt-5">
                        <div className="mb-1.5 flex justify-between text-[10px] font-semibold text-neutral-500">
                          <span>{formatPrice(totalSpend)} used</span>
                          <span>{formatPrice(budget.limit)} limit</span>
                        </div>
                        <div
                          className="h-2.5 overflow-hidden rounded-full bg-neutral-100"
                          role="progressbar"
                          aria-label="Trip budget used"
                          aria-valuemin={0}
                          aria-valuemax={budget.limit}
                          aria-valuenow={Math.min(totalSpend, budget.limit)}
                        >
                          <div
                            className={`h-full rounded-full transition-all ${remainingBudget !== null && remainingBudget < 0 ? 'bg-red-500' : 'bg-emerald-500'}`}
                            style={{ width: `${Math.min(100, (totalSpend / budget.limit) * 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                    {remainingBudget !== null && remainingBudget < 0 && (
                      <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-800">
                        You are {formatPrice(Math.abs(remainingBudget))} over this budget. Review optional spending or update your cap.
                      </p>
                    )}
                  </form>

                  <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-black text-neutral-900">Reservations in this trip</h2>
                        <p className="mt-1 text-xs text-neutral-500">Select the stay-related cabs and experiences to include.</p>
                      </div>
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                    </div>
                    <div className="mt-4 space-y-2">
                      {bookings.filter((booking) => booking.status !== 'cancelled').map((booking) => {
                        const checked = budget.linkedBookings.some((item) => item.id === booking.id);
                        const linkedElsewhere = Object.entries(hubData.budgets ?? {}).some(([tripId, plan]) => (
                          tripId !== selectedBooking.id && plan.linkedBookings.some((item) => item.id === booking.id)
                        ));
                        const locked = !checked && linkedElsewhere;
                        return (
                          <label key={booking.id} className={`flex items-center gap-3 rounded-2xl border p-3 ${locked ? 'cursor-not-allowed border-neutral-100 opacity-50' : 'cursor-pointer border-neutral-200 hover:border-neutral-400'}`}>
                            <input
                              type="checkbox"
                              checked={checked}
                              disabled={locked || booking.id === selectedBooking.id}
                              onChange={(event) => toggleBudgetBooking(booking, event.target.checked)}
                              className="h-4 w-4 accent-neutral-900"
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-xs font-bold text-neutral-900">{booking.title}</span>
                              <span className="mt-0.5 block text-[10px] capitalize text-neutral-500">{booking.itemType} · {booking.status}{locked ? ' · linked to another trip' : ''}</span>
                            </span>
                            <span className="shrink-0 text-xs font-bold text-neutral-900">{formatPrice(booking.totalPrice)}</span>
                          </label>
                        );
                      })}
                      {bookings.length === 0 && <p className="text-xs text-neutral-500">No reservations are available to add.</p>}
                    </div>
                    <p className="mt-3 text-[10px] leading-relaxed text-neutral-400">The selected stay is included automatically. Link only cabs and experiences belonging to this trip; cancelled reservations are excluded.</p>
                  </div>
                </div>

                <div className="space-y-5">
                  {remainingBudget !== null && remainingBudget > 0 && (
                    <div className="rounded-3xl bg-emerald-50 p-5 text-emerald-950">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Budget-aware next step</p>
                      <h3 className="mt-1 text-base font-black">Aim for up to {formatPrice(remainingBudget / (budget.travelers * budget.tripDays))} per person, per day</h3>
                      <p className="mt-1 text-xs leading-relaxed text-emerald-800">This is your remaining budget spread evenly over the trip—not a live price or availability promise.</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button type="button" onClick={() => setActiveTab('experiences')} className="inline-flex items-center gap-1.5 rounded-full bg-emerald-900 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-950">
                          Browse experiences <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                        <button type="button" onClick={() => setActiveTab('cabs')} className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-bold text-emerald-900 hover:bg-emerald-100">
                          Compare cabs
                        </button>
                      </div>
                    </div>
                  )}

                  <form onSubmit={saveExpense} key={`${selectedBooking.id}-${editingExpenseId ?? 'new'}`} className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-black text-neutral-900">{editingExpenseId ? 'Edit expense' : 'Add a trip expense'}</h2>
                        <p className="mt-1 text-xs text-neutral-500">Track food, local transport, shopping and more.</p>
                      </div>
                      <Plus className="h-5 w-5 text-neutral-400" />
                    </div>
                    {(() => {
                      const editingExpense = budget.expenses.find((expense) => expense.id === editingExpenseId);
                      return (
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <label className="text-xs font-bold text-neutral-700 sm:col-span-2">
                            Expense name
                            <input name="expenseTitle" required maxLength={80} defaultValue={editingExpense?.title ?? ''} placeholder="e.g. Dinner near the stay" className="mt-1.5 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm font-normal" />
                          </label>
                          <label className="text-xs font-bold text-neutral-700">
                            Amount (INR)
                            <input name="expenseAmount" required type="number" min="1" max="10000000" step="0.01" defaultValue={editingExpense?.amount ?? ''} placeholder="0" className="mt-1.5 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm font-normal" />
                          </label>
                          <label className="text-xs font-bold text-neutral-700">
                            Category
                            <select name="expenseCategory" defaultValue={editingExpense?.category ?? 'food'} className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm font-normal">
                              <option value="food">Food</option>
                              <option value="transport">Local transport</option>
                              <option value="activities">Activities</option>
                              <option value="shopping">Shopping</option>
                              <option value="other">Other</option>
                            </select>
                          </label>
                          <label className="text-xs font-bold text-neutral-700">
                            Paid by
                            <input name="paidBy" maxLength={60} defaultValue={editingExpense?.paidBy ?? currentUser?.name ?? 'Me'} className="mt-1.5 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm font-normal" />
                          </label>
                          <label className="text-xs font-bold text-neutral-700">
                            Date
                            <input name="spentOn" required type="date" defaultValue={editingExpense?.spentOn ?? new Date().toISOString().slice(0, 10)} className="mt-1.5 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm font-normal" />
                          </label>
                        </div>
                      );
                    })()}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button type="submit" className="rounded-full bg-neutral-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-black">
                        {editingExpenseId ? 'Save changes' : 'Add expense'}
                      </button>
                      {editingExpenseId && (
                        <button type="button" onClick={() => setEditingExpenseId(null)} className="rounded-full border border-neutral-200 px-5 py-2.5 text-xs font-bold text-neutral-700">
                          Cancel edit
                        </button>
                      )}
                    </div>
                  </form>

                  <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="text-sm font-bold text-neutral-900">Expense history</h2>
                      <span className="text-[10px] text-neutral-500">{budget.expenses.length} item{budget.expenses.length === 1 ? '' : 's'}</span>
                    </div>
                    <div className="mt-3 space-y-2">
                      {budget.expenses.length ? budget.expenses.map((expense) => (
                        <div key={expense.id} className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-3">
                          <Receipt className="h-4 w-4 shrink-0 text-neutral-400" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-bold text-neutral-900">{expense.title}</p>
                            <p className="mt-0.5 text-[10px] capitalize text-neutral-500">{expense.category} · {expense.spentOn} · paid by {expense.paidBy}</p>
                          </div>
                          <span className="shrink-0 text-xs font-bold text-neutral-900">{formatPrice(expense.amount)}</span>
                          <button type="button" onClick={() => setEditingExpenseId(expense.id)} aria-label={`Edit ${expense.title}`} className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"><Pencil className="h-3.5 w-3.5" /></button>
                          <button type="button" onClick={() => removeExpense(expense.id)} aria-label={`Remove ${expense.title}`} className="rounded-lg p-1.5 text-neutral-500 hover:bg-red-50 hover:text-red-700"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                      )) : <p className="rounded-2xl border border-dashed border-neutral-300 bg-white p-5 text-center text-xs text-neutral-500">Add your first expense to see the full trip total.</p>}
                    </div>
                    <p className="mt-3 text-[10px] leading-relaxed text-neutral-400">Per-person amounts are equal-share estimates. This tracker does not collect payments or settle balances.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeHubTab === 'support' && (
            <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
              <form onSubmit={submitIssue} className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs">
                <h2 className="text-xl font-black text-neutral-900">Stay issue report</h2>
                <p className="mt-1 text-xs text-neutral-500">Create a local draft with details you can share with your host or support team.</p>
                <label className="mt-5 block text-xs font-bold text-neutral-700">
                  Issue type
                  <select value={issueCategory} onChange={(event) => setIssueCategory(event.target.value)} className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm font-normal">
                    <option>Access or check-in</option>
                    <option>Cleanliness</option>
                    <option>Essential amenity unavailable</option>
                    <option>Safety concern</option>
                    <option>Other</option>
                  </select>
                </label>
                <fieldset className="mt-4">
                  <legend className="text-xs font-bold text-neutral-700">Priority</legend>
                  <div className="mt-2 flex gap-2">
                    {(['standard', 'urgent'] as const).map((priority) => (
                      <button key={priority} type="button" aria-pressed={issuePriority === priority} onClick={() => setIssuePriority(priority)} className={`rounded-full border px-4 py-2 text-xs font-bold capitalize ${issuePriority === priority ? priority === 'urgent' ? 'border-red-600 bg-red-600 text-white' : 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 text-neutral-600'}`}>
                        {priority}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <label className="mt-4 block text-xs font-bold text-neutral-700">
                  What happened?
                  <textarea required minLength={10} maxLength={1000} value={issueDescription} onChange={(event) => setIssueDescription(event.target.value)} rows={5} className="mt-1.5 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-rose-200" placeholder="Include when it happened and what help you need. Avoid adding payment or identity details." />
                  <span className="mt-1 block text-right text-[10px] font-normal text-neutral-400">{issueDescription.length}/1000</span>
                </label>
                <button type="submit" className="mt-2 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-black">
                  <LifeBuoy className="h-4 w-4" /> Save issue draft
                </button>
                <p className="mt-3 text-[10px] leading-relaxed text-neutral-500">No case is sent to SmartStay and no response-time guarantee is active in this prototype.</p>
              </form>
              <div className="space-y-4">
                <div className="rounded-3xl border border-red-200 bg-red-50 p-5">
                  <div className="flex gap-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-700" />
                    <div>
                      <h3 className="text-sm font-bold text-red-900">Immediate danger?</h3>
                      <p className="mt-1 text-xs leading-relaxed text-red-800">Do not wait for an app response. Contact local emergency services directly.</p>
                      <button type="button" onClick={() => setIsSosModalOpen(true)} className="mt-3 rounded-full border border-red-300 bg-white px-4 py-2 text-xs font-bold text-red-800 hover:bg-red-100">
                        Open Safety Center
                      </button>
                    </div>
                  </div>
                </div>
                <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6">
                  <h3 className="text-sm font-bold text-neutral-900">Your saved issue drafts</h3>
                  <div className="mt-4 space-y-3">
                    {relatedIssues.length ? relatedIssues.map((issue) => (
                      <article key={issue.id} className="rounded-2xl border border-neutral-200 bg-white p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <strong className="text-xs text-neutral-900">{issue.id}</strong>
                          <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${issue.priority === 'urgent' ? 'bg-red-50 text-red-700' : 'bg-neutral-100 text-neutral-600'}`}>{issue.priority} · draft</span>
                        </div>
                        <p className="mt-2 text-xs font-bold text-neutral-800">{issue.category}</p>
                        <p className="mt-1 whitespace-pre-wrap text-xs leading-relaxed text-neutral-600">{issue.description}</p>
                        <p className="mt-2 text-[10px] text-neutral-400">{formatDate(new Date(issue.createdAt))} · Not submitted</p>
                      </article>
                    )) : <p className="rounded-2xl border border-dashed border-neutral-300 p-5 text-center text-xs text-neutral-500">No issue drafts for this stay.</p>}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
