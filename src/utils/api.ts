const API_BASE_URL =
  import.meta.env.VITE_BASE_URL

// Helper function to get API base URL
export const getApiBaseUrl = () => {
  return (
    import.meta.env.VITE_BASE_URL
  );
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Generic API call function
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    headers: getAuthHeaders(),
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Unknown error" }));
    throw new Error(
      errorData.message || `HTTP ${response.status}: ${response.statusText}`
    );
  }

  return response.json();
};

// Time slots API
export const timeSlotApi = {
  getAvailable: (parkingLotId: string, date: string) =>
    apiCall(`/time-slots/available/${parkingLotId}?date=${date}`),

  checkAvailability: (
    parkingLotId: string,
    startTime: string,
    endTime: string
  ) =>
    apiCall(
      `/time-slots/check-availability/${parkingLotId}?startTime=${startTime}&endTime=${endTime}`
    ),

  book: (bookingData: {
    parkingLotId: string;
    spotNumber: number;
    startTime: string;
    endTime: string;
  }) =>
    apiCall("/time-slots", {
      method: "POST",
      body: JSON.stringify(bookingData),
    }),

  getHistory: (timeFilter?: string, page?: number, limit?: number) => {
    const params = new URLSearchParams();
    if (timeFilter) params.append("timeFilter", timeFilter);
    if (page) params.append("page", page.toString());
    if (limit) params.append("limit", limit.toString());

    const queryString = params.toString();
    return apiCall(
      `/time-slots/history${queryString ? `?${queryString}` : ""}`
    );
  },

  // Company booking history with filters
  getCompanyHistory: (filters?: {
    timeFilter?: "active" | "upcoming" | "completed";
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters?.timeFilter) params.append("timeFilter", filters.timeFilter);
    if (filters?.startDate) params.append("startDate", filters.startDate);
    if (filters?.endDate) params.append("endDate", filters.endDate);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const queryString = params.toString();
    return apiCall(
      `/time-slots/company/history${queryString ? `?${queryString}` : ""}`
    );
  },

  cancel: (bookingId: string) =>
    apiCall(`/time-slots/${bookingId}/cancel`, {
      method: "PUT",
    }),
};

// Payments API
export const paymentsApi = {
  initialize: (paymentData: {
    parkingLotId: string;
    startTime: string;
    endTime: string;
    carDetails: {
      licensePlate: string;
      carModel: string;
      carColor: string;
    };
    amount: number;
  }) =>
    apiCall("/payments/initialize", {
      method: "POST",
      body: JSON.stringify(paymentData),
    }),

  verify: (reference: string) => apiCall(`/payments/verify/${reference}`),
};

// Parking lots API
export const parkingLotsApi = {
  getById: (id: string) => apiCall(`/parking-lots/${id}`),

  search: (params: Record<string, string>) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/parking-lots/search?${queryString}`);
  },

  getAll: () => apiCall("/parking-lots"),
};

// Analytics API for company dashboard
export const analyticsApi = {
  // Get company summary analytics
  getSummary: (params?: { month?: number; year?: number }) => {
    const queryString = new URLSearchParams();
    if (params?.month) queryString.append("month", params.month.toString());
    if (params?.year) queryString.append("year", params.year.toString());

    return apiCall(
      `/analytics/company/summary${
        queryString.toString() ? `?${queryString.toString()}` : ""
      }`
    );
  },

  // Get revenue chart data
  getRevenueChart: (params?: { months?: number; year?: number }) => {
    const queryString = new URLSearchParams();
    if (params?.months) queryString.append("months", params.months.toString());
    if (params?.year) queryString.append("year", params.year.toString());

    return apiCall(
      `/analytics/company/revenue-chart${
        queryString.toString() ? `?${queryString.toString()}` : ""
      }`
    );
  },

  // Get live occupancy data
  getLiveOccupancy: () => apiCall("/analytics/company/occupancy/live"),

  // Get detailed analytics
  getDetailed: (params?: {
    startDate?: string;
    endDate?: string;
    parkingLotId?: string;
  }) => {
    const queryString = new URLSearchParams();
    if (params?.startDate) queryString.append("startDate", params.startDate);
    if (params?.endDate) queryString.append("endDate", params.endDate);
    if (params?.parkingLotId)
      queryString.append("parkingLotId", params.parkingLotId);

    return apiCall(
      `/analytics/company/detailed${
        queryString.toString() ? `?${queryString.toString()}` : ""
      }`
    );
  },
};
