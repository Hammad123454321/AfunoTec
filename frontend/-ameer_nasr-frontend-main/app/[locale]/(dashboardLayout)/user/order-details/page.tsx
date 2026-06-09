"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";

// Types
interface Order {
  id: string;
  orderNumber: string;
  orderDate: string;
  orderTime: string;
  price: number;
  paymentMethod: string;
  status: "Cancelled" | "Booked" | "Pending";
  package: {
    hotelName: string;
    hotelLink: string;
    details: string[];
  };
  dates: {
    checkIn: string;
    checkOut: string;
  };
  booking: {
    roomType: string;
    mealType: string;
    occupancy: string;
  };
  customer?: {
    name: string;
    phone: string;
    email: string;
  };
  summary?: {
    subtotal: number;
    discount: number;
    total: number;
  };
}

// Mock API function
const fetchOrders = async (): Promise<Order[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return [
    {
      id: "1",
      orderNumber: "#1092808",
      orderDate: "19 Jul 2025",
      orderTime: "09:53am",
      price: 3200,
      paymentMethod: "Credit Card",
      status: "Cancelled",
      package: {
        hotelName: "Be Cosy Apart Hotel",
        hotelLink: "#",
        details: [
          "Room Only / Bed & Breakfast / Half Board",
          "+ Free Access to the Swimming Pool",
        ],
      },
      dates: {
        checkIn: "30 Jul 2025",
        checkOut: "31 Jul 2025",
      },
      booking: {
        roomType: "Studio",
        mealType: "Room Only",
        occupancy: "1 Adult",
      },
    },
    {
      id: "2",
      orderNumber: "#1092809",
      orderDate: "20 Jul 2025",
      orderTime: "10:15am",
      price: 4500,
      paymentMethod: "Bank Transfer",
      status: "Booked",
      package: {
        hotelName: "Be Cosy Apart Hotel",
        hotelLink: "#",
        details: [
          "Room Only / Bed & Breakfast / Half Board",
          "+ Free Access to the Swimming Pool",
        ],
      },
      dates: {
        checkIn: "01 Aug 2025",
        checkOut: "03 Aug 2025",
      },
      booking: {
        roomType: "Studio",
        mealType: "Bed & Breakfast",
        occupancy: "2 Adults",
      },
    },
    {
      id: "3",
      orderNumber: "#1092810",
      orderDate: "21 Jul 2025",
      orderTime: "14:30pm",
      price: 2800,
      paymentMethod: "Cash",
      status: "Pending",
      package: {
        hotelName: "Be Cosy Apart Hotel",
        hotelLink: "#",
        details: [
          "Room Only / Bed & Breakfast / Half Board",
          "+ Free Access to the Swimming Pool",
        ],
      },
      dates: {
        checkIn: "25 Jul 2025",
        checkOut: "26 Jul 2025",
      },
      booking: {
        roomType: "Studio",
        mealType: "Room Only",
        occupancy: "1 Adult",
      },
      customer: {
        name: "Sabiha Afroz Shuha",
        phone: "01731356565",
        email: "sabihashuha@gmail.com",
      },
      summary: {
        subtotal: 2800,
        discount: 0,
        total: 2800,
      },
    },
  ];
};

// Status Badge Component
const StatusBadge = ({ status }: { status: Order["status"] }) => {
  const colors = {
    Cancelled: "bg-red-200 text-red-700",
    Booked: "bg-green-200 text-green-700",
    Pending: "bg-blue-200 text-blue-700",
  };

  return (
    <span className={`px-4 py-1 rounded text-sm font-medium ${colors[status]}`}>
      {status}
    </span>
  );
};

