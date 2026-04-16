'use client';

import React from "react";
import { CircularTestimonials } from '@/components/ui/circular-testimonials';

const blogPosts = [
  {
    quote: "Explore how our team transforms spacious 3 BHK apartments into sophisticated living spaces that blend functionality with high-end aesthetics.",
    name: "Luxury 3 BHK Interior Design: Creating Timeless Elegance",
    designation: "Residential | Bedroom Design",
    src: "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1368&auto=format&fit=crop",
  },
  {
    quote: "The evolution of workspace design and how to create productive environments tailored for the hybrid work model.",
    name: "Modern Office Design Trends for 2026",
    designation: "Commercial | Office Trends",
    src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1368&auto=format&fit=crop",
  },
  {
    quote: "Essential tips for creating a kitchen that's both beautiful and highly functional for modern cooking lifestyles.",
    name: "The Culinary Studio: Functional Kitchen Excellence",
    designation: "Kitchen Design | Kitchen Design",
    src: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1368&auto=format&fit=crop",
  },
];

export const BlogPostsCircularDemo = () => (
  <section className="py-20 bg-white">
    <div className="container mx-auto flex justify-center">
        <CircularTestimonials
          testimonials={blogPosts}
          autoplay={true}
          colors={{
            name: "#0A1B3D",
            designation: "#D9E021",
            testimony: "#444",
            arrowBackground: "#0A1B3D",
            arrowForeground: "#fff",
            arrowHoverBackground: "#D9E021",
          }}
          fontSizes={{
            name: "32px",
            designation: "18px",
            quote: "20px",
          }}
        />
    </div>
  </section>
);
