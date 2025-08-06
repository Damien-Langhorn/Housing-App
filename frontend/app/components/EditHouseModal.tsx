"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import type { House } from "./HouseCards";

type EditHouseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  house: House; // Pre-populate with existing house data
};

const EditHouseModal = ({
  isOpen,
  onClose,
  onSubmit,
  house,
}: EditHouseModalProps) => {
  const { userId } = useAuth();

  const [form, setForm] = useState({
    address: "",
    postal_code: "",
    city: "",
    state: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    square_feet: "",
    year_built: "",
    image: null as File | null,
    clerk_id: userId,
  });

  // Pre-populate form when house data changes
  useEffect(() => {
    if (house) {
      setForm({
        address: house.address || "",
        postal_code: house.postal_code || "",
        city: house.city || "",
        state: house.state || "",
        price: house.price?.toString() || "",
        bedrooms: house.bedrooms?.toString() || "",
        bathrooms: house.bathrooms?.toString() || "",
        square_feet: house.square_feet?.toString() || "",
        year_built: house.year_built?.toString() || "",
        image: null, // Don't pre-populate file input
        clerk_id: userId,
      });
    }
  }, [house, userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, image: e.target.files[0] });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();

    // Append all text fields
    formData.append("address", form.address);
    formData.append("postal_code", form.postal_code);
    formData.append("city", form.city);
    formData.append("state", form.state);
    formData.append("price", form.price);
    formData.append("bedrooms", form.bedrooms);
    formData.append("bathrooms", form.bathrooms);
    formData.append("square_feet", form.square_feet);
    formData.append("year_built", form.year_built);

    // Only append image if a new one is selected
    if (form.image) {
      formData.append("image", form.image);
    }

    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-base-300 p-8 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Edit House</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className="input input-bordered w-full"
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            required
          />
          <input
            className="input input-bordered w-full"
            name="postal_code"
            placeholder="Postal Code"
            type="text"
            value={form.postal_code}
            onChange={handleChange}
            required
          />
          <input
            className="input input-bordered w-full"
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            required
          />
          <input
            className="input input-bordered w-full"
            name="state"
            placeholder="State"
            value={form.state}
            onChange={handleChange}
            required
          />
          <input
            className="input input-bordered w-full"
            name="price"
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={handleChange}
            required
          />
          <input
            className="input input-bordered w-full"
            name="bedrooms"
            placeholder="Bedrooms"
            type="number"
            value={form.bedrooms}
            onChange={handleChange}
            required
          />
          <input
            className="input input-bordered w-full"
            name="bathrooms"
            placeholder="Bathrooms"
            type="number"
            value={form.bathrooms}
            onChange={handleChange}
            required
          />
          <input
            className="input input-bordered w-full"
            name="square_feet"
            placeholder="Square Feet"
            type="number"
            value={form.square_feet}
            onChange={handleChange}
            required
          />
          <input
            className="input input-bordered w-full"
            name="year_built"
            placeholder="Year Built"
            type="number"
            value={form.year_built}
            onChange={handleChange}
            required
          />
          <div className="space-y-2">
            <label className="text-sm text-gray-600">
              Current image will be kept unless you select a new one
            </label>
            <input
              type="file"
              className="input input-bordered w-full"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" className="btn btn-error" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Update House
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditHouseModal;
