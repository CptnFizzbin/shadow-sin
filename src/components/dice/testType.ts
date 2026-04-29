export enum TestType {
  Hidden = "hidden",
  Standard = "standard",
  Opposed = "opposed",
  Extended = "extended",
}

export const TestTypeLabels: Record<TestType, string> = {
  [TestType.Hidden]: "Hidden",
  [TestType.Standard]: "Standard",
  [TestType.Opposed]: "Opposed",
  [TestType.Extended]: "Extended",
}

export enum ExtendedInterval {
  CombatRound = "combat-round",
  OneMinute = "1-minute",
  TenMinutes = "10-minutes",
  ThirtyMinutes = "30-minutes",
  OneHour = "1-hour",
  OneDay = "1-day",
  OneWeek = "1-week",
  OneMonth = "1-month",
}

export const ExtendedIntervalLabels: Record<ExtendedInterval, string> = {
  [ExtendedInterval.CombatRound]: "1 Combat Round",
  [ExtendedInterval.OneMinute]: "1 Minute",
  [ExtendedInterval.TenMinutes]: "10 Minutes",
  [ExtendedInterval.ThirtyMinutes]: "30 Minutes",
  [ExtendedInterval.OneHour]: "1 Hour",
  [ExtendedInterval.OneDay]: "1 Day",
  [ExtendedInterval.OneWeek]: "1 Week",
  [ExtendedInterval.OneMonth]: "1 Month",
}
