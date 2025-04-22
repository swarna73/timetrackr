// this object is injected by Spring’s thymeleaf snippet (or any other templating util)
export const appConfig = {
  maxHoursPerDay  : window.__CONFIG__.MAX_HOURS_PER_DAY,   // e.g. 8
  allowWeekends   : window.__CONFIG__.ALLOW_WEEKENDS === 'true'
};
