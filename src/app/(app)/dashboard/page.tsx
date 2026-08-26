import Link from "next/link";
import { SignOutButton } from "@/core/auth/components/sign-out-button";

export default function DashboardPage() {
    return (
        <div>
        	<h1>This is the dashboard that should appear on every logged in page.</h1>
			<p>Dashboard</p>
			
				 <div>
                	<Link href="/styletest">Click here to see the style test page.</Link>
            	</div>
				<SignOutButton />
		</div>
    );
}