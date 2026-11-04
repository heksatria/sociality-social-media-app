import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime); // aktifkan fromNow(): "3 minutes ago"

export default dayjs;