// Order Card Component
const OrderCard = ({
  order,
  onViewDetails,
}: {
  order: Order;
  onViewDetails: (order: Order) => void;
}) => {
  return (
    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden mb-4">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex gap-8">
          <div>
            <span className="text-sm text-gray-600">Order No: </span>
            <span className="font-semibold">{order.orderNumber}</span>
          </div>
          <div>
            <span className="text-sm text-gray-600">Order Date:</span>
            <span className="font-semibold">
              {order.orderDate} |{order.orderTime}
            </span>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Price & Payment */}
      <div className="px-4 pb-4 flex items-center justify-between">
        <div>
          <span className="text-sm text-gray-600">Price: </span>
          <span className="font-semibold font-currency">
            Rs {order.price.toLocaleString()}
          </span>
        </div>
        <div className="flex-1 text-center">
          <span className="text-sm text-gray-600">Payment Method: </span>
          <span className="font-semibold">{order.paymentMethod}</span>
        </div>
        <button
          onClick={() => onViewDetails(order)}
          className="text-green-600 hover:text-green-700 flex items-center gap-1 text-sm font-medium"
        >
          Views Details
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Table */}
      <table className="w-full border-t border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-3 text-sm font-semibold border-r border-gray-300">
              Package Details
            </th>
            <th className="text-left p-3 text-sm font-semibold border-r border-gray-300">
              DATES
            </th>
            <th className="text-left p-3 text-sm font-semibold">
              Booking Summary
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-3 border-r border-gray-300 align-top">
              <a
                href={order.package.hotelLink}
                className="text-blue-600 hover:underline font-medium mb-2 block"
              >
                {order.package.hotelName}
              </a>
              {order.package.details.map((detail, idx) => (
                <div key={idx} className="text-sm text-gray-700">
                  {detail}
                </div>
              ))}
            </td>
            <td className="p-3 border-r border-gray-300 align-top">
              <div className="mb-2">
                <div className="text-green-600 font-semibold text-sm">
                  CHECK-IN:
                </div>
                <div className="text-sm">{order.dates.checkIn}</div>
              </div>
              <div>
                <div className="text-green-600 font-semibold text-sm">
                  CHECK-OUT:
                </div>
                <div className="text-sm">{order.dates.checkOut}</div>
              </div>
            </td>
            <td className="p-3 align-top">
              <div className="mb-2">
                <span className="text-green-600 font-semibold text-sm">
                  Room Type:{" "}
                </span>
                <span className="text-sm">{order.booking.roomType}</span>
              </div>
              <div className="mb-2">
                <span className="text-green-600 font-semibold text-sm">
                  Meal Type:{" "}
                </span>
                <span className="text-sm">{order.booking.mealType}</span>
              </div>
              <div>
                <span className="text-green-600 font-semibold text-sm">
                  Occupancy:{" "}
                </span>
                <span className="text-sm">{order.booking.occupancy}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

// Order Details Modal
const OrderDetailsModal = ({
  order,
  onClose,
}: {
  order: Order;
  onClose: () => void;
}) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">
              Order: <span className="text-red-600">{order.orderNumber}</span>
            </h2>

            <table className="w-full border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-3 border-r border-gray-300">
                    Order Date
                  </th>
                  <th className="text-left p-3 border-r border-gray-300">
                    Order Time
                  </th>
                  <th className="text-left p-3">Order Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border-r border-gray-300">
                    {order.orderDate}
                  </td>
                  <td className="p-3 border-r border-gray-300">
                    {order.orderTime}
                  </td>
                  <td className="p-3">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Order Summary */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
            <OrderCard order={order} onViewDetails={() => {}} />
          </div>

          {/* Customer Details & Order Summary */}
          {order.customer && (
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-base font-semibold mb-3 text-gray-500">
                  Order Summary
                </h3>
                <table className="w-full border border-gray-300">
                  <tbody>
                    <tr>
                      <td className="p-3 border-r border-gray-300 bg-gray-50">
                        Subtotal:
                      </td>
                      <td className="p-3 font-currency">
                        Rs {order.summary?.subtotal.toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 border-r border-gray-300 bg-gray-50">
                        Order Discount:
                      </td>
                      <td className="p-3 font-currency">
                        {order.summary?.discount || "------"}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 border-r border-gray-300 bg-gray-50">
                        Payment Method:
                      </td>
                      <td className="p-3">{order.paymentMethod}</td>
                    </tr>
                    <tr>
                      <td className="p-3 border-r border-gray-300 bg-gray-50">
                        Total:
                      </td>
                      <td className="p-3 font-semibold font-currency">
                        Rs {order.summary?.total.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <h3 className="text-base font-semibold mb-3">
                  Customer Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="font-semibold text-sm mb-1">Name:</div>
                    <div className="text-sm">{order.customer.name}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-sm mb-1">
                      Phone Number
                    </div>
                    <div className="text-sm">{order.customer.phone}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-sm mb-1">
                      Email Address:
                    </div>
                    <div className="text-sm">{order.customer.email}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Close Button */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-md font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center text-gray-500">
            No orders found
          </div>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onViewDetails={setSelectedOrder}
            />
          ))
        )}
      </div>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
