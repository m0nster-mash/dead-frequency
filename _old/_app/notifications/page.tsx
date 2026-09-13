import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import {NotificationPanel} from "@/shared/communication/notifications/components/notification-panel";

export default function NotificationsPage() {
    return (
        <main>
            <PageHeader eyebrow={"Activity"} title={"Your Notifications"} subtitle={""}/>
            <NotificationPanel limit={50}/>
        </main>
    );
}
