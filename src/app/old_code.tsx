"use client";

import { Montserrat } from "next/font/google";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

import {
  FaShoppingCart,
  FaMoon,
  FaSun,
  FaPlus,
  FaMinus,
  FaCheck,
  FaStar,
  FaChevronRight,
  FaTimes,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaClock,
  FaGift,
  FaBirthdayCake,
  FaGlassCheers,
  FaRegCreditCard,
  FaUser,
  FaHome,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";

const montserrat = Montserrat({ subsets: ["latin"] });

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  featured: boolean;
}

interface Service {
  id: string;
  name: string;
  description: string;
  image: string;
  basePrice: number;
  category: string;
  types: ServiceType[];
  featured: boolean;
}

interface ServiceType {
  id: string;
  name: string;
  priceMultiplier: number;
  description: string;
}

interface CartItem {
  id: string;
  type: "product" | "service";
  item: Product | Service;
  quantity: number;
  selectedType?: string;
  eventDate?: string;
  eventTime?: string;
  comments?: string;
}

interface Testimonial {
  id: string;
  name: string;
  image: string;
  text: string;
  rating: number;
}

interface CreditCardInfo {
  number: string;
  name: string;
  expiry: string;
  cvc: string;
  address: string;
  city: string;
  zip: string;
}

const mockProducts: Product[] = [
  {
    id: "p1",
    name: "Balloon Bouquet",
    description:
      "A stunning arrangement of pastel-colored balloons perfect for baby showers, gender reveals, or spring celebrations.",
    image:
      "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=2070&auto=format&fit=crop",
    price: 29.99,
    category: "Balloons",
    featured: true,
  },
  {
    id: "p2",
    name: "Gold Party Tableware",
    description:
      "Complete set of gold-colored plates, cups, napkins, and cutlery for 12 guests. Adds elegance to any celebration.",
    image:
      "https://images.unsplash.com/photo-1620022604911-126743712882?q=80&w=1887&auto=format&fit=crop",
    price: 34.99,
    category: "Tableware",
    featured: true,
  },
  {
    id: "p3",
    name: "LED String Lights - Fairy",
    description:
      "Create a magical atmosphere with these warm white LED string lights. Perfect for indoor and outdoor use.",
    image:
      "https://plus.unsplash.com/premium_photo-1664790560108-68d81ca35c0d?q=80&w=2070&auto=format&fit=crop",
    price: 19.99,
    category: "Lighting",
    featured: false,
  },
  {
    id: "p4",
    name: "Confetti Cannon Set",
    description:
      "Set of 10 confetti cannons with colorful biodegradable confetti for dramatic party moments.",
    image:
      "https://images.unsplash.com/photo-1481162854517-d9e353af153d?q=80&w=2064&auto=format&fit=crop",
    price: 24.99,
    category: "Party Effects",
    featured: false,
  },
  {
    id: "p5",
    name: "Photo Booth Props Kit",
    description:
      "30 fun and quirky photo booth props including glasses, mustaches, lips, and quotes on sticks.",
    image:
      "https://images.unsplash.com/photo-1525268771113-32d9e9021a97?q=80&w=2080&auto=format&fit=crop",
    price: 18.99,
    category: "Photo Props",
    featured: true,
  },
  {
    id: "p6",
    name: "Party Banner",
    description:
      'Colorful "Happy Birthday" banner with glitter letters. Reusable and easy to hang.',
    image:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=2070&auto=format&fit=crop",
    price: 12.99,
    category: "Decorations",
    featured: false,
  },
  {
    id: "p7",
    name: "Party Favor Bags - Set of 24",
    description:
      "Stylish kraft paper gift bags with handles, perfect for party favors and small gifts.",
    image:
      "https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?q=80&w=2070&auto=format&fit=crop",
    price: 15.99,
    category: "Party Favors",
    featured: false,
  },
  {
    id: "p8",
    name: "Champagne Flutes - Set of 12",
    description:
      "Elegant plastic champagne flutes, perfect for toasts at weddings and celebrations.",
    image:
      "https://images.unsplash.com/photo-1547595628-c61a29f496f0?q=80&w=2013&auto=format&fit=crop",
    price: 22.99,
    category: "Tableware",
    featured: false,
  },
];

const mockServices: Service[] = [
  {
    id: "s1",
    name: "Full Party Planning",
    description:
      "Complete party planning service including theme development, venue selection, catering coordination, and decor setup.",
    image:
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070&auto=format&fit=crop",
    basePrice: 499.99,
    category: "Planning",
    types: [
      {
        id: "st1",
        name: "Basic",
        priceMultiplier: 1,
        description: "Up to 30 guests, 4 hours of planning",
      },
      {
        id: "st2",
        name: "Premium",
        priceMultiplier: 1.5,
        description: "Up to 60 guests, 8 hours of planning",
      },
      {
        id: "st3",
        name: "Luxury",
        priceMultiplier: 2.5,
        description: "100+ guests, unlimited planning hours",
      },
    ],
    featured: true,
  },
  {
    id: "s2",
    name: "Balloon Decor",
    description:
      "Professional balloon arch, column, or garland installation to make your event pop with color and style.",
    image:
      "https://images.unsplash.com/photo-1646077412075-4a5816c952b5?q=80&w=2127&auto=format&fit=crop",
    basePrice: 199.99,
    category: "Installation",
    types: [
      {
        id: "st1",
        name: "Standard",
        priceMultiplier: 1,
        description: "Single balloon arch or column",
      },
      {
        id: "st2",
        name: "Deluxe",
        priceMultiplier: 1.6,
        description: "Balloon arch and 2 columns",
      },
      {
        id: "st3",
        name: "Extravagant",
        priceMultiplier: 2.2,
        description: "Custom balloon sculpture and ceiling.",
      },
    ],
    featured: false,
  },
  {
    id: "s3",
    name: "DJ & Sound System",
    description:
      "Professional DJ service with high-quality sound system, lighting effects, and personalized playlist creation.",
    image:
      "https://images.unsplash.com/photo-1682289385886-f92e712e420f?q=80&w=2070&auto=format&fit=crop",
    basePrice: 349.99,
    category: "Music",
    types: [
      {
        id: "st1",
        name: "Basic",
        priceMultiplier: 1,
        description: "4 hours, standard sound system",
      },
      {
        id: "st2",
        name: "Pro",
        priceMultiplier: 1.4,
        description: "6 hours, enhanced sound & basic lighting",
      },
      {
        id: "st3",
        name: "Premium",
        priceMultiplier: 2,
        description: "8 hours, full sound & lighting production",
      },
    ],
    featured: true,
  },
  {
    id: "s4",
    name: "Catering Service",
    description:
      "Delicious food and beverage catering options, including setup, service, and cleanup.",
    image:
      "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070&auto=format&fit=crop",
    basePrice: 299.99,
    category: "Food",
    types: [
      {
        id: "st1",
        name: "Appetizers",
        priceMultiplier: 1,
        description: "Selection of finger foods and appetizers",
      },
      {
        id: "st2",
        name: "Buffet",
        priceMultiplier: 1.7,
        description: "Full buffet with variety of options",
      },
      {
        id: "st3",
        name: "Plated Dinner",
        priceMultiplier: 2.3,
        description: "Elegant plated multi-course meal with service",
      },
    ],
    featured: false,
  },
  {
    id: "s4",
    name: "Catering Service",
    description:
      "Delicious food and beverage catering options, including setup, service, and cleanup.",
    image:
      "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070&auto=format&fit=crop",
    basePrice: 299.99,
    category: "Food",
    types: [
      {
        id: "st1",
        name: "Appetizers",
        priceMultiplier: 1,
        description: "Selection of finger foods and appetizers",
      },
      {
        id: "st2",
        name: "Buffet",
        priceMultiplier: 1.7,
        description: "Full buffet with variety of options",
      },
      {
        id: "st3",
        name: "Plated Dinner",
        priceMultiplier: 2.3,
        description: "Elegant plated multi-course meal with service",
      },
    ],
    featured: false,
  },
];

const mockTestimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Emily Johnson",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2076&auto=format&fit=crop",
    text: "PartyTime transformed my daughter's sweet sixteen into a magical event! The balloon decor was beautiful and the DJ kept everyone dancing all night. 😍",
    rating: 5,
  },
  {
    id: "t2",
    name: "Michael Oliveira",
    image:
      "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=1974&auto=format&fit=crop",
    text: "The full party planning service was worth every penny. They handled everything, and I was able to enjoy my anniversary party without any stress. 🔔",
    rating: 5,
  },
  {
    id: "t3",
    name: "Havij Williams",
    image:
      "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?q=80&w=1974&auto=format&fit=crop",
    text: "I ordered decorations for my baby shower and was amazed by the quality. The balloon bouquet was even more beautiful than the pictures!",
    rating: 4,
  },
  {
    id: "t4",
    name: "David Allen",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop",
    text: "Our corporate event was a huge success, and many colleagues asked for PartyTime's contact information. 👀",
    rating: 5,
  },
  {
    id: "t5",
    name: "Matcha Brown",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop",
    text: "From the initial consultation to the day of our wedding, PartyTime's attention to detail was impeccable.",
    rating: 5,
  },
];

const productCategories = [
  "All",
  "Balloons",
  "Tableware",
  "Decorations",
  "Lighting",
  "Party Effects",
  "Photo Props",
  "Party Favors",
];
const serviceCategories = ["All", "Planning", "Installation", "Music", "Food"];

