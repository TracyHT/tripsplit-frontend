import React from "react";
import { Quote } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
}

const Testimonials: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      name: "Sarah Johnson",
      role: "Travel Enthusiast",
      avatar: "SJ",
      content:
        "TripSplit made our group vacation to Europe so much easier! No more awkward conversations about who owes what. Everything was transparent and fair.",
      rating: 5,
    },
    {
      name: "Mike Chen",
      role: "Software Engineer",
      avatar: "MC",
      content:
        "As someone who splits rent with roommates, this app is a lifesaver. Simple, clean interface and does exactly what it promises. Highly recommend!",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Event Organizer",
      avatar: "ER",
      content:
        "I've used other expense splitting apps, but TripSplit is by far the most intuitive. The settlement algorithm is brilliant - minimizes transactions perfectly.",
      rating: 5,
    },
    {
      name: "James Williams",
      role: "College Student",
      avatar: "JW",
      content:
        "Perfect for splitting pizza bills with friends! Love that it's completely free and works great on mobile. No annoying ads or premium features.",
      rating: 5,
    },
    {
      name: "Lisa Park",
      role: "Marketing Manager",
      avatar: "LP",
      content:
        "Used this for our team retreat. Everyone could track expenses in real-time and settling up was painless. Will definitely use again!",
      rating: 5,
    },
    {
      name: "David Brown",
      role: "Freelancer",
      avatar: "DB",
      content:
        "Clean design, no unnecessary features, just does what it needs to do perfectly. Exactly what I was looking for in an expense splitter.",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 md:py-28 lg:py-32 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            <Quote size={14} /> Testimonials
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-foreground mb-4">
            Loved by thousands of users
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-muted-foreground">
            See what our community has to say about splitting expenses with
            TripSplit
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 text-left">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-card p-6 md:p-8 rounded-xl shadow-soft hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-border group"
            >
              {/* Quote icon */}
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Quote size={20} />
              </div>

              {/* Rating stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>

              {/* Content */}
              <p className="text-sm md:text-base text-gray-600 dark:text-muted-foreground leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-border">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 text-white flex items-center justify-center font-semibold text-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-foreground text-sm">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-12 md:mt-16 text-center">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            <div className="flex flex-col items-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-1">
                4.9/5
              </div>
              <div className="text-xs md:text-sm text-gray-500 dark:text-muted-foreground">
                Average Rating
              </div>
            </div>
            <div className="w-px h-12 bg-gray-200 dark:bg-border hidden sm:block"></div>
            <div className="flex flex-col items-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-1">
                2,000+
              </div>
              <div className="text-xs md:text-sm text-gray-500 dark:text-muted-foreground">
                Happy Users
              </div>
            </div>
            <div className="w-px h-12 bg-gray-200 dark:bg-border hidden sm:block"></div>
            <div className="flex flex-col items-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-1">
                500+
              </div>
              <div className="text-xs md:text-sm text-gray-500 dark:text-muted-foreground">
                5-Star Reviews
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
