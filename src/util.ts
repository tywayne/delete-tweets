export default {
	now: new Date(),
	maxDaysAgo: Number.parseInt(process.env.MAX_DAYS_AGO as string, 10),
};
