import React from "react";
import Link from "next/link";
import Image from "next/image";

export type House = {
  user_id?: string;
  _id: string;
  image: string;
  city: string;
  state: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  address: string;
  postal_code: string;
  year_built: number;
};

type HouseCardsProps = {
  house: House;
};

const HouseCards = ({ house }: HouseCardsProps) => {
  return (
    <div className="flex justify-center items-center p-4">
      <div className="card bg-base-100 w-96 shadow-sm">
        <Link href={`/houses/${house._id}`}>
          <Image src={house.image} width={500} height={500} alt="House Image" />
        </Link>
        <div className="card-body">
          <h2 className="card-title">
            {house.city}, {house.state}
          </h2>
          <p>${Math.round(house.price)}</p>
          <p>
            {house.bedrooms} {house.bedrooms === 1 ? "Bedroom" : "Bedrooms"} |{" "}
            {house.bathrooms} {house.bathrooms === 1 ? "Bathroom" : "Bathrooms"}{" "}
            | {house.square_feet} sqft
          </p>
          <p>
            {house.address}, {house.postal_code}
          </p>
          <p>Year Built: {house.year_built}</p>
        </div>
      </div>
    </div>
  );
};

export default HouseCards;
