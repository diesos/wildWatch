export type Marker = {
  id: string;
  name: string;
  date: string;
  img: string;
  latitude: number;
  longitude: number;
};

export type MarkersArray = Marker[];

export type Position = {
  latitude: number;
  longitude: number;
};