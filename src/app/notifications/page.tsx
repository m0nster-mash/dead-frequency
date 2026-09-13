import {NotificationPanel} from "@/shared/communication/notifications/components/notification-panel";

export default function NotificationsPage() {
    return (
        <main style={{padding: "2rem", maxWidth: "800px", margin: "0 auto"}}>
            <h1 style={{marginBottom: "1.5rem"}}>Activity &amp; Notifications</h1>
            <NotificationPanel limit={50}/>
        </main>
    );
}
