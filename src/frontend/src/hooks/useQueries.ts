import { useQuery } from "@tanstack/react-query";
import type { Event, Facility, MembershipTier } from "../backend.d";
import { useActor } from "./useActor";

export function useMembershipTiers() {
  const { actor, isFetching } = useActor();
  return useQuery<MembershipTier[]>({
    queryKey: ["membershipTiers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMembershipTiers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useEvents() {
  const { actor, isFetching } = useActor();
  return useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getEvents();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFacilities() {
  const { actor, isFetching } = useActor();
  return useQuery<Facility[]>({
    queryKey: ["facilities"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFacilities();
    },
    enabled: !!actor && !isFetching,
  });
}