export default function Index() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [viewAllProducts, setViewAllProducts] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductCategory, setSelectedProductCategory] = useState("All");
  const [selectedServiceCategory, setSelectedServiceCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedServiceOptions, setSelectedServiceOptions] = useState<
    Record<string, string>
  >({});

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const hasServices = cartItems.some((item) => item.type === "service");
  const [creditCardInfo, setCreditCardInfo] = useState<CreditCardInfo>({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
    address: "",
    city: "",
    zip: "",
  });
  const [eventDetails, setEventDetails] = useState({
    date: "",
    time: "",
    comments: "",
  });
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);

  const [cardErrors, setCardErrors] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
    address: "",
    city: "",
    zip: "",
  });

  const productsRef = useRef(null);
  const servicesRef = useRef(null);
  const testimonialsRef = useRef(null);
  const productScrollRef = useRef<HTMLDivElement>(null);
  const productsInView = useInView(productsRef, { once: false, amount: 0.1 });
  const servicesInView = useInView(servicesRef, { once: false, amount: 0.1 });

  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const [darkMode, setDarkMode] = useState(false);

  // ── Scroll-to-top helper ─────────────────────────────────
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  useEffect(() => {
    const onScroll = () => setIsVisible(window.scrollY > 400); // show after 400 px
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % mockTestimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const openCart = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const addProductToCart = (product: Product) => {
    const existingItemIndex = cartItems.findIndex(
      (item) => item.id === product.id && item.type === "product"
    );

    if (existingItemIndex >= 0) {
      const newCartItems = [...cartItems];
      newCartItems[existingItemIndex].quantity += 1;
      setCartItems(newCartItems);
    } else {
      setCartItems([
        ...cartItems,
        {
          id: product.id,
          type: "product",
          item: product,
          quantity: 1,
        },
      ]);
    }
  };

  // const addServiceToCart = (service: Service) => {
  //   const serviceType = selectedServiceOptions[service.id] || service.types[0].id;
  //   const serviceTypeObj = service.types.find(type => type.id === serviceType);

  //   if (!serviceTypeObj) return;

  //   const existingItemIndex = cartItems.findIndex(
  //     item => item.id === `${service.id}-${serviceType}` && item.type === 'service'
  //   );

  //   if (existingItemIndex >= 0) {
  //     return;
  //   } else {
  //     setCartItems([
  //       ...cartItems,
  //       {
  //         id: `${service.id}-${serviceType}`,
  //         type: 'service',
  //         item: service,
  //         quantity: 1,
  //         selectedType: serviceType
  //       }
  //     ]);
  //   }
  // };

  const addServiceToCart = (service: Service) => {
    // determine which package/type is currently chosen
    const serviceType =
      selectedServiceOptions[service.id] || service.types[0].id;

    const serviceTypeObj = service.types.find((t) => t.id === serviceType);
    if (!serviceTypeObj) return; // safety guard: unknown package

    // use functional update to avoid stale state
    setCartItems((prev) => {
      const entryId = `${service.id}-${serviceType}`;
      const idx = prev.findIndex(
        (item) => item.id === entryId && item.type === "service"
      );

      if (idx >= 0) {
        // 🔼 increment existing service-item quantity
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          quantity: updated[idx].quantity + 1,
        };
        return updated;
      }

      // ➕ push new service-item
      return [
        ...prev,
        {
          id: entryId,
          type: "service",
          item: service,
          quantity: 1,
          selectedType: serviceType,
        },
      ];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    const existingItemIndex = cartItems.findIndex(
      (item) => item.id === cartItemId
    );

    if (existingItemIndex >= 0) {
      const newCartItems = [...cartItems];
      if (newCartItems[existingItemIndex].quantity > 1) {
        newCartItems[existingItemIndex].quantity -= 1;
        setCartItems(newCartItems);
      } else {
        setCartItems(cartItems.filter((item) => item.id !== cartItemId));
      }
    }
  };

  const getItemQuantity = (cartItemId: string): number => {
    const item = cartItems.find((item) => item.id === cartItemId);
    return item ? item.quantity : 0;
  };

  const getTotalItems = (): number => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getItemPrice = (item: CartItem): number => {
    if (item.type === "product") {
      return (item.item as Product).price;
    } else {
      const service = item.item as Service;
      const selectedType = service.types.find(
        (type) => type.id === item.selectedType
      );
      return selectedType
        ? service.basePrice * selectedType.priceMultiplier
        : service.basePrice;
    }
  };

  const getTotalPrice = (): number => {
    return cartItems.reduce((total, item) => {
      return total + getItemPrice(item) * item.quantity;
    }, 0);
  };

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedProductCategory === "All" ||
      product.category === selectedProductCategory;

    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const filteredServices = mockServices.filter((service) => {
    const matchesCategory =
      selectedServiceCategory === "All" ||
      service.category === selectedServiceCategory;
    return matchesCategory;
  });

  const openCheckout = () => {
    setIsCheckoutOpen(true);
    setIsCartOpen(false);
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
  };

  const handleServiceOptionChange = (serviceId: string, typeId: string) => {
    setSelectedServiceOptions({
      ...selectedServiceOptions,
      [serviceId]: typeId,
    });
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 0) {
      value = value.match(/.{1,4}/g)?.join(" ") || value;
    }

    value = value.substring(0, 19);

    setCreditCardInfo({ ...creditCardInfo, number: value });

    if (value.length > 0 && value.replace(/\s/g, "").length < 16) {
      setCardErrors({ ...cardErrors, number: "Card number must be 16 digits" });
    } else {
      setCardErrors({ ...cardErrors, number: "" });
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }

    setCreditCardInfo({ ...creditCardInfo, expiry: value });

    if (value.length > 0) {
      const [month, year] = value.split("/");
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;

      const numMonth = parseInt(month || "0");
      const numYear = parseInt(year || "0");

      if (numMonth < 1 || numMonth > 12) {
        setCardErrors({ ...cardErrors, expiry: "Invalid month" });
      } else if (
        numYear < currentYear ||
        (numYear === currentYear && numMonth < currentMonth)
      ) {
        setCardErrors({ ...cardErrors, expiry: "Card expired" });
      } else {
        setCardErrors({ ...cardErrors, expiry: "" });
      }
    } else {
      setCardErrors({ ...cardErrors, expiry: "" });
    }
  };

  const handleCVCChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").substring(0, 3);
    setCreditCardInfo({ ...creditCardInfo, cvc: value });

    if (value.length > 0 && value.length < 3) {
      setCardErrors({ ...cardErrors, cvc: "CVC must be 3 digits" });
    } else {
      setCardErrors({ ...cardErrors, cvc: "" });
    }
  };

  const isFormValid = () => {
    const hasErrors = Object.values(cardErrors).some((error) => error !== "");

    const requiredFields = [
      creditCardInfo.number,
      creditCardInfo.name,
      creditCardInfo.expiry,
      creditCardInfo.cvc,
      creditCardInfo.address,
      creditCardInfo.city,
      creditCardInfo.zip,
    ];

    const allFieldsFilled = requiredFields.every(
      (field) => field.trim() !== ""
    );

    const hasServices = cartItems.some((item) => item.type === "service");

    if (hasServices) {
      return (
        !hasErrors && allFieldsFilled && eventDetails.date && eventDetails.time
      );
    }

    return !hasErrors && allFieldsFilled;
  };

  const placeOrder = () => {
    if (!isFormValid()) return;

    setIsOrdering(true);

    setTimeout(() => {
      setIsOrdering(false);
      setCheckoutStep(3);
    }, 2000);
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isCartOpen || isCheckoutOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isCartOpen, isCheckoutOpen]);

  // useEffect(() => {
  //   const el = productScrollRef.current;
  //   if (!el) return;

  //   /* Hide scrollbar (Firefox / legacy Edge) */
  //   el.style.scrollbarWidth = "none";
  //   (el.style as any).msOverflowStyle = "none";

  //   return () => clearInterval(id);
  // }, []);

  return (
    <div
      className={`min-h-screen ${darkMode ? "bg-[#121212]" : "bg-[#FFFBEA]"} ${
        montserrat.className
      }`}
    >
      <nav
        className={`sticky top-0 z-50 ${
          darkMode ? "bg-gray-800" : "bg-white"
        } shadow-md py-4`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center cursor-pointer">
            <span
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-[#264653]"
              }`}
            >
              Party
            </span>
            <span className="text-2xl font-bold text-[#e76f51]">Time</span>
            <FaGift className="ml-2 text-[#f4a261]" />
          </div>

          <div className="flex items-center gap-6">
            <button
              className={`${
                darkMode ? "text-white" : "text-[#264653]"
              } hover:text-[#e76f51] transition-colors cursor-pointer`}
              onClick={toggleDarkMode}
            >
              {darkMode ? (
                <FaSun className="h-5 w-5" />
              ) : (
                <FaMoon className="h-5 w-5" />
              )}
            </button>

            <motion.button
              className="relative cursor-pointer"
              onClick={openCart}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaShoppingCart
                className={`h-6 w-6 ${
                  darkMode ? "text-white" : "text-[#264653]"
                }`}
              />
              {getTotalItems() > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2.5 -right-2.5 bg-[#e76f51] text-white rounded-full border-white border w-5 h-5 flex items-center justify-center text-xs font-semibold"
                >
                  {getTotalItems()}
                </motion.span>
              )}
            </motion.button>
          </div>
        </div>
      </nav>

      <div className="relative z-10 py-20 flex items-center justify-center min-h-[70vh]">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1556125574-d7f27ec36a06?q=80&w=2070&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: darkMode ? "brightness(0.4)" : "brightness(0.8)",
          }}
        ></div>
        <div
          className={`absolute inset-0 ${
            darkMode
              ? "bg-gradient-to-b from-[#121212]/80 via-[#121212]/60 to-[#121212]/100"
              : "bg-gradient-to-b from-white/80 via-white/60 to-white/100"
          } z-0`}
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className={`${darkMode ? "text-white" : "text-[#264653]"}`}>
                Make Your Celebration
              </span>
              <span
                className={`${
                  darkMode ? "text-[#e76f51]" : "text-[#e76f51]"
                } block`}
              >
                Unforgettable
              </span>
            </h1>

            <p
              className={`text-xl ${
                darkMode ? "text-[#f4a261]" : "text-[#ce4257]"
              } font-semibold mb-8 leading-relaxed`}
            >
              From intimate gatherings to extravagant events, we provide
              everything you need to create the perfect party experience.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="flex items-center gap-2 px-6 py-3 bg-[#f4a261] text-white font-medium rounded-md shadow-lg hover:bg-[#e76f51] transition-colors mx-auto cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                onClick={() => scrollToSection("products")}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 6px 15px rgba(255, 0, 84, 0.4)",
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.95 }}
              >
                Shop Decorations <FaChevronRight className="h-4 w-4" />
              </motion.button>

              <motion.button
                className="flex items-center gap-2 px-6 py-3 bg-[#ce4257] text-white font-medium rounded-md shadow-lg hover:bg-rose-700/90 transition-colors mx-auto cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                onClick={() => scrollToSection("services")}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 6px 15px rgba(57, 0, 153, 0.4)",
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Services <FaChevronRight className="h-4 w-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ───── Party Decorations & Supplies ───── */}
      <div
        id="products"
        ref={productsRef}
        style={{
          padding: "4rem 0",
          backgroundColor: darkMode ? "#121212" : "#ffffff",
          overflow: "hidden", // clips WebKit scrollbar
        }}
      >
        <div
          style={{
            maxWidth: "80rem", // ≈ Tailwind max-w-7xl
            margin: "0 auto",
            padding: "0 1rem", // ≈ px-4 sm:px-6
          }}
        >
          {/* heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: "center", marginBottom: "3rem" }}
          >
            <h2
              className={`${
                darkMode ? "text-white/90" : "text-[#264653]"
              } text-2xl md:text-4xl font-semibold pb-4`}
            >
              Party Decorations&nbsp;&amp;&nbsp;Supplies
            </h2>
            <p className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Everything you need to create a stunning party atmosphere
            </p>
          </motion.div>

          {/* ───── FIRST VIEW : carousel ───── */}
          {!viewAllProducts ? (
            <>
              {/* wrapper hides WebKit scrollbar */}
              <div>
                {/* scroll container */}
                <div
                  ref={productScrollRef}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                  style={{
                    gap: "1.5rem", // gap-6
                    paddingBottom: "1.5rem",
                    alignItems: "center",
                    justifyItems: "center", // pb-6
                  }}
                >
                  {mockProducts.slice(0, 4).map((product, index) => (
                    <motion.div
                      key={product.id + index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={
                        productsInView
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: 20 }
                      }
                      transition={{ duration: 0.3, delay: 0.08 * index }}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      className={`${
                        darkMode
                          ? "bg-white/5"
                          : "bg-gray-50 border-amber-600/20"
                      } rounded-2xl  border-2 overflow-hidden `}
                    >
                      {/* image + featured badge */}
                      <div style={{ position: "relative" }}>
                        {product.featured && (
                          <span
                            style={{
                              position: "absolute",
                              top: "1rem",
                              left: "1rem",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.25rem",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              padding: "0.25rem 0.625rem",
                              borderRadius: "9999px",
                              backgroundColor: "#e76f51",
                              color: "#ffffff",
                              boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                              zIndex: 10,
                            }}
                          >
                            <FaStar style={{ width: 12, height: 12 }} />{" "}
                            Featured
                          </span>
                        )}
                        <div style={{ height: "12rem", overflow: "hidden" }}>
                          <img
                            src={product.image}
                            alt={product.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              transition: "transform 0.3s",
                            }}
                          />
                        </div>
                      </div>

                      {/* card content */}
                      <div style={{ padding: "0.75rem 1.5rem 1.5rem" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingBottom: "0.75rem",
                          }}
                        >
                          <h3
                            style={{
                              fontSize: "1.25rem",
                              fontWeight: 700,
                              color: darkMode ? "#ffff" : "#264653",
                              overflow: "hidden",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {product.name}
                          </h3>
                          <span
                            className={`${
                              darkMode
                                ? "bg-[#F0E6FF]/50 text-white"
                                : "bg-[#F0E6FF] text-[#264653]"
                            } text-center text-sm px-2 py-1 rounded-full  `}
                          >
                            {product.category}
                          </span>
                        </div>

                        <p
                          style={{
                            fontSize: "0.875rem",
                            color: darkMode ? "#f4a261" : "#4B5563",
                            marginBottom: "1rem",
                            height: "5rem",
                            overflow: "hidden",
                          }}
                        >
                          {product.description}
                        </p>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "1.25rem",
                              fontWeight: 600,
                              color: darkMode ? "#ffff" : "#e76f51",
                            }}
                          >
                            ${product.price.toFixed(2)}
                          </span>

                          {/* qty / add-to-cart */}
                          {getItemQuantity(product.id) > 0 ? (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                              }}
                            >
                              <motion.button
                                onClick={() => removeFromCart(product.id)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                style={{
                                  padding: "0.25rem",
                                  borderRadius: "9999px",
                                  backgroundColor: "#ce4257",
                                  color: "#ffffff",
                                  cursor: "pointer",
                                }}
                              >
                                <FaMinus style={{ width: 12, height: 12 }} />
                              </motion.button>

                              <span
                                style={{
                                  fontWeight: 600,
                                  color: darkMode ? "#ffff" : "#264653",
                                }}
                              >
                                {getItemQuantity(product.id)}
                              </span>

                              <motion.button
                                onClick={() => addProductToCart(product)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                style={{
                                  padding: "0.25rem",
                                  borderRadius: "9999px",
                                  backgroundColor: "#f4a261",
                                  color: "#ffffff",
                                  cursor: "pointer",
                                }}
                              >
                                <FaPlus style={{ width: 12, height: 12 }} />
                              </motion.button>
                            </div>
                          ) : (
                            <motion.button
                              onClick={() => addProductToCart(product)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.25rem",
                                padding: "0.25rem 0.75rem",
                                borderRadius: "0.375rem",
                                backgroundColor: "#f4a261",
                                color: "#ffffff",
                                fontSize: "0.875rem",
                                fontWeight: 500,
                                cursor: "pointer",
                              }}
                            >
                              <FaPlus style={{ width: 12, height: 12 }} />
                              Add&nbsp;to&nbsp;Cart
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* “View all” button */}
              <div style={{ textAlign: "center", marginTop: "2rem" }}>
                <motion.button
                  onClick={() => setViewAllProducts(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: "0.75rem 1.5rem",
                    borderRadius: "0.375rem",
                    backgroundColor: "#264653",
                    color: darkMode ? "#ffff" : "#ffffff",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  View&nbsp;All&nbsp;Products
                </motion.button>
              </div>
            </>
          ) : (
            /* ───── SECOND VIEW : full grid (left unchanged for brevity) ───── */
            /* Keep your existing “viewAllProducts” grid/search range markup.
               It can still use Tailwind classes if preferred; no effect on the
               hidden scrollbar or auto-scroll logic above. */

            <div>
              <div
                className={`mb-8 p-6 rounded-lg ${
                  darkMode ? "bg-[#264653]/20" : "bg-gray-100"
                }`}
              >
                <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSearch
                        className={
                          darkMode ? "text-[#f4a261]" : "text-gray-400"
                        }
                      />
                    </div>
                    <input
                      type="text"
                      className={`pl-10 pr-4 py-2 w-full rounded-md ${
                        darkMode
                          ? "bg-[#121212] text-white border-[#264653]"
                          : "bg-white border-gray-300 text-black"
                      } border focus:outline-none focus:ring-2 focus:ring-[#e76f51]`}
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-4">
                    <select
                      className={`px-4 py-2 rounded-md ${
                        darkMode
                          ? "bg-[#121212] text-white border-[#264653]"
                          : "bg-white border-gray-300 text-black"
                      } border focus:outline-none focus:ring-2 focus:ring-[#e76f51]`}
                      value={selectedProductCategory}
                      onChange={(e) =>
                        setSelectedProductCategory(e.target.value)
                      }
                    >
                      {productCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>

                    <button
                      className={`flex items-center gap-2 px-4 py-2 ${
                        darkMode
                          ? "bg-[#ce4257] hover:bg-[#e76f51]"
                          : "bg-[#ce4257] hover:bg-[#e76f51]"
                      } text-white rounded-md cursor-pointer`}
                      onClick={() => setViewAllProducts(false)}
                    >
                      <FaTimes className="h-4 w-4" />
                      Close
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={darkMode ? "text-white" : "text-[#264653]"}>
                    Price Range:
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={(priceRange[0] / 500) * 100}
                    onChange={(e) =>
                      setPriceRange([
                        parseInt(e.target.value) * 5,
                        priceRange[1],
                      ])
                    }
                    className="flex-1   accent-[#e76f51]"
                  />
                  <span
                    className={
                      darkMode
                        ? "text-white min-w-[40px]"
                        : "text-[#264653] min-w-[40px]"
                    }
                  >
                    ${priceRange[0]}
                  </span>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={(priceRange[1] / 500) * 100}
                    onChange={(e) =>
                      setPriceRange([
                        priceRange[0],
                        parseInt(e.target.value) * 5,
                      ])
                    }
                    className="flex-1 accent-[#e76f51]"
                  />
                  <span
                    className={
                      darkMode
                        ? "text-white min-w-[40px]"
                        : "text-[#264653] min-w-[40px]"
                    }
                  >
                    ${priceRange[1]}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id + "" + index}
                    className={`${
                      darkMode
                        ? "bg-white/5 border-[#264653]/30"
                        : "bg-white border-gray-200"
                    } 
                    rounded-xl shadow-md overflow-hidden border hover:shadow-xl transition-all duration-300 ease-in-out`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.05 * index,
                    }}
                    whileHover={{
                      y: -5,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <div className="relative">
                      {product.featured && (
                        <div className="absolute top-4 left-4 z-10">
                          <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#e76f51] text-white shadow-lg">
                            <FaStar className="h-3 w-3" /> Featured
                          </span>
                        </div>
                      )}

                      <div className="h-48 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3
                          className={`text-xl font-bold max-w-[14rem] ${
                            darkMode ? "text-white" : "text-[#264653]"
                          }`}
                        >
                          {product.name}
                        </h3>
                        <span
                          className={`text-sm font-medium px-2 py-1 rounded-full ${
                            darkMode
                              ? "bg-[#264653]/30 text-white"
                              : "bg-[#F0E6FF] text-[#264653]"
                          }`}
                        >
                          {product.category}
                        </span>
                      </div>

                      <p
                        className={`text-sm ${
                          darkMode ? "text-[#f4a261]" : "text-gray-600"
                        } mb-4 h-20 overflow-hidden`}
                      >
                        {product.description}
                      </p>

                      <div className="flex justify-between items-center py-auto mt-4">
                        <span
                          className={`text-xl font-bold ${
                            darkMode ? "text-white/80" : "text-[#e76f51]"
                          }`}
                        >
                          ${product.price.toFixed(2)}
                        </span>

                        <div>
                          {getItemQuantity(product.id) > 0 ? (
                            <div className="flex items-center gap-2">
                              <motion.button
                                onClick={() => removeFromCart(product.id)}
                                className="p-1 rounded-full bg-[#ce4257] text-white cursor-pointer"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <FaMinus className="h-3 w-3" />
                              </motion.button>

                              <span
                                className={`font-medium ${
                                  darkMode ? "text-white" : "text-[#264653]"
                                }`}
                              >
                                {getItemQuantity(product.id)}
                              </span>

                              <motion.button
                                onClick={() => addProductToCart(product)}
                                className="p-1 rounded-full bg-[#f4a261] text-white cursor-pointer"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <FaPlus className="h-3 w-3" />
                              </motion.button>
                            </div>
                          ) : (
                            <motion.button
                              onClick={() => addProductToCart(product)}
                              className="px-3 py-1 bg-[#f4a261] text-white rounded-md flex items-center gap-1 cursor-pointer"
                              whileHover={{
                                scale: 1.05,
                                backgroundColor: "#e76f51",
                              }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <FaPlus className="h-3 w-3" />
                              Add to Cart
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        className={`py-16 ${darkMode ? "bg-[#264653]/10" : "bg-[#FFF8E7]"}`}
        id="services"
        ref={servicesRef}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2
              className={`text-3xl font-bold ${
                darkMode ? "text-white" : "text-[#264653]"
              } mb-4`}
            >
              Professional Party Services
            </h2>
            <p
              className={`${
                darkMode ? "text-[#f4a261]" : "text-gray-600"
              } max-w-2xl mx-auto`}
            >
              Let our expert team handle every aspect of your celebration
            </p>

            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {serviceCategories.map((category, index) => (
                <motion.button
                  key={category + "" + index}
                  className={`px-4 py-2 rounded-md text-sm font-medium cursor-pointer
                    ${
                      selectedServiceCategory === category
                        ? darkMode
                          ? "bg-[#e76f51] text-white"
                          : "bg-[#e76f51] text-white"
                        : darkMode
                        ? "bg-[#121212] text-white"
                        : "bg-white text-[#264653]"
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedServiceCategory(category)}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <div className="grid overflow-hidden grid-cols-1 lg:grid-cols-2 gap-10">
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id + "" + index}
                className={` ${
                  darkMode
                    ? "bg-white/7 border-[#264653]/30"
                    : "bg-white border-gray-200"
                } 
                  rounded-xl shadow-lg overflow-hidden border hover:shadow-xl transition-all duration-300 ease-in-out`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={
                  servicesInView
                    ? { opacity: 1, x: 0 }
                    : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }
                }
                transition={{
                  duration: 0.5,
                  delay: 0.1 * index,
                }}
              >
                <div className="md:flex">
                  <div className="md:w-2/5">
                    <div className="h-full">
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-full max-h-95 h-95 object-cover"
                      />
                    </div>
                  </div>
                  <div className="p-6 md:w-3/5">
                    <div className="flex justify-between items-start mb-3">
                      <h3
                        className={`text-xl font-bold line-clamp-1 ${
                          darkMode ? "text-white" : "text-[#264653]"
                        }`}
                      >
                        {service.name}
                      </h3>
                      <span
                        className={`text-sm font-medium px-2 py-1 rounded-full ${
                          darkMode
                            ? "bg-[#264653]/30 text-white"
                            : "bg-[#F0E6FF] text-[#264653]"
                        }`}
                      >
                        {service.category}
                      </span>
                    </div>

                    <p
                      className={`text-sm ${
                        darkMode ? "text-[#f4a261]" : "text-gray-600"
                      } mb-4`}
                    >
                      {service.description}
                    </p>

                    <div className="mb-4">
                      <p
                        className={`text-sm font-medium mb-2 ${
                          darkMode ? "text-white" : "text-[#264653]"
                        }`}
                      >
                        Select Package:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {service.types.map((type) => (
                          <button
                            key={type.id}
                            className={`p-2 text-xs text-center rounded-md border transition-colors cursor-pointer
                              ${
                                selectedServiceOptions[service.id] === type.id
                                  ? darkMode
                                    ? "bg-[#ce4257] text-white border-[#e76f51]"
                                    : "bg-[#ce4257] text-white border-[#e76f51]"
                                  : darkMode
                                  ? "border-[#264653] text-white"
                                  : "border-[#264653] text-[#264653]"
                              }`}
                            onClick={() =>
                              handleServiceOptionChange(service.id, type.id)
                            }
                          >
                            <div className="font-bold">{type.name}</div>
                            <div className="mt-1">{type.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between pt-6 items-center mt-4">
                      <div>
                        <span
                          className={`text-xl font-semibold ${
                            darkMode ? "text-white" : "text-[#e76f51]"
                          }`}
                        >
                          $
                          {(
                            service.basePrice *
                            (service.types.find(
                              (t) =>
                                t.id ===
                                (selectedServiceOptions[service.id] ||
                                  service.types[0].id)
                            )?.priceMultiplier || 1)
                          ).toFixed(2)}
                        </span>
                      </div>

                      <motion.button
                        onClick={() => addServiceToCart(service)}
                        className="px-3 py-1 bg-[#f4a261] text-white rounded-md flex items-center gap-1 cursor-pointer"
                        whileHover={{
                          scale: 1.05,
                          backgroundColor: "#e76f51",
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaPlus className="h-3 w-3" />
                        Add to Cart
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`py-16 ${darkMode ? "bg-[#121212]" : "bg-white"}`}
        id="testimonials"
        ref={testimonialsRef}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2
              className={`text-3xl font-bold ${
                darkMode ? "text-white" : " text-[#264653]"
              } mb-4`}
            >
              What Our Customers Say
            </h2>
            <p
              className={`${
                darkMode ? "text-[#f4a261]" : "text-gray-600"
              } max-w-2xl mx-auto`}
            >
              Read about experiences from our satisfied clients
            </p>
          </motion.div>

          <div className="relative overflow-hidden h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div
                  className={`max-w-2xl mx-auto p-8 rounded-xl shadow-lg text-center ${
                    darkMode ? "bg-[#264653]/30" : "bg-[#FFF8E7]"
                  }`}
                >
                  <div className="mx-auto w-24 h-24 mb-6 rounded-full overflow-hidden border-4 border-[#f4a261]">
                    <img
                      src={mockTestimonials[testimonialIndex].image}
                      alt={mockTestimonials[testimonialIndex].name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={
                          i < mockTestimonials[testimonialIndex].rating
                            ? "text-white"
                            : "text-gray-300"
                        }
                        size={20}
                      />
                    ))}
                  </div>

                  <p
                    className={`text-lg italic mb-4 ${
                      darkMode ? "text-white" : "text-gray-700"
                    }`}
                  >
                    "{mockTestimonials[testimonialIndex].text}"
                  </p>

                  <p
                    className={`font-bold ${
                      darkMode ? "text-white" : "text-[#264653]"
                    }`}
                  >
                    {mockTestimonials[testimonialIndex].name}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-2 mt-10">
              {mockTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setTestimonialIndex(index)}
                  className={`w-2 h-2 rounded-full ${
                    testimonialIndex === index
                      ? "bg-[#e76f51]"
                      : darkMode
                      ? "bg-white/30"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer
        className={`${darkMode ? "bg-gray-800 " : "bg-[#264653] "}  py-12`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <span className={`text-2xl font-bold text-white`}>Party</span>
                <span className="text-2xl font-bold text-[#e76f51]">Time</span>
                <FaGift className="ml-2 text-[#f4a261]" />
              </div>
              <p className="text-sm leading-relaxed text-white">
                Making your celebrations spectacular since 2010. Premium party
                supplies and top-notch event services.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => scrollToSection("products")}
                  className="text-white hover:text-[#f4a261] transition-colors cursor-pointer"
                >
                  Products
                </button>
                <button
                  onClick={() => scrollToSection("services")}
                  className="text-white hover:text-[#f4a261] transition-colors cursor-pointer"
                >
                  Services
                </button>
                <button
                  onClick={() => scrollToSection("testimonials")}
                  className="text-white hover:text-[#f4a261] transition-colors cursor-pointer"
                >
                  Testimonials
                </button>
              </div>
            </div>

            <div className="space-y-4 md:px-10">
              <h3 className="text-lg font-semibold text-white">Active Hours</h3>
              <ul className="space-y-2 text-white">
                <li className="text-sm flex justify-between">
                  <span>Monday - Friday:</span>
                  <span>9am - 6pm</span>
                </li>
                <li className="text-sm flex justify-between">
                  <span>Saturday:</span>
                  <span>10am - 5pm</span>
                </li>
                <li className="text-sm flex justify-between">
                  <span>Sunday:</span>
                  <span>Closed</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Contact</h3>
              <ul className="space-y-2 text-white">
                <li className="text-sm flex items-center gap-2">
                  <FaMapMarkerAlt className="text-[#f4a261]" />
                  123 Celebration Ave, Party City
                </li>
                <li className="text-sm flex items-center gap-2">
                  <FaHome className="text-[#f4a261]" />
                  1-800-PARTY-TIME
                </li>
                <li className="text-sm flex items-center gap-2">
                  <FaUser className="text-[#f4a261]" />
                  info@partytime.com
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/30 mt-8 pt-6 text-center">
            <p className="text-sm text-white">
              © 2025 PartyTime. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Modals/Sidebars */}

      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-60"
              onClick={closeCart}
            ></motion.div>

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20 }}
              className={`fixed right-0 top-0 bottom-0 w-full sm:w-96 ${
                darkMode ? "bg-[#121212]" : "bg-white"
              } shadow-xl z-50 overflow-hidden flex flex-col`}
            >
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2
                  className={`text-xl font-bold ${
                    darkMode ? "text-white" : "text-[#264653]"
                  }`}
                >
                  Your Cart
                </h2>
                <button
                  onClick={closeCart}
                  className={`${
                    darkMode ? "text-white" : "text-[#264653]"
                  } hover:text-[#e76f51] cursor-pointer`}
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center">
                    <FaShoppingCart
                      className={`h-12 w-12 ${
                        darkMode ? "text-[#264653]/40" : "text-gray-300"
                      } mb-4`}
                    />
                    <p
                      className={`${
                        darkMode ? "text-[#f4a261]" : "text-gray-500"
                      } text-center`}
                    >
                      Your cart is empty. Add some party essentials!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <motion.div
                        key={item.id}
                        className={`${
                          darkMode
                            ? "bg-[#121212]/30 border-[#264653]/20"
                            : "bg-white border-gray-100"
                        } border rounded-lg p-3 flex items-center gap-3`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        layout
                      >
                        <img
                          src={
                            item.type === "product"
                              ? (item.item as Product).image
                              : (item.item as Service).image
                          }
                          alt={
                            item.type === "product"
                              ? (item.item as Product).name
                              : (item.item as Service).name
                          }
                          className="w-16 h-16 object-cover rounded-md"
                        />

                        <div className="flex-1">
                          <h3
                            className={`font-medium ${
                              darkMode ? "text-white" : "text-[#264653]"
                            }`}
                          >
                            {item.type === "product"
                              ? (item.item as Product).name
                              : (item.item as Service).name}
                          </h3>

                          {item.type === "service" && item.selectedType && (
                            <p
                              className={`text-xs ${
                                darkMode ? "text-[#f4a261]" : "text-gray-500"
                              }`}
                            >
                              {(item.item as Service).types.find(
                                (t) => t.id === item.selectedType
                              )?.name || "Basic"}{" "}
                              package
                            </p>
                          )}

                          <div className="flex justify-between items-center mt-1">
                            <span
                              className={`text-sm font-bold ${
                                darkMode ? "text-[#f4a261]" : "text-[#e76f51]"
                              }`}
                            >
                              ${(getItemPrice(item) * item.quantity).toFixed(2)}
                            </span>

                            <div className="flex items-center gap-2">
                              <motion.button
                                onClick={() => removeFromCart(item.id)}
                                className="p-1 rounded-full bg-[#ce4257] text-white cursor-pointer"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <FaMinus className="h-3 w-3" />
                              </motion.button>

                              <span
                                className={`font-medium ${
                                  darkMode ? "text-white" : "text-[#264653]"
                                }`}
                              >
                                {item.quantity}
                              </span>

                              <motion.button
                                onClick={() =>
                                  item.type === "product"
                                    ? addProductToCart(item.item as Product)
                                    : addServiceToCart(item.item as Service)
                                }
                                className="p-1 rounded-full bg-[#f4a261] text-white cursor-pointer"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <FaPlus className="h-3 w-3" />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <span
                    className={`font-medium ${
                      darkMode ? "text-white" : "text-[#264653]"
                    }`}
                  >
                    Total:
                  </span>
                  <span
                    className={`text-xl font-bold ${
                      darkMode ? "text-[#f4a261]" : "text-[#e76f51]"
                    }`}
                  >
                    ${getTotalPrice().toFixed(2)}
                  </span>
                </div>

                <motion.button
                  onClick={openCheckout}
                  disabled={cartItems.length === 0}
                  className={`w-full py-3 rounded-lg flex items-center justify-center font-medium text-white 
                    ${
                      cartItems.length === 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#e76f51] hover:bg-[#f4a261] cursor-pointer"
                    }`}
                  whileHover={cartItems.length > 0 ? { scale: 1.02 } : {}}
                  whileTap={cartItems.length > 0 ? { scale: 0.98 } : {}}
                >
                  Proceed to Checkout
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCheckoutOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-60"
              onClick={closeCheckout}
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`fixed inset-0 z-50 overflow-hidden`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-center min-h-screen p-4">
                <motion.div
                  className={`w-full max-w-3xl ${
                    darkMode ? "bg-[#121212]" : "bg-white"
                  } rounded-xl shadow-xl overflow-hidden relative`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2
                      className={`text-xl font-bold ${
                        darkMode ? "text-white" : "text-[#264653]"
                      }`}
                    >
                      {checkoutStep === 1 && hasServices
                        ? "Event Details"
                        : checkoutStep === 2
                        ? "Payment Information"
                        : checkoutStep === 3
                        ? "Order Complete"
                        : "Checkout"}
                    </h2>
                    <button
                      onClick={closeCheckout}
                      className={`${
                        darkMode ? "text-white" : "text-[#264653]"
                      } hover:text-[#e76f51] cursor-pointer`}
                    >
                      <FaTimes className="h-5 w-5" />
                    </button>
                  </div>

                  <div
                    className="relative overflow-hidden"
                    style={{ height: checkoutStep === 3 ? "400px" : "auto" }}
                  >
                    <AnimatePresence mode="wait">
                      {checkoutStep === 1 && hasServices && (
                        <motion.div
                          key="step1"
                          initial={{ x: 0 }}
                          animate={{ x: 0 }}
                          exit={{ x: "-100%" }}
                          transition={{ type: "tween", duration: 0.3 }}
                          className="p-6"
                        >
                          <div
                            className={`mb-8 p-4 rounded-lg ${
                              darkMode ? "bg-[#264653]/20" : "bg-gray-50"
                            }`}
                          >
                            <div className="space-y-4">
                              <div>
                                <label
                                  className={`block text-sm font-medium mb-1 ${
                                    darkMode
                                      ? "text-[#f4a261]"
                                      : "text-gray-700"
                                  }`}
                                >
                                  Event Date*
                                </label>
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaCalendarAlt
                                      className={
                                        darkMode
                                          ? "text-[#f4a261]"
                                          : "text-gray-400"
                                      }
                                    />
                                  </div>
                                  <input
                                    type="date"
                                    className={`pl-10 pr-4 py-2 w-full rounded-md ${
                                      darkMode
                                        ? "bg-[#121212] text-white border-[#264653]"
                                        : "bg-white border-gray-300"
                                    } border focus:outline-none focus:ring-2 focus:ring-[#e76f51]`}
                                    value={eventDetails.date}
                                    onChange={(e) =>
                                      setEventDetails({
                                        ...eventDetails,
                                        date: e.target.value,
                                      })
                                    }
                                    min={new Date().toISOString().split("T")[0]}
                                    required
                                  />
                                </div>
                              </div>

                              <div>
                                <label
                                  className={`block text-sm font-medium mb-1 ${
                                    darkMode
                                      ? "text-[#f4a261]"
                                      : "text-gray-700"
                                  }`}
                                >
                                  Event Time*
                                </label>
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaClock
                                      className={
                                        darkMode
                                          ? "text-[#f4a261]"
                                          : "text-gray-400"
                                      }
                                    />
                                  </div>
                                  <input
                                    type="time"
                                    className={`pl-10 pr-4 py-2 w-full rounded-md ${
                                      darkMode
                                        ? "bg-[#121212] text-white border-[#264653]"
                                        : "bg-white border-gray-300"
                                    } border focus:outline-none focus:ring-2 focus:ring-[#e76f51]`}
                                    value={eventDetails.time}
                                    onChange={(e) =>
                                      setEventDetails({
                                        ...eventDetails,
                                        time: e.target.value,
                                      })
                                    }
                                    required
                                  />
                                </div>
                              </div>

                              <div>
                                <label
                                  className={`block text-sm font-medium mb-1 ${
                                    darkMode
                                      ? "text-[#f4a261]"
                                      : "text-gray-700"
                                  }`}
                                >
                                  Additional Comments
                                </label>
                                <textarea
                                  className={`p-3 w-full rounded-md ${
                                    darkMode
                                      ? "bg-[#121212] text-white border-[#264653]"
                                      : "bg-white border-gray-300"
                                  } border focus:outline-none focus:ring-2 focus:ring-[#e76f51]`}
                                  rows={3}
                                  placeholder="Any special requests or details about your event..."
                                  value={eventDetails.comments}
                                  onChange={(e) =>
                                    setEventDetails({
                                      ...eventDetails,
                                      comments: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end mt-6">
                            <motion.button
                              onClick={() => setCheckoutStep(2)}
                              disabled={
                                !eventDetails.date || !eventDetails.time
                              }
                              className={`px-6 py-3 rounded-lg font-medium text-white
                          ${
                            !eventDetails.date || !eventDetails.time
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-[#e76f51] hover:bg-[#f4a261] cursor-pointer"
                          }`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Continue to Payment
                            </motion.button>
                          </div>
                        </motion.div>
                      )}

                      {(checkoutStep === 2 ||
                        (checkoutStep === 1 && !hasServices)) && (
                        <motion.div
                          key="step2"
                          initial={{ x: hasServices ? "100%" : 0 }}
                          animate={{ x: 0 }}
                          exit={{ x: checkoutStep === 1 ? "-100%" : "100%" }}
                          transition={{ type: "tween", duration: 0.3 }}
                          className="p-6"
                        >
                          <div>
                            <div className="space-y-4">
                              <div>
                                <label
                                  className={`block text-sm font-medium mb-1 ${
                                    darkMode
                                      ? "text-[#f4a261]"
                                      : "text-gray-700"
                                  }`}
                                >
                                  Card Number*
                                </label>
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaRegCreditCard
                                      className={
                                        darkMode
                                          ? "text-[#f4a261]"
                                          : "text-gray-400"
                                      }
                                    />
                                  </div>
                                  <input
                                    type="text"
                                    placeholder="1234 5678 9012 3456"
                                    className={`pl-10 pr-4 py-2 w-full rounded-md ${
                                      darkMode
                                        ? "bg-[#121212] text-white border-[#264653]"
                                        : "bg-white border-gray-300"
                                    } border focus:outline-none focus:ring-2 focus:ring-[#e76f51]`}
                                    value={creditCardInfo.number}
                                    onChange={handleCardNumberChange}
                                    required
                                  />
                                </div>
                                {cardErrors.number && (
                                  <p className="mt-1 text-xs text-[#e76f51]">
                                    {cardErrors.number}
                                  </p>
                                )}
                              </div>

                              <div>
                                <label
                                  className={`block text-sm font-medium mb-1 ${
                                    darkMode
                                      ? "text-[#f4a261]"
                                      : "text-gray-700"
                                  }`}
                                >
                                  Cardholder Name*
                                </label>
                                <input
                                  type="text"
                                  placeholder="John Smith"
                                  className={`px-4 py-2 w-full rounded-md ${
                                    darkMode
                                      ? "bg-[#121212] text-white border-[#264653]"
                                      : "bg-white border-gray-300"
                                  } border focus:outline-none focus:ring-2 focus:ring-[#e76f51]`}
                                  value={creditCardInfo.name}
                                  onChange={(e) =>
                                    setCreditCardInfo({
                                      ...creditCardInfo,
                                      name: e.target.value,
                                    })
                                  }
                                  required
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label
                                    className={`block text-sm font-medium mb-1 ${
                                      darkMode
                                        ? "text-[#f4a261]"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    Expiry Date*
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="MM/YY"
                                    className={`px-4 py-2 w-full rounded-md ${
                                      darkMode
                                        ? "bg-[#121212] text-white border-[#264653]"
                                        : "bg-white border-gray-300"
                                    } border focus:outline-none focus:ring-2 focus:ring-[#e76f51]`}
                                    value={creditCardInfo.expiry}
                                    onChange={handleExpiryChange}
                                    required
                                  />
                                  {cardErrors.expiry && (
                                    <p className="mt-1 text-xs text-[#e76f51]">
                                      {cardErrors.expiry}
                                    </p>
                                  )}
                                </div>

                                <div>
                                  <label
                                    className={`block text-sm font-medium mb-1 ${
                                      darkMode
                                        ? "text-[#f4a261]"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    CVC*
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="123"
                                    className={`px-4 py-2 w-full rounded-md ${
                                      darkMode
                                        ? "bg-[#121212] text-white border-[#264653]"
                                        : "bg-white border-gray-300"
                                    } border focus:outline-none focus:ring-2 focus:ring-[#e76f51]`}
                                    value={creditCardInfo.cvc}
                                    onChange={handleCVCChange}
                                    required
                                  />
                                  {cardErrors.cvc && (
                                    <p className="mt-1 text-xs text-[#e76f51]">
                                      {cardErrors.cvc}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div>
                                <label
                                  className={`block text-sm font-medium mb-1 ${
                                    darkMode
                                      ? "text-[#f4a261]"
                                      : "text-gray-700"
                                  }`}
                                >
                                  Billing Address*
                                </label>
                                <input
                                  type="text"
                                  placeholder="123 Party Street"
                                  className={`px-4 py-2 w-full rounded-md ${
                                    darkMode
                                      ? "bg-[#121212] text-white border-[#264653]"
                                      : "bg-white border-gray-300"
                                  } border focus:outline-none focus:ring-2 focus:ring-[#e76f51]`}
                                  value={creditCardInfo.address}
                                  onChange={(e) =>
                                    setCreditCardInfo({
                                      ...creditCardInfo,
                                      address: e.target.value,
                                    })
                                  }
                                  required
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label
                                    className={`block text-sm font-medium mb-1 ${
                                      darkMode
                                        ? "text-[#f4a261]"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    City*
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="Party City"
                                    className={`px-4 py-2 w-full rounded-md ${
                                      darkMode
                                        ? "bg-[#121212] text-white border-[#264653]"
                                        : "bg-white border-gray-300"
                                    } border focus:outline-none focus:ring-2 focus:ring-[#e76f51]`}
                                    value={creditCardInfo.city}
                                    onChange={(e) =>
                                      setCreditCardInfo({
                                        ...creditCardInfo,
                                        city: e.target.value,
                                      })
                                    }
                                    required
                                  />
                                </div>

                                <div>
                                  <label
                                    className={`block text-sm font-medium mb-1 ${
                                      darkMode
                                        ? "text-[#f4a261]"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    ZIP Code*
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="12345"
                                    className={`px-4 py-2 w-full rounded-md ${
                                      darkMode
                                        ? "bg-[#121212] text-white border-[#264653]"
                                        : "bg-white border-gray-300"
                                    } border focus:outline-none focus:ring-2 focus:ring-[#e76f51]`}
                                    value={creditCardInfo.zip}
                                    onChange={(e) =>
                                      setCreditCardInfo({
                                        ...creditCardInfo,
                                        zip: e.target.value
                                          .replace(/\D/g, "")
                                          .slice(0, 5),
                                      })
                                    }
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div
                            className={`mt-8 p-4 rounded-lg ${
                              darkMode ? "bg-[#264653]/20" : "bg-gray-50"
                            }`}
                          >
                            <div className="space-y-2">
                              {cartItems.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex justify-between"
                                >
                                  <span
                                    className={`${
                                      darkMode
                                        ? "text-[#f4a261]"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {item.quantity}x{" "}
                                    {item.type === "product"
                                      ? (item.item as Product).name
                                      : `${(item.item as Service).name} (${
                                          (item.item as Service).types.find(
                                            (t) => t.id === item.selectedType
                                          )?.name || "Basic"
                                        })`}
                                  </span>
                                  <span
                                    className={`font-medium ${
                                      darkMode ? "text-white" : "text-[#264653]"
                                    }`}
                                  >
                                    $
                                    {(
                                      getItemPrice(item) * item.quantity
                                    ).toFixed(2)}
                                  </span>
                                </div>
                              ))}

                              <div className="border-t border-gray-200 pt-2 mt-2">
                                <div className="flex justify-between font-bold">
                                  <span
                                    className={
                                      darkMode ? "text-white" : "text-black"
                                    }
                                  >
                                    Total
                                  </span>
                                  <span
                                    className={`${
                                      darkMode
                                        ? "text-[#f4a261]"
                                        : "text-[#e76f51]"
                                    }`}
                                  >
                                    ${getTotalPrice().toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between mt-6">
                            {hasServices && (
                              <motion.button
                                onClick={() => setCheckoutStep(1)}
                                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium cursor-pointer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Back
                              </motion.button>
                            )}
                            <motion.button
                              onClick={placeOrder}
                              disabled={!isFormValid() || isOrdering}
                              className={`px-6 py-3 rounded-lg font-medium text-white
                          ${
                            !isFormValid() || isOrdering
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-[#e76f51] hover:bg-[#f4a261] cursor-pointer"
                          }`}
                              whileHover={
                                isFormValid() && !isOrdering
                                  ? { scale: 1.05 }
                                  : {}
                              }
                              whileTap={
                                isFormValid() && !isOrdering
                                  ? { scale: 0.95 }
                                  : {}
                              }
                            >
                              {isOrdering ? (
                                <span className="flex items-center gap-2">
                                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  Processing...
                                </span>
                              ) : (
                                "Complete Order"
                              )}
                            </motion.button>
                          </div>
                        </motion.div>
                      )}

                      {checkoutStep === 3 && (
                        <motion.div
                          key="step3"
                          initial={{ x: "100%" }}
                          animate={{ x: 0 }}
                          exit={{ x: "100%" }}
                          transition={{ type: "tween", duration: 0.3 }}
                          className="p-6 flex flex-col items-center justify-center h-full"
                        >
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, rotate: [0, 10, 0] }}
                            transition={{ duration: 0.5 }}
                            className="w-32 h-32 bg-[#264653] rounded-full flex items-center justify-center mb-8"
                          >
                            <FaCheck className="h-16 w-16 text-white" />
                          </motion.div>

                          <h3
                            className={`text-2xl font-bold ${
                              darkMode ? "text-white" : "text-[#264653]"
                            } mb-4 text-center`}
                          >
                            Order Confirmed!
                          </h3>

                          <p
                            className={`${
                              darkMode ? "text-[#f4a261]" : "text-gray-600"
                            } text-center max-w-md mb-8`}
                          >
                            Thank you for choosing PartyTime. We'll contact you
                            shortly to confirm all the details for your event.
                          </p>

                          <motion.button
                            onClick={() => {
                              setCartItems([]);
                              setIsCheckoutOpen(false);
                              setCheckoutStep(1);
                              setCreditCardInfo({
                                number: "",
                                name: "",
                                expiry: "",
                                cvc: "",
                                address: "",
                                city: "",
                                zip: "",
                              });
                              setEventDetails({
                                date: "",
                                time: "",
                                comments: "",
                              });
                            }}
                            className="px-6 py-3 bg-[#f4a261] text-white rounded-lg font-medium cursor-pointer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Return to Shopping
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {orderCompleted && !isCheckoutOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div
              className={`${
                darkMode ? "bg-[#121212]" : "bg-white"
              } rounded-lg shadow-xl p-6 max-w-md mx-4 text-center`}
            >
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="h-16 w-16 bg-[#264653] rounded-full flex items-center justify-center mb-4">
                  <FaCheck className="h-8 w-8 text-white" />
                </div>
                <h3
                  className={`text-xl font-medium ${
                    darkMode ? "text-white" : "text-[#264653]"
                  } mb-2`}
                >
                  Your order has been confirmed!
                </h3>
                <p
                  className={`${darkMode ? "text-[#f4a261]" : "text-gray-600"}`}
                >
                  Thank you for choosing PartyTime. We'll contact you shortly to
                  confirm the details.
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isVisible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-40 p-4 bg-orange-500/40 hover:bg-[#e76f51] text-white rounded-full shadow-lg cursor-pointer transition-colors duration-300 group"
          >
            <FaArrowUp className="text-xl" />

            {/* Tooltip */}
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm py-1 px-3 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Scroll to Top.
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}