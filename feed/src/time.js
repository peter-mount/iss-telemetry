const ONE_DAY = 1000 * 60 * 60 * 24;

/**
 * ISS time conversions.
 *
 * Timestamps in the feeds are in decimal hours since Jan 0.0
 */
class ISSTime {
  /**
   * Returns the current time in ISS time.
   * @returns {number} Time in hours since Jan 0.0
   */
  nowISS() {
    const now = new Date(),
      gmtOffset = (now.getTimezoneOffset()) / 60,
      start = new Date(now.getFullYear(), 0, 0),
      diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    return (diff / ONE_DAY) * 24 + gmtOffset;
  }

  /**
   * Converts ISS timestamp (hours since Jan 0.0) into UTC (milliseconds since epoch)
   * @param issTime
   * @returns {number}
   */
  issToUTC(issTime) {
    const now = new Date(),
      start = Date.UTC(now.getFullYear(), 0, 0, 0, 0, 0);
    return Math.round(start + (issTime * 1000.0 * 3600));
  }
}

export default ISSTime;
