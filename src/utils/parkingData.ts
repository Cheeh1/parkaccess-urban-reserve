
export interface ParkingLot {
  id: string;
  name: string;
  address: string;
  distance: string;
  price: number;
  rating: number;
  totalRatings: number;
  availableSpots: number;
  totalSpots: number;
  amenities: string[];
  image: string;
  spotId: string;
}

export const mockParkingLots: ParkingLot[] = [
  {
    id: '1',
    name: 'Unity Road Parking Complex',
    address: '123 Unity Road, Ilorin',
    distance: '0.3 km',
    price: 500,
    rating: 4.8,
    totalRatings: 124,
    availableSpots: 15,
    totalSpots: 25,
    amenities: ['security', 'covered', 'accessible', 'cctv'],
    image: 'https://images.unsplash.com/photo-1470224114660-3f6686c562eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    spotId: 'A-15'
  },
  {
    id: '2',
    name: 'Central Market Parking',
    address: '45 Market Road, Ilorin',
    distance: '0.8 km',
    price: 300,
    rating: 4.2,
    totalRatings: 89,
    availableSpots: 8,
    totalSpots: 40,
    amenities: ['security', 'accessible'],
    image: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    spotId: 'B-08'
  },
  {
    id: '3',
    name: 'Garden City Mall Parking',
    address: '78 Mall Avenue, Ilorin',
    distance: '1.2 km',
    price: 700,
    rating: 4.9,
    totalRatings: 210,
    availableSpots: 35,
    totalSpots: 120,
    amenities: ['security', 'covered', 'accessible', 'cctv', 'ev_charging', 'restrooms', 'cafe'],
    image: 'https://images.unsplash.com/photo-1582648373212-d3bd443a2024?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    spotId: 'C-35'
  },
  {
    id: '4',
    name: 'University Parking Zone',
    address: '200 Campus Road, Ilorin',
    distance: '2.5 km',
    price: 250,
    rating: 4.0,
    totalRatings: 67,
    availableSpots: 5,
    totalSpots: 30,
    amenities: ['security'],
    image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    spotId: 'D-05'
  },
  {
    id: '5',
    name: 'Stadium Parking Area',
    address: '55 Sports Complex, Ilorin',
    distance: '3.1 km',
    price: 400,
    rating: 4.5,
    totalRatings: 156,
    availableSpots: 50,
    totalSpots: 200,
    amenities: ['security', 'accessible', 'cctv'],
    image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    spotId: 'E-50'
  }
];
