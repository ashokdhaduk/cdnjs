/**
 * @fileoverview countdown.js v2.0.1
 * 
 * Copyright (c)2006-2011 Stephen M. McKamey
 * Licensed under the MIT License (http://bitbucket.org/mckamey/countdown.js/LICENSE.txt)
 */

/**
 * @public
 */
var countdown = (
	function() {

	'use strict';

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var MILLISECONDS	= 0x001;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var SECONDS			= 0x002;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var MINUTES			= 0x004;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var HOURS			= 0x008;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var DAYS			= 0x010;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var WEEKS			= 0x020;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var MONTHS			= 0x040;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var YEARS			= 0x080;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var CENTURIES		= 0x100;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var MILLENNIA		= 0x200;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var ALL_UNITS		= 0xFFF;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var MILLISECONDS_PER_SECOND = 1000;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var SECONDS_PER_MINUTE = 60;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var MINUTES_PER_HOUR = 60;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var HOURS_PER_DAY = 24;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var MILLISECONDS_PER_DAY = HOURS_PER_DAY * MINUTES_PER_HOUR * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var DAYS_PER_WEEK = 7;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var MAX_WEEKS_PER_MONTH = 5;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var MONTHS_PER_YEAR = 12;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var YEARS_PER_CENTURY = 100;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var CENTURIES_PER_MILLENNIUM = 10;

	/**
	 * @private
	 * @param {Date} ref reference date
	 * @param {number} shift months to shift reference month
	 */
	function daysInRefMonth(ref, shift) {
		var prevTime = ref.getTime();

		// increment or decrement month by diff
		ref.setUTCMonth( ref.getUTCMonth() + shift );

		// this is the trickiest since months vary in length
		return Math.round(Math.abs(prevTime - ref.getTime()) / MILLISECONDS_PER_DAY);
	}

	/**
	 * @private
	 * @param {number} value
	 * @param {number} conversion
	 */
	function borrow(value, conversion) {
		return Math.floor(-(value+1)/conversion)+1;
	}

	/**
	 * @private
	 * @param {number} value
	 * @param {string} singular
	 * @param {string} plural
	 * @return {string}
	 */
	function plurality(value, singular, plural) {
		return (value === 1) ? singular : value+' '+plural;
	}

	var formatList;

	/**
	 * Timespan representation of a duration of time
	 * 
	 * @private
	 * @this {Timespan}
	 * @constructor
	 */
	function Timespan() {}

	/**
	 * Formats the Timespan as a sentence
	 * 
	 * @private
	 * @return {string}
	 */
	Timespan.prototype.toString = function() {
		var label = formatList(this);

		var count = label.length;
		if (!count) {
			return '';
		}
		if (count > 1) {
			label[count-1] = 'and '+label[count-1];
		}
		return label.join(', ');
	};

	/**
	 * Formats the Timespan as HTML
	 * 
	 * @private
	 * @param {string} tag
	 * @return {string}
	 */
	Timespan.prototype.toHTML = function(tag) {
		tag = tag || 'span';
		var label = formatList(this);

		var count = label.length;
		if (!count) {
			return '';
		}
		for (var i=0; i<count; i++) {
			// wrap each unit in tag
			label[i] = '<'+tag+'>'+label[i]+'</'+tag+'>';
		}
		if (--count) {
			label[count] = 'and '+label[count];
		}
		return label.join(', ');
	};

	/**
	 * Formats the entries as English labels
	 * 
	 * @private
	 * @param {Timespan} ts
	 * @return {Array}
	 */
	formatList = function(ts) {
		var list = [];

		if (ts.millennia) {
			list.push(plurality(ts.millennia, '1 millennium', 'millennia'));
		}
		if (ts.centuries) {
			list.push(plurality(ts.centuries, '1 century', 'centuries'));
		}
		if (ts.years) {
			list.push(plurality(ts.years, '1 year', 'years'));
		}
		if (ts.months) {
			list.push(plurality(ts.months, '1 month', 'months'));
		}
		if (ts.weeks) {
			list.push(plurality(ts.weeks, '1 week', 'weeks'));
		}
		if (ts.days) {
			list.push(plurality(ts.days, '1 day', 'days'));
		}
		if (ts.hours) {
			list.push(plurality(ts.hours, '1 hour', 'hours'));
		}
		if (ts.minutes) {
			list.push(plurality(ts.minutes, '1 minute', 'minutes'));
		}
		if (ts.seconds) {
			list.push(plurality(ts.seconds, '1 second', 'seconds'));
		}
		if (ts.milliseconds) {
			list.push(plurality(ts.milliseconds, '1 millisecond', 'milliseconds'));
		}

		return list;
	};

	/**
	 * Borrow any underflow units, carry any overflow units
	 * 
	 * @private
	 * @param {Timespan} ts
	 */
	function ripple(ts) {
		var x;

		if (ts.milliseconds < 0) {
			// ripple minutes down to seconds
			x = borrow(ts.milliseconds, MILLISECONDS_PER_SECOND);
			ts.seconds -= x;
			ts.milliseconds += x * MILLISECONDS_PER_SECOND;

		} else if (ts.milliseconds >= MILLISECONDS_PER_SECOND) {
			// ripple minutes up to hours
			ts.seconds += Math.floor(ts.milliseconds / MILLISECONDS_PER_SECOND);
			ts.milliseconds %= MILLISECONDS_PER_SECOND;
		}

		if (ts.seconds < 0) {
			// ripple minutes down to seconds
			x = borrow(ts.seconds, SECONDS_PER_MINUTE);
			ts.minutes -= x;
			ts.seconds += x * SECONDS_PER_MINUTE;

		} else if (ts.seconds >= SECONDS_PER_MINUTE) {
			// ripple minutes up to hours
			ts.minutes += Math.floor(ts.seconds / SECONDS_PER_MINUTE);
			ts.seconds %= SECONDS_PER_MINUTE;
		}

		if (ts.minutes < 0) {
			// ripple hours down to minutes
			x = borrow(ts.minutes, MINUTES_PER_HOUR);
			ts.hours -= x;
			ts.minutes += x * MINUTES_PER_HOUR;

		} else if (ts.minutes >= MINUTES_PER_HOUR) {
			// ripple minutes up to hours
			ts.hours += Math.floor(ts.minutes / MINUTES_PER_HOUR);
			ts.minutes %= MINUTES_PER_HOUR;
		}

		if (ts.hours < 0) {
			// ripple days down to hours
			x = borrow(ts.hours, HOURS_PER_DAY);
			ts.days -= x;
			ts.hours += x * HOURS_PER_DAY;

		} else if (ts.hours >= HOURS_PER_DAY) {
			// ripple hours up to days
			ts.days += Math.floor(ts.hours / HOURS_PER_DAY);
			ts.hours %= HOURS_PER_DAY;
		}

		if (ts.days < 0) {
			// ripple weeks down to days
			x = borrow(ts.days, DAYS_PER_WEEK);
			ts.weeks -= x;
			ts.days += x * DAYS_PER_WEEK;

		} else if (ts.days >= DAYS_PER_WEEK) {
			// ripple days up to weeks
			ts.weeks += Math.floor(ts.days / DAYS_PER_WEEK);
			ts.days %= DAYS_PER_WEEK;
		}

		while (ts.weeks < 0) {
			// ripple months down to weeks and days
			x = daysInRefMonth(ts.refMonth, +1);
			ts.months--;
			ts.weeks += Math.floor(x / DAYS_PER_WEEK);
			ts.days += x % DAYS_PER_WEEK;

			if (ts.days >= DAYS_PER_WEEK) {
				// ripple days back up to weeks
				ts.weeks += Math.floor(ts.days / DAYS_PER_WEEK);
				ts.days %= DAYS_PER_WEEK;
			}
		}

		while (ts.weeks >= MAX_WEEKS_PER_MONTH) {
			// ripple weeks up to months and ripple remainder down to days
			ts.months++;
			ts.weeks -= MAX_WEEKS_PER_MONTH;
			ts.days += (MAX_WEEKS_PER_MONTH * DAYS_PER_WEEK) - daysInRefMonth(ts.refMonth, -1);

			if (ts.days >= DAYS_PER_WEEK) {
				// ripple days back up to weeks
				ts.weeks += Math.floor(ts.days / DAYS_PER_WEEK);
				ts.days %= DAYS_PER_WEEK;
			}
		}

		if (ts.months < 0) {
			// ripple years down to months
			x = borrow(ts.months, MONTHS_PER_YEAR);
			ts.years -= x;
			ts.months += x * MONTHS_PER_YEAR;

		} else if (ts.months >= MONTHS_PER_YEAR) {
			// ripple months up to years
			ts.years += Math.floor(ts.months / MONTHS_PER_YEAR);
			ts.months %= MONTHS_PER_YEAR;
		}

		if (ts.years < 0) {
			// ripple centuries down to years
			x = borrow(ts.years, YEARS_PER_CENTURY);
			ts.centuries -= x;
			ts.years += x * YEARS_PER_CENTURY;

		} else if (ts.years >= YEARS_PER_CENTURY) {
			// ripple years up to centuries
			ts.centuries += Math.floor(ts.years / YEARS_PER_CENTURY);
			ts.years %= YEARS_PER_CENTURY;
		}

		if (ts.centuries < 0) {
			// ripple millennia down to centuries
			x = borrow(ts.centuries, CENTURIES_PER_MILLENNIUM);
			ts.millennia -= x;
			ts.centuries += x * CENTURIES_PER_MILLENNIUM;

		} else if (ts.centuries >= CENTURIES_PER_MILLENNIUM) {
			// ripple centuries up to millennia
			ts.millennia += Math.floor(ts.centuries / CENTURIES_PER_MILLENNIUM);
			ts.centuries %= CENTURIES_PER_MILLENNIUM;
		}
	}

	/**
	 * Remove any units not requested
	 * 
	 * @private
	 * @param {Timespan} ts
	 * @param {number} units the units to populate
	 */
	function pruneUnits(ts, units) {
		// Calc from largest unit to smallest to prevent underflow

		if (!(units & MILLENNIA)) {
			// ripple millennia down to centuries
			ts.centuries += ts.millennia * CENTURIES_PER_MILLENNIUM;
			delete ts.millennia;
		}

		if (!(units & CENTURIES)) {
			// ripple centuries down to years
			ts.years += ts.centuries * YEARS_PER_CENTURY;
			delete ts.centuries;
		}

		if (!(units & YEARS)) {
			// ripple years down to months
			ts.months += ts.years * MONTHS_PER_YEAR;
			delete ts.years;
		}

		if (!(units & MONTHS)) {
			while (ts.months) {
				// ripple months down to days
				var daysInMonth = daysInRefMonth(ts.refMonth, +1);
				ts.months--;
				ts.weeks += Math.floor(daysInMonth / DAYS_PER_WEEK);
				ts.days += daysInMonth % DAYS_PER_WEEK;

				if (ts.days >= DAYS_PER_WEEK) {
					// ripple days back up to weeks
					ts.weeks += Math.floor(ts.days / DAYS_PER_WEEK);
					ts.days %= DAYS_PER_WEEK;
				}
			}
			delete ts.months;
		}

		if (!(units & WEEKS)) {
			// ripple weeks down to days
			ts.days += ts.weeks * DAYS_PER_WEEK;
			delete ts.weeks;
		}

		if (!(units & DAYS)) {
			//ripple days down to hours
			ts.hours += ts.days * HOURS_PER_DAY;
			delete ts.days;
		}

		if (!(units & HOURS)) {
			// ripple hours down to minutes
			ts.minutes += ts.hours * MINUTES_PER_HOUR;
			delete ts.hours;
		}

		if (!(units & MINUTES)) {
			// ripple minutes down to seconds
			ts.seconds += ts.minutes * SECONDS_PER_MINUTE;
			delete ts.minutes;
		}

		if (!(units & SECONDS)) {
			// ripple seconds down to milliseconds
			ts.milliseconds += ts.seconds * MILLISECONDS_PER_SECOND;
			delete ts.seconds;
		}

		if (!(units & MILLISECONDS)) {
			// nothing to ripple down to, so just remove
			delete ts.milliseconds;
		}
	}

	/**
	 * Populates the Timespan object
	 * 
	 * @private
	 * @param {Timespan} ts
	 * @param {Date} start the starting date
	 * @param {Date} end the ending date
	 * @param {number} units the units to populate
	 */
	function populate(ts, start, end, units) {
		ts.start = start;
		ts.end = end;
		ts.units = units;

		ts.value = end.getTime() - start.getTime();
		if (ts.value < 0) {
			// swap if reversed
			var temp = end;
			end = start;
			start = temp;
		}

		// reference month for determining days in month
		ts.refMonth = new Date(start.getFullYear(), start.getMonth(), 15);
		try {

			// reset to initial deltas
			ts.millennia = 0;
			ts.centuries = 0;
			ts.years = end.getUTCFullYear() - start.getUTCFullYear();
			ts.months = end.getUTCMonth() - start.getUTCMonth();
			ts.weeks = 0;
			ts.days = end.getUTCDate() - start.getUTCDate();
			ts.hours = end.getUTCHours() - start.getUTCHours();
			ts.minutes = end.getUTCMinutes() - start.getUTCMinutes();
			ts.seconds = end.getUTCSeconds() - start.getUTCSeconds();
			ts.milliseconds = end.getUTCMilliseconds() - start.getUTCMilliseconds();

			ripple(ts);
			pruneUnits(ts, units);

		} finally {
			delete ts.refMonth;
		}

		return ts;
	}

	/**
	 * Determine an appropriate refresh rate based upon units
	 * 
	 * @private
	 * @param {number} units the units to populate
	 * @return {number} milliseconds to delay
	 */
	function getDelay(units) {
		if (units & MILLISECONDS) {
			// refresh very quickly
			return MILLISECONDS_PER_SECOND / 30; //30Hz
		}

		if (units & SECONDS) {
			// refresh every second
			return MILLISECONDS_PER_SECOND; //1Hz
		}

		if (units & MINUTES) {
			// refresh every minute
			return MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE;
		}

		if (units & HOURS) {
			// refresh hourly
			return MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR;
		}
		
		if (units & DAYS) {
			// refresh daily
			return MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY;
		}

		// refresh weekly
		return MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY * DAYS_PER_WEEK;
	}

	var countdown = {
		/**
		 * @public
		 * @const
		 * @type {number}
		 */
		MILLISECONDS: MILLISECONDS,

		/**
		 * @public
		 * @const
		 * @type {number}
		 */
		SECONDS: SECONDS,

		/**
		 * @public
		 * @const
		 * @type {number}
		 */
		MINUTES: MINUTES,

		/**
		 * @public
		 * @const
		 * @type {number}
		 */
		HOURS: HOURS,

		/**
		 * @public
		 * @const
		 * @type {number}
		 */
		DAYS: DAYS,

		/**
		 * @public
		 * @const
		 * @type {number}
		 */
		WEEKS: WEEKS,

		/**
		 * @public
		 * @const
		 * @type {number}
		 */
		MONTHS: MONTHS,

		/**
		 * @public
		 * @const
		 * @type {number}
		 */
		YEARS: YEARS,

		/**
		 * @public
		 * @const
		 * @type {number}
		 */
		CENTURIES: CENTURIES,

		/**
		 * @public
		 * @const
		 * @type {number}
		 */
		MILLENNIA: MILLENNIA,

		/**
		 * @public
		 * @const
		 * @type {number}
		 */
		ALL: ALL_UNITS,

		/**
		 * Main API entry point
		 * 
		 * @public
		 * @param {Date|number|function(Timespan)} start the starting date
		 * @param {Date|number|function(Timespan)} end the ending date
		 * @param {number} units the units to populate
		 * @return {Timespan|number}
		 */
		timespan : function(start, end, units) {
			var callback;

			// ensure units, default to all
			units = units || ALL_UNITS;

			// ensure start date
			if ('function' === typeof start) {
				callback = start;
				start = null;

			} else if (isFinite(start)) {
				start = new Date(start);

			} else if (!(start instanceof Date)) {
				throw 'expected date or callback for start';
			}

			// ensure end date
			if ('function' === typeof end) {
				callback = end;
				end = null;

			} else if (isFinite(end)) {
				end = new Date(end);

			} else if (!(end instanceof Date)) {
				throw 'expected date or callback for end';
			}

			if (!callback) {
				return populate(new Timespan(), /** @type{Date} */(start||new Date()), /** @type{Date} */(end||new Date()), units);
			}

			// base delay off units
			var delay = getDelay(units);
			var fn = function() {
				callback(
					populate(new Timespan(), /** @type{Date} */(start||new Date()), /** @type{Date} */(end||new Date()), units)
				);
			};

			fn();
			return setInterval(fn, delay);
		},

		/**
		 * For unit testing only.
		 * 
		 * @private
		 * @return {Timespan}
		 */
		empty: function(map) {
			return new Timespan();
		}
	};

	return countdown;	

})();
