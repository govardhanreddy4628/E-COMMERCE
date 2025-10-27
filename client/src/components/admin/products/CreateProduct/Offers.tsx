import { useEffect, useState } from "react";
import { useFormContext, useFieldArray, FieldValues } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../../../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "../../../../ui/dialog";
import { EyeIcon, Trash2Icon } from "lucide-react";
import { CardDescription, CardHeader, CardTitle } from "../../../../ui/card";

const offerSchema = z.object({
  type: z.enum(["Bank Offer", "Special Price", "Coupon", "Cashback"], { required_error: "Offer type is required" }),
  description: z.string().min(1, "Description is required").max(100, "Max 100 characters"),
  discountType: z.enum(["FLAT", "PERCENTAGE"]),
  discountValue: z.number().min(0, "Discount must be >= 0"),
  minPurchaseAmount: z.number().min(0).optional().default(0),
  maxDiscountAmount: z.number().min(0).optional().default(0),
  validFrom: z.string().optional(),
  validTill: z.string().optional(),
  terms: z.string().optional(),
});

type OfferDraft = z.infer<typeof offerSchema>;

export default function Offers() {
  // react-hook-form context (we keep offers array inside main form)
  const { control, watch } = useFormContext<FieldValues>();

  // field array for actual stored offers in the form
  const { fields, append, remove } = useFieldArray({
    control,
    name: "offers",
  });

  // Watch offers array (for preview and modal content)
  const offersWatch: OfferDraft[] = watch("offers") || [];

  // Local draft for the active input row
  const [draft, setDraft] = useState<OfferDraft>({
    type: "Bank Offer", // ✅ valid default
    description: "",
    discountType: "FLAT",
    discountValue: 0,
    minPurchaseAmount: 0,
    maxDiscountAmount: 0,
    validFrom: "",
    validTill: "",
    terms: "",
  });

  // validation errors for draft (from zod)
  const [draftErrors, setDraftErrors] = useState<Record<string, string>>({});

  // modal state
  const [showModal, setShowModal] = useState(false);
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  const offerTypes: OfferDraft["type"][] = ["Bank Offer", "Special Price", "Coupon", "Cashback"];
  const discountTypes: OfferDraft["discountType"][] = ["FLAT", "PERCENTAGE"];

  useEffect(() => { }, []);

  // handle input changes for draft
  const setDraftField = <K extends keyof OfferDraft>(key: K, value: OfferDraft[K]) => {
    setDraft(prev => ({ ...prev, [key]: value }));
    if (draftErrors[key as string]) {
      setDraftErrors(prev => {
        const copy = { ...prev };
        delete copy[key as string];
        return copy;
      });
    }
  };

  // Add offer
  const addOffer = () => {
    const parsed = offerSchema.safeParse(draft);

    if (!parsed.success) {
      const zErrs: Record<string, string> = {};
      parsed.error.errors.forEach(e => {
        const key = e.path[0] ? String(e.path[0]) : "_";
        zErrs[key] = e.message;
      });
      setDraftErrors(zErrs);
      return;
    }

    append(parsed.data);
    setDraft({
      type: "Bank Offer",
      description: "",
      discountType: "FLAT",
      discountValue: 0,
      minPurchaseAmount: 0,
      maxDiscountAmount: 0,
      validFrom: "",
      validTill: "",
      terms: "",
    });
    setDraftErrors({});
  };

  const openModal = (index: number) => {
    setModalIndex(index);
    setShowModal(true);
  };

  const closeModal = () => {
    setModalIndex(null);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Active Input Row (local draft) */}
      <div className=" border rounded-md space-y-2 bg-white shadow-sm">
      <CardHeader>
        <CardTitle>Offers Information</CardTitle>
        <CardDescription>
          Enter offer details for the product
        </CardDescription>
      </CardHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6">
          <div>
            <label className="block text-sm font-medium">Offer Type</label>
            <select
              value={draft.type}
              onChange={(e) => setDraftField("type", e.target.value as OfferDraft["type"])}
              className="border p-2 rounded w-full"
            >
              <option value="">Select Type</option>
              {offerTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {draftErrors.type && <p className="text-red-500 text-sm">{draftErrors.type}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Description</label>
            <textarea
              value={draft.description}
              onChange={(e) => setDraftField("description", e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="Enter description (max 100 chars)"
              maxLength={100}
            />
            {draftErrors.description && <p className="text-red-500 text-sm">{draftErrors.description}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-6">
          <div>
            <label className="block text-sm font-medium">Discount Type</label>
            <select
              value={draft.discountType}
              onChange={(e) => setDraftField("discountType", e.target.value as OfferDraft["discountType"])}
              className="border p-2 rounded w-full"
            >
              {discountTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {draftErrors.discountType && <p className="text-red-500 text-sm">{draftErrors.discountType}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Discount Value</label>
            <input
              type="number"
              value={draft.discountValue}
              onChange={(e) => setDraftField("discountValue", Number(e.target.value))}
              className="border p-2 rounded w-full"
            />
            {draftErrors.discountValue && <p className="text-red-500 text-sm">{draftErrors.discountValue}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Min Purchase Amount</label>
            <input
              type="number"
              value={draft.minPurchaseAmount ?? 0}
              onChange={(e) => setDraftField("minPurchaseAmount", Number(e.target.value))}
              className="border p-2 rounded w-full"
            />
            {draftErrors.minPurchaseAmount && <p className="text-red-500 text-sm">{draftErrors.minPurchaseAmount}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Max Discount Amount</label>
            <input
              type="number"
              value={draft.maxDiscountAmount ?? 0}
              onChange={(e) => setDraftField("maxDiscountAmount", Number(e.target.value))}
              className="border p-2 rounded w-full"
            />
            {draftErrors.maxDiscountAmount && <p className="text-red-500 text-sm">{draftErrors.maxDiscountAmount}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6">
          <div>
            <label className="block text-sm font-medium">Valid From</label>
            <input
              type="date"
              value={draft.validFrom ?? ""}
              onChange={(e) => setDraftField("validFrom", e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Valid Till</label>
            <input
              type="date"
              value={draft.validTill ?? ""}
              onChange={(e) => setDraftField("validTill", e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>

        <div className="px-6">
          <label className="block text-sm font-medium">Terms & Conditions</label>
          <textarea
            value={draft.terms ?? ""}
            onChange={(e) => setDraftField("terms", e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="flex gap-2 px-6 py-4">
          <Button type="button" onClick={addOffer}>
            Add Offer
          </Button>
        </div>
      </div>

      {/* Mini Preview of Added Offers */}
      {fields.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Added Offers</h3>
          {fields.map((field, index) => {
            const o = offersWatch[index] || field;
            return (
              <div key={field.id} className="p-2 border rounded flex justify-between items-center bg-gray-50">
                <div>
                  <span className="font-bold">{o?.type}</span>
                  <p className="text-gray-500 text-sm">{String(o?.description ?? "").slice(0, 100)}</p>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => openModal(index)}>
                    <EyeIcon className="w-4 h-4" />
                  </Button>
                  <Button type="button" variant="destructive" onClick={() => remove(index)}>
                    <Trash2Icon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Preview */}
      {modalIndex !== null && modalIndex >= 0 && modalIndex < offersWatch.length && (
        <Dialog open={showModal} onOpenChange={(open) => setShowModal(open)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{offersWatch[modalIndex]?.type}</DialogTitle>
              <DialogClose onClick={closeModal} />
            </DialogHeader>
            <div className="space-y-2 mt-2">
              <p><strong>Description:</strong> {offersWatch[modalIndex]?.description}</p>
              <p><strong>Discount Type:</strong> {offersWatch[modalIndex]?.discountType}</p>
              <p><strong>Discount Value:</strong> {String(offersWatch[modalIndex]?.discountValue)}</p>
              <p><strong>Min Purchase:</strong> {String(offersWatch[modalIndex]?.minPurchaseAmount)}</p>
              <p><strong>Max Discount:</strong> {String(offersWatch[modalIndex]?.maxDiscountAmount)}</p>
              <p><strong>Valid From:</strong> {offersWatch[modalIndex]?.validFrom}</p>
              <p><strong>Valid Till:</strong> {offersWatch[modalIndex]?.validTill}</p>
              <p><strong>Terms:</strong> {offersWatch[modalIndex]?.terms}</p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
