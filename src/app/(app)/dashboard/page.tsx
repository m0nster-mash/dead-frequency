export default function DashboardPage() {
    return (
        <div>
			<header>
				<h1>This is the logged in screen that should appear on every logged in page.</h1>
				<p>Signed in as {session.user.email}</p>
				 <div>
                	<Link href="/styletest">Click here to see the style test page.</Link>
            	</div>
				<SignOutButton />
			</header>
			<main>{children}</main>
		</div>
    );
}