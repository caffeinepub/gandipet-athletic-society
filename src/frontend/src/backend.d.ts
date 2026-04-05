import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Facility {
    name: string;
    description: string;
}
export interface MembershipTier {
    features: Array<string>;
    name: string;
    priceInINR: bigint;
}
export type Time = bigint;
export interface Event {
    date: Time;
    name: string;
    description: string;
}
export interface backendInterface {
    getAllEvents(): Promise<Array<Event>>;
    getEvents(): Promise<Array<Event>>;
    getFacilities(): Promise<Array<Facility>>;
    getMembershipTiers(): Promise<Array<MembershipTier>>;
}
