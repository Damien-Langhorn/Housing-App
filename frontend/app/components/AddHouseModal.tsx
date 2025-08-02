import React, { useState } from "react";
import { useAuth } from "@clerk/nextjs";

type AddHouseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: {
    user_id?: string; // Optional, can be set from useAuth
    _id?: string; // Optional, can be set from the backend
    address: string;
    postal_code: string;
    city: string;
    state: string;
    price: string;
    bedrooms: string;
    bathrooms: string;
    square_feet: string;
    year_built: string;
    image: string | File; // Allow for file upload
  }) => void;
};

const AddHouseModal = ({ isOpen, onClose, onSubmit }: AddHouseModalProps) => {
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
    image: "",
    clerk_id: userId, // Assuming clerkId is needed for submission
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit(form);
    setForm({
      address: "",
      postal_code: "",
      city: "",
      state: "",
      price: "",
      bedrooms: "",
      bathrooms: "",
      square_feet: "",
      year_built: "",
      image: "",
      clerk_id: userId, // Reset clerkId if needed
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-base-300 p-8 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Add a House</h2>
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
            type="number"
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
          <input
            type="file"
            className="input input-bordered w-full"
            name="image"
            placeholder="Upload Image"
            value={form.image}
            onChange={handleChange}
            required
          />
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" className="btn btn-error" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-neutral">
              Add House
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHouseModal;
