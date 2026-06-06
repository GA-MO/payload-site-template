import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";
import utc from "dayjs/plugin/utc";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(utc);

export { dayjs };
export default dayjs;
