import React from 'react'
import Menu from '../../../Components/Menu/Menu';
import "./Sidebar.css"
import Logo from '../../../Components/Logo/Logo';
import "./Sidebar_responsive.css"
const Sidebar = () => {
        const accountMenu = {
                menuTitle: "User Account",
                defaultOpen: "true",
                menuLinks: [
                        {
                                url: '/admin/dashboard',
                                title: 'My Account',
                        },
                        {
                                url: '/',
                                title: 'Logout'
                        },
                ]
        }

        const explorePostMenu = {
                menuTitle: "Explore",
                defaultOpen: "false",
                menuLinks: [
                        {
                                url: '/admin/explore/post/add',
                                title: 'Add New Explore Post',
                        },
                        {
                                url: '/admin/explore/posts',
                                title: 'All Explore Posts',
                        },
                ]
        }

        const userMainMenuAction = {
                menuTitle: "User Main Navigation",
                defaultOpen: "false",
                menuLinks: [
                        {
                                url: '/admin/main-navigation-top/edit',
                                title: 'Edit Top Navigation',
                        },
                        {
                                url: '/admin/main-navigation-bottom/edit',
                                title: 'Edit Bottom Navigation',
                        },
                ]
        }


        return (
                <div className="admin-sidebar">
                        <Logo />
                        <Menu menulinks={[{ url: '/admin/dashboard', title: 'Dashboard' }, { url: '/admin/basic-site-settings', title: 'Basic site settings' }, { url: '/admin/users', title: 'Users' }]} />
                        <Menu defaultOpen={accountMenu.defaultOpen} className="admin-account-menu" menuTitle={accountMenu.menuTitle} toggle='true' menulinks={accountMenu.menuLinks} />
                        <Menu className="main-navigation-action" menuTitle={userMainMenuAction.menuTitle} toggle='true' menulinks={userMainMenuAction.menuLinks} />
                        <Menu className="admin-explore-post-action" menuTitle={explorePostMenu.menuTitle} toggle='true' menulinks={explorePostMenu.menuLinks} />
                </div>
        )
}
export default Sidebar
