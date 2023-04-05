export interface Meteor {
  name: string;
  id: string;
  nametype: string;
  recclass: string;
  mass: string;
  fall: string;
  year: string;
  reclat: string;
  reclong: string;
  geolocation: { type: string; coordinates: [number, number] };
}
