"use client";
import "./index.css";

import { Header } from "./_features/Header";
import { Footer } from "./_features/Footer";
import { HeroSection } from "./_features/HeroSection";
import FoodList from "./_features/FoodList";

export default function Home() {
  return (
    <div className="w-[1440px] m-auto bg-neutral-700">
      <Header />
      <HeroSection />
      <FoodList />
      <Footer />
    </div>
  );
}
