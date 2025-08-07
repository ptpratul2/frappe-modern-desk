frappe.views.Workspace = class CustomWorkspace extends frappe.views.Workspace {
    constructor(wrapper) {
        super(wrapper);
    }
    show() {
        // hide side bar for particular view
        if (frappe.router?.current_route &&
            frappe.router.current_route.length > 1 &&
            frappe.router.current_route[0].toLowerCase() === "workspaces") {
            // side bar
            let elements = document.querySelectorAll('.layout-side-section');
            elements.forEach(element => {
                if (element) element.classList.add('hide-side-section');
            });

            // Toggle button
            let elements2 = document.querySelectorAll('div[data-page-route]:not([data-page-route="menu"]) .sidebar-toggle-btn');
            elements2.forEach(element2 => {
                if (element2) element2.classList.add('hide-side-section');
            });

            // button to navigate to menu
            let elements3 = document.querySelectorAll('div[data-page-route]:not([data-page-route="menu"]) .menu-open-btn');
            elements3.forEach(element3 => {
                if (element3) element3.classList.remove('hide-side-section');
            });
        } else {
            // side bar
            let elements = document.querySelectorAll('.layout-side-section');
            elements.forEach(element => {
                if (element) element.classList.remove('hide-side-section');
            });

            // Toggle button
            let elements2 = document.querySelectorAll('div[data-page-route]:not([data-page-route="menu"]) .sidebar-toggle-btn');
            elements2.forEach(element2 => {
                if (element2) element2.classList.remove('hide-side-section');
            });

            // button to navigate to menu
            let elements3 = document.querySelectorAll('div[data-page-route]:not([data-page-route="menu"]) .menu-open-btn');
            elements3.forEach(element3 => {
                if (element3) element3.classList.add('hide-side-section');
            });
        }

        // call the parent's show
        super.show();
    }
}

// frappe.views.Workspace = class CustomWorkspace extends frappe.views.Workspace {
//     constructor(wrapper) {
//         super(wrapper);
//     }
//     show() {
//         // Always show the side bar and the sidebar toggle button
//         let sideBarElements = document.querySelectorAll('.layout-side-section');
//         sideBarElements.forEach(element => {
//             if (element) element.classList.remove('hide-side-section');
//         });

//         let toggleButtonElements = document.querySelectorAll('.sidebar-toggle-btn');
//         toggleButtonElements.forEach(element => {
//             if (element) element.classList.remove('hide-side-section');
//         });

//         // The menu-open-btn is specifically for navigating to the modern-menu.
//         // You can choose to always hide it if the sidebar is always visible
//         // or keep it conditionally visible based on your needs.
//         // For this scenario, let's assume you want it hidden when the sidebar is always present.
//         let menuOpenButtonElements = document.querySelectorAll('.menu-open-btn');
//         menuOpenButtonElements.forEach(element => {
//             if (element) element.classList.add('hide-side-section');
//         });

//         // If you want the menu button to still appear specifically on the 'modern-menu' page,
//         // you would add a condition here. For now, it's globally hidden.

//         // call the parent's show
//         super.show();
//     }
// }


// frappe.views.Workspace = class CustomWorkspace extends frappe.views.Workspace {
//     constructor(wrapper) {
//         super(wrapper);
//         this.setupSidebarVisibilityOnRouteChange();
//     }
//     setupSidebarVisibilityOnRouteChange() {
//         frappe.after_route_change = () => {
//             this.updateSidebarVisibility();
//         };
//     }

 
//     updateSidebarVisibility() {
//         const currentRoute = frappe.router?.current_route;
//         const shouldHideSidebar = currentRoute && currentRoute.length > 1 && currentRoute[1] === "modern-menu";
//         let sideBarElements = document.querySelectorAll('.layout-side-section');
//         let toggleButtonElements = document.querySelectorAll('.sidebar-toggle-btn');
//         let menuOpenButtonElements = document.querySelectorAll('.menu-open-btn');
//         sideBarElements.forEach(element => {
//             if (element) {
//                 if (shouldHideSidebar) {
//                     element.classList.add('hide-side-section');
//                 } else {
//                     element.classList.remove('hide-side-section');
//                 }
//             }
//         });

//         toggleButtonElements.forEach(element => {
//             if (element) {
//                 if (shouldHideSidebar) {
//                     element.classList.add('hide-side-section');
//                 } else {
//                     element.classList.remove('hide-side-section');
//                 }
//             }
//         });

//         menuOpenButtonElements.forEach(element => {
//             if (element) {
//                 if (shouldHideSidebar) {
//                     element.classList.remove('hide-side-section'); 
//                 } else {
//                     element.classList.add('hide-side-section'); 
//                 }
//             }
//         });
//     }

//     show() {
//         super.show();
//         this.updateSidebarVisibility();
//     }
// }