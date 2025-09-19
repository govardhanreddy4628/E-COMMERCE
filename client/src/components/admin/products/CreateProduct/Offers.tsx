import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// ----------------- Zod Schema -----------------
const OfferSchema = z.object({
  type: z.string().min(1, "Offer type is required"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  discountType: z.enum(["percentage", "flat"]),
  discountValue: z.number().min(1, "Discount value must be greater than 0"),
  minOrderValue: z.number().min(0, "Min order value cannot be negative"),
  maxDiscount: z.number().optional(),
  validTill: z.string().min(1, "Valid till date is required"), // ISO string
  terms: z.string().optional(),
});

const OffersSchema = z.object({
  offers: z.array(OfferSchema).min(1, "At least one offer is required"),
});

type OfferFormType = z.infer<typeof OffersSchema>;

// ----------------- Component -----------------
const OffersForm: React.FC = () => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OfferFormType>({
    resolver: zodResolver(OffersSchema),
    defaultValues: {
      offers: [
        {
          type: "",
          description: "",
          discountType: "percentage",
          discountValue: 0,
          minOrderValue: 0,
          maxDiscount: undefined,
          validTill: "",
          terms: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "offers",
  });

  const onSubmit = (data: OfferFormType) => {
    console.log("✅ Final Offer Data:", data);
    // axios.post("/api/offers", data)
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Manage Offers</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="border p-4 rounded-lg mb-4 bg-gray-50 space-y-3"
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Type */}
              <div>
                <label className="block text-sm font-medium">Type</label>
                <input
                  {...register(`offers.${index}.type`)}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Bank Offer"
                />
                {errors.offers?.[index]?.type && (
                  <p className="text-red-500 text-sm">
                    {errors.offers[index]?.type?.message}
                  </p>
                )}
              </div>

              {/* Discount Type */}
              <div>
                <label className="block text-sm font-medium">Discount Type</label>
                <select
                  {...register(`offers.${index}.discountType`)}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="percentage">Percentage</option>
                  <option value="flat">Flat</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                {...register(`offers.${index}.description`)}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Enter offer description..."
              />
              {errors.offers?.[index]?.description && (
                <p className="text-red-500 text-sm">
                  {errors.offers[index]?.description?.message}
                </p>
              )}
            </div>

            {/* Discount Value, Min Order, Max Discount */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium">Discount Value</label>
                <input
                  type="number"
                  {...register(`offers.${index}.discountValue`, {
                    valueAsNumber: true,
                  })}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Min Order Value</label>
                <input
                  type="number"
                  {...register(`offers.${index}.minOrderValue`, {
                    valueAsNumber: true,
                  })}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="250"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Max Discount</label>
                <input
                  type="number"
                  {...register(`offers.${index}.maxDiscount`, {
                    valueAsNumber: true,
                  })}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="50"
                />
              </div>
            </div>

            {/* Valid Till */}
            <div>
              <label className="block text-sm font-medium">Valid Till</label>
              <input
                type="date"
                {...register(`offers.${index}.validTill`)}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            {/* Terms */}
            <div>
              <label className="block text-sm font-medium">Terms</label>
              <textarea
                {...register(`offers.${index}.terms`)}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Enter terms and conditions..."
              />
            </div>

            {/* Remove Button */}
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-600 hover:text-red-800"
            >
              ✕ Remove Offer
            </button>
          </div>
        ))}

        {/* Add New Offer */}
        <button
          type="button"
          onClick={() =>
            append({
              type: "",
              description: "",
              discountType: "percentage",
              discountValue: 0,
              minOrderValue: 0,
              maxDiscount: undefined,
              validTill: "",
              terms: "",
            })
          }
          className="mb-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Offer
        </button>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500"
          >
            Reset
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Save Offers
          </button>
        </div>
      </form>
    </div>
  );
};

export default OffersForm;
