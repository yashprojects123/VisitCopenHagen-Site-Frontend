import React, { useContext, useEffect, useState } from "react";
import "./Dashboard.css"; // Import the new CSS file
import { BasicSettingsContext } from "../../App";

const Dashboard = () => {
	let totalUsersContext = useContext(BasicSettingsContext);
const [usersCount, setUsersCount] = useState(0);

	useEffect(() => {
  if (totalUsersContext && totalUsersContext.users) {
    setUsersCount(totalUsersContext.users.length);
  }
}, [totalUsersContext?.users]);
	// Dummy data for the dashboard statistics
	const stats = [
		{
			id: 1,
			title: "Total Registered Users",
			value: usersCount,
			change: "+3.5%",
			trend: "up",
			// Example placeholder icon
			icon: (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<rect width="8" height="14" x="8" y="2" rx="2" ry="2" />
					<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
					<path d="M12 11h4" />
					<path d="M12 15h4" />
				</svg>
			),
			colorAccent: "accent-green",
		},
		{
			id: 3,
			title: "Avg. Engagement Rate",
			value: "6.2%",
			change: "-0.5%",
			trend: "down",
			icon: (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M7.9 20A9.3 9.3 0 0 1 4 16.1V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3.9l-3.9 3.9z" />
				</svg>
			),
			colorAccent: "accent-purple",
		},
	];

	const topPosts = [
		{
			id: 1,
			title: "Understanding React Hooks for Beginners",
			views: "1,200",
			author: "Alice",
			date: "2025-07-28",
		},
		{
			id: 2,
			title: "CSS Grid vs Flexbox: When to Use Which?",
			views: "980",
			author: "Bob",
			date: "2025-07-29",
		},
		{
			id: 3,
			title: "Optimizing Database Queries in SQL",
			views: "750",
			author: "Charlie",
			date: "2025-07-27",
		},
		{
			id: 4,
			title: "The Future of AI in Web Development",
			views: "610",
			author: "Diana",
			date: "2025-07-30",
		},
		{
			id: 5,
			title: "Getting Started with Node.js APIs",
			views: "550",
			author: "Ethan",
			date: "2025-07-26",
		},
	];

	const latestActivities = [
		{
			id: 1,
			user: "User123",
			action: "created new post",
			item: '"My First JavaScript Project"',
			time: "5 mins ago",
		},
		{
			id: 2,
			user: "User456",
			action: "commented on",
			item: '"React Performance Tips"',
			time: "15 mins ago",
		},
		{
			id: 3,
			user: "User789",
			action: "updated profile",
			item: "",
			time: "30 mins ago",
		},
		{
			id: 4,
			user: "User123",
			action: "uploaded image",
			item: '"/images/profile.jpg"',
			time: "1 hour ago",
		},
		{
			id: 5,
			user: "UserABC",
			action: "published post",
			item: '"Understanding Async/Await"',
			time: "2 hours ago",
		},
	];

	return (
		<div className="dashboard-v3-container">
			<h2 className="dashboard-v3-title">Welcome to Admin Dashboard</h2>

			{/* Main Statistics Grid */}
			<div className="stats-v3-grid">
				{stats.map((stat) => (
					<div key={stat.id} className={`stat-v3-card ${stat.colorAccent}`}>
						<div className="stat-v3-icon-wrapper">{stat.icon}</div>
						<div className="stat-v3-info">
							<p className="stat-v3-label">{stat.title}</p>
							<span className="stat-v3-value">{stat.value}</span>
							<span
								className={`stat-v3-change ${
									stat.trend === "up"
										? "stat-v3-change-up"
										: "stat-v3-change-down"
								}`}
							>
								{stat.change} {stat.trend === "up" ? "▲" : "▼"}
							</span>
						</div>
					</div>
				))}
			</div>

			{/* Bottom Sections: Top Content & Latest User Activity */}
			<div className="content-activity-grid">
				{/* Top Content (Most Viewed Posts) */}
				<div className="panel top-content-panel">
					<h2 className="panel-title">Top Viewed Posts</h2>
					<ul className="content-list">
						{topPosts.map((post) => (
							<li key={post.id} className="content-item">
								<span className="content-title">{post.title}</span>
								<span className="content-views">{post.views} views</span>
								<span className="content-author">by {post.author}</span>
							</li>
						))}
					</ul>
				</div>

				{/* Latest User Activity */}
				<div className="panel latest-activity-panel">
					<h2 className="panel-title">Latest User Activity</h2>
					<ul className="activity-feed">
						{latestActivities.map((activity) => (
							<li key={activity.id} className="activity-feed-item">
								<span className="activity-user">{activity.user}</span>
								<span className="activity-action">{activity.action}</span>
								{activity.item && (
									<span className="activity-item-name">{activity.item}</span>
								)}
								<span className="activity-time-ago">{activity.time}</span>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
