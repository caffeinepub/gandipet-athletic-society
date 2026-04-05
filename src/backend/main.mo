import Time "mo:core/Time";
import Array "mo:core/Array";

actor {
  type MembershipTier = {
    name : Text;
    priceInINR : Nat;
    features : [Text];
  };

  type Event = {
    name : Text;
    date : Time.Time;
    description : Text;
  };

  type Facility = {
    name : Text;
    description : Text;
  };

  let membershipTiers : [MembershipTier] = [
    {
      name = "Starter";
      priceInINR = 8500;
      features = [
        "24/7 Access",
        "High Speed Internet",
        "Free Coffee & Snacks",
        "Meeting Rooms (Limited Hours)",
        "Community Events Access",
      ];
    },
    {
      name = "Pro";
      priceInINR = 18500;
      features = [
        "All Starter Features",
        "Dedicated Desk",
        "Mail Handling",
        "Printing Services",
        "Guest Access (2 per Month)",
      ];
    },
    {
      name = "Elite";
      priceInINR = 35000;
      features = [
        "All Pro Features",
        "Private Office Space",
        "Premium Location",
        "24/7 Concierge",
        "Priority Event Bookings",
      ];
    },
  ];

  let events : [Event] = [
    {
      name = "Networking Breakfast";
      date = 1718160000000000000; // 12 Jun 2024, 9:00 AM IST
      description = "Join us for a morning networking session with fellow entrepreneurs and professionals. Enjoy breakfast, coffee, and great conversations.";
    },
    {
      name = "Startup Pitch Night";
      date = 1719513600000000000; // 27 Jun 2024, 6:00 PM IST
      description = "Present your startup idea to a panel of investors and mentors. Get valuable feedback and potentially secure funding for your venture.";
    },
    {
      name = "Wellness Workshop";
      date = 1721059200000000000; // 15 Jul 2024, 11:00 AM IST
      description = "Take a break from work and focus on your mental and physical well-being. Participate in our wellness workshop including yoga and meditation sessions.";
    },
  ];

  let facilities : [Facility] = [
    {
      name = "Hot Desks";
      description = "Flexible workspace for freelancers, remote workers, and startups. Access any available desk and work at your convenience.";
    },
    {
      name = "Private Offices";
      description = "Secure and fully-furnished private office spaces, suitable for small teams and growing businesses.";
    },
    {
      name = "Meeting Rooms";
      description = "State-of-the-art meeting rooms equipped with audio-visual technology, whiteboards, and conferencing facilities.";
    },
  ];

  public query ({ caller }) func getMembershipTiers() : async [MembershipTier] {
    membershipTiers;
  };

  public query ({ caller }) func getEvents() : async [Event] {
    events.filter(func(event) { event.date > Time.now() });
  };

  public query ({ caller }) func getAllEvents() : async [Event] {
    events;
  };

  public query ({ caller }) func getFacilities() : async [Facility] {
    facilities;
  };
};
