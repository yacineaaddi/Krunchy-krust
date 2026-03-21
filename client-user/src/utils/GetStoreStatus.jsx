function toMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function getStoreStatus(workingHours) {
  if (!workingHours) return { isOpen: false };
  const now = new Date();
  const todayIndex = now.getDay();

  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  const todayName = days[todayIndex];
  const todayHours = workingHours[todayName];
  const timeNow = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });


  const nowMin = toMinutes(timeNow);

  // If day disabled or no ranges
  if (!todayHours?.enabled || !todayHours?.ranges?.length) {
    return {
      isOpen: false,
      today: todayName,
      timeNow,
      closedForToday: true,
    };
  }

  let isOpen = false;
  let currentRange = null;

  for (const range of todayHours.ranges) {
    const openMin = toMinutes(range.from);
    const closeMin = toMinutes(range.to);

    const crossesMidnight = openMin > closeMin;

    const open = crossesMidnight
      ? nowMin >= openMin || nowMin < closeMin
      : nowMin >= openMin && nowMin < closeMin;

    if (open) {
      isOpen = true;
      currentRange = range;
      break;
    }
  }

  return {
    isOpen,
    today: todayName,
    timeNow,
    openTime: currentRange?.from,
    closeTime: currentRange?.to,
    closedForToday: !isOpen,
  };
}
