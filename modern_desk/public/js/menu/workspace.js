frappe.views.Workspace = class CustomWorkspace extends frappe.views.Workspace {
    constructor(wrapper) {
        super(wrapper);
    }

    show() {
        // Handle sidebar and buttons for workspace views
        if (
            frappe.router?.current_route &&
            frappe.router.current_route.length > 1 &&
            frappe.router.current_route[0].toLowerCase() === "workspaces"
        ) {
            // Show sidebar
            let sidebarElements = document.querySelectorAll('.layout-side-section');
            sidebarElements.forEach(element => {
                if (element) {
                    element.classList.remove('hide-side-section');
                }
            });

            // Hide sidebar toggle button
            let toggleButtons = document.querySelectorAll('.sidebar-toggle-btn');
            toggleButtons.forEach(element => {
                if (element) {
                    element.classList.add('hide-side-section');
                }
            });

            // Show menu button
            let menuButtons = document.querySelectorAll('.menu-open-btn');
            menuButtons.forEach(element => {
                if (element) {
                    element.classList.remove('hide-side-section');
                }
            });
        }

        // Call the parent's show
        super.show();
    }
};