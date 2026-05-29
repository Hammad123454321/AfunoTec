"use client";

import React from "react";
import { Gift, ChevronDown, ChevronUp, Plus } from "lucide-react";

// Types
interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface GiftCardsPageProps {
  faqs?: FAQItem[];
  isLoading?: boolean;
  onPurchaseClick?: () => void;
}

// FAQ Accordion Item
const FAQAccordion: React.FC<{
  faq: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ faq, isOpen, onToggle }) => {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-green-700 pr-4">{faq.question}</span>
        {isOpen ? (
          <ChevronUp className="flex-shrink-0 text-gray-400" size={20} />
        ) : (
          <ChevronDown className="flex-shrink-0 text-gray-400" size={20} />
        )}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
          {faq.answer}
        </div>
      )}
    </div>
  );
};

// Main Component
export function GiftCardsPage({
  faqs = [],
  isLoading = false,
  onPurchaseClick,
}: GiftCardsPageProps) {
  const [openFaqId, setOpenFaqId] = React.useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-5xl mx-auto animate-pulse space-y-6">
          <div className="h-96 bg-gray-200 rounded-2xl"></div>
          <div className="h-40 bg-gray-200 rounded-xl"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-4">
                My Gift Cards
              </h1>

              <div className="mb-6">
                <p className="text-red-600 font-medium mb-4">
                  Gift Giving is Made Easy with baodeal.net! One Gift Card. So
                  many choices.
                </p>

                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                    <p className="text-gray-600 text-sm">
                      It&apos;s the perfect present to give to family, friends,
                      colleagues or to yourself.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                    <p className="text-gray-600 text-sm">
                      The baodeal.net gift card is all about enjoying life,
                      having well deserved time off and enjoying joy.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                    <p className="text-gray-600 text-sm">
                      From overnight stay in hotels, to spa packages, all
                      inclusive day experiences, exciting activities and so many
                      others.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <p>
                  This baodeal.net Gift Card is a truly unique gift offering a
                  remarkable selection of hundreds of exciting deals packages to
                  choose from.
                </p>
                <p>
                  So save the headache and hassle of running around and shopping
                  for gifts.
                </p>
                <p>
                  You can now order the baodeal.net gift card within few clicks,
                  receive it immediately, sharing the best gift possible to
                  those important people in your life.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=400&fit=crop"
                  alt="Gift Card Illustration"
                  className="w-full h-auto rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f3f4f6" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%239ca3af" dy=".3em"%3EGift Card%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 bg-blue-50 p-6 text-center">
            <button
              onClick={onPurchaseClick}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Purchase a Gift Card
            </button>
          </div>
        </div>

        {/* No Gift Card Message */}
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-8 text-center">
          <Gift size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-700 font-medium mb-2">
            You did not Receive any Gift Card yet!
          </p>
          <button
            onClick={onPurchaseClick}
            className="text-red-600 font-medium hover:underline"
          >
            Click here to Purchase a Gift Card
          </button>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900">
              Gift Cards FAQ
            </h2>
          </div>

          {faqs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No FAQs available
            </div>
          ) : (
            <div>
              {faqs.map((faq) => (
                <FAQAccordion
                  key={faq.id}
                  faq={faq}
                  isOpen={openFaqId === faq.id}
                  onToggle={() => toggleFaq(faq.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Example Usage
const ExampleUsage: React.FC = () => {
  const sampleFaqs: FAQItem[] = [
    {
      id: "1",
      question: "How do I order a Gift Card?",
      answer:
        "This is so easy! You just have to go to the Gift Card page where you will find all the options for ordering the Gift Card. You can choose the gift card amount, select any greeting image or upload your own, write the greeting message and many others. The order and payment process of ordering a Gift Card is identical to ordering our deals package - so its easy and can be completed within minutes!",
    },
    {
      id: "2",
      question: "What can I buy with the Gift Card?",
      answer:
        "You can buy ANY offer, product, deal and package found on the baodeal.net website. No limitations at all. This means that with one Gift Card anyone can purchase over 500 different deal packages - this is quite a remarkable selection to choose from.",
    },
    {
      id: "3",
      question: "How is the Gift Card to be redeemed?",
      answer:
        'This is super easy. You can redeem a gift card either by entering the gift card code during the order process on the cart page, or, click on the "Apply to Cart" button on this page which will add all available information from the gift card to the cart amount.',
    },
    {
      id: "4",
      question: "Can I customize a Gift Card?",
      answer:
        "Yes you can. On the Gift Card order page you can choose the gift card image from a range of existing greeting images or even upload your own image! Then, you can also add a personal greeting. So surely each gift card is unique and can be customized as per your preference.",
    },
    {
      id: "5",
      question:
        "What if I want to process an order which is higher than the gift card amount?",
      answer:
        "This is not a problem. In such case, once you apply the gift card on the cart page, the gift card amount will be deducted from your total order amount and you would then be asked to pay only the price difference.",
    },
    {
      id: "6",
      question: "Does the gift card have a limited validity?",
      answer:
        "All gift cards are valid for a period of 12 months since purchase",
    },
    {
      id: "7",
      question: "Once I Order a gift card do I get any confirmation?",
      answer:
        "Yes you do. Both you and the recipient receive a beautiful decorated email confirmation with the gift card details, including the gift card amount, validity period, gift card code, greeting and image.",
    },
    {
      id: "8",
      question: "How can I send the Gift Card to someone?",
      answer:
        "You will notice that on the Gift Card page itself you would be required to enter the recipient info - their name and email address. You can even choose the date on which you would like the Gift Card Order to be sent to the recipient. So once the Gift Card order is complete the recipient will receive a copy of the e-Gift Card by email.",
    },
    {
      id: "9",
      question: "Can I order more than one gift card in one go?",
      answer:
        "Yes, Sure! You can order up to 10 gift cards per each purchase. So if you are arranging a party, ordering for members, colleagues or staff members you can easily do so. All you have to do is to either add more recipients, whereby each recipient will receive one gift card, or you can simply at the bottom of the gift card page, increase the quantity of gift cards to be purchased. In case you plan to order over 10 gift cards, please do let us know and we can assist in processing your request.",
    },
  ];

  const [faqs, setFaqs] = React.useState<FAQItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => {
      setFaqs(sampleFaqs);
      setLoading(false);
    }, 1000);
  }, []);

  const handlePurchaseClick = () => {
    console.log("Purchase Gift Card clicked");
    alert("Redirecting to purchase page...");
  };

  return (
    <GiftCardsPage
      faqs={faqs}
      isLoading={loading}
      onPurchaseClick={handlePurchaseClick}
    />
  );
};

export default ExampleUsage;
