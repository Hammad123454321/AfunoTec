export const paths = {
  admin: {
    root: () => "/admin",
    dashboard: () => "/admin",
    bookings: () => "/admin/bookings",
    services: () => "/admin/services",
    customers: () => "/admin/customers",
    serviceOwners: () => "/admin/service-owners",
    users: () => "/admin/users",
    promotion: {
      root: () => "/admin/promotions",
      coupons: () => "/admin/promotions/coupons",
      giftCards: () => "/admin/promotions/gift-cards",
    },
    payments: {
      root: () => "/admin/payments",
      orders: () => "/admin/payments/orders",
      transactions: () => "/admin/payments/transactions",
      commission: () => "/admin/payments/commission",
    },
    chat: () => "/admin/chat",
    settings: () => "/admin/settings",
  },

  user: {
    root: () => "/user",
    dashboard: () => "/user",
    customer: (id?: string) =>
      id ? `/user/customer-details/${id}` : "/user/my-profile",
    orders: (id?: string) =>
      id ? `/user/order-details/${id}` : "/user/order-details",
    wish: () => "/user/my-wish",
    coupon: () => "/user/my-coupon",
    gift: () => "/user/gift-card",
  },

  serviceOwner: {
    root: () => "/service-owner",
    dashboard: () => "/service-owner",
    bookings: () => "/service-owner/my-bookings",
    services: (id?: string) =>
      id ? `/service-owner/my-services/${id}` : "/service-owner/my-services",
    customer: (id?: string) =>
      id ? `/service-owner/customer/${id}` : "/service-owner/customer",
    offer: (id?: string) =>
      id ? `/service-owner/offer/${id}` : "/service-owner/offer",
    payment: (id?: string) =>
      id
        ? `/service-owner/payment-history/${id}`
        : "/service-owner/payment-history",
    chat: () => "/service-owner/chat",
    setting: () => "/service-owner/settings",
  },
};

export const webPaths = {
  homePath: () => "/",
  staysPath: () => "/stays",
  thingsTodoPath: () => "/things-to-do",
  toursPath: () => "/tours",
  travelsPath: () => "/travels",
  transfersPath: () => "/transportation",
  nosyBePath: () => "/nosy-bee",
  corporatePath: () => "/corporate",
  coWorkingPath: () => "/co-working",
  workplacePath: () => "/work-places",
  eventPath: () => "/events",
  culturePath: () => "/culture",
};

export const socialPaths = {
  facebook: () => "https://www.facebook.com",
  instagram: () => "https://www.instagram.com",
  youtube: () => "https://www.youtube.com",
};
