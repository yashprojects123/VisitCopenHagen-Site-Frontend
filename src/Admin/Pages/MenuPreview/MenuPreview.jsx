import React, { useEffect, useState } from "react";
import "./MenuPreview.css";
import { Link } from "react-router-dom";

const MenuPreview = ({ menuDataFromBackend, menuTitle, menuData }) => {
	return (
		<div className="menu-preview">
			<h3 className="heading text-center">Menu Preview</h3>

			{menuDataFromBackend.menuLinks &&
			menuDataFromBackend.menuLinks.length == 1 &&
			menuDataFromBackend.menuLinks[0].title == "" ? (
				<h4>No Links.</h4>
			) : (
				<>
					<h4 className="menu-title">{menuTitle}</h4>
					<ul>
						{menuData.map(({ title, url, subMenu }, index) => {
							return (
								<>
									<li key={title + index}>
										{" "}
										<Link to={url}>{title}</Link>
										{subMenu && subMenu.length > 0 && (
											<ul className="submenu-preview">
												{subMenu.map((child, idx) => (
													<li key={child.title + idx}>
														<Link to={child.url}>{child.title}</Link>
														{/* Recursive rendering for deeper levels if needed */}
														{child.subMenu && child.subMenu.length > 0 && (
															<ul className="submenu-preview">
																{child.subMenu.map((subchild, subidx) => (
																	<li key={subchild.title + subidx}>
																		<Link to={subchild.url}>
																			{subchild.title}
																		</Link>
																	</li>
																))}
															</ul>
														)}
													</li>
												))}
											</ul>
										)}
									</li>
								</>
							);
						})}
					</ul>
				</>
			)}
		</div>
	);
};

export default MenuPreview;
