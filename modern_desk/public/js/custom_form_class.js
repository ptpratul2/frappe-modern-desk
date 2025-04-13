frappe.ui.form.Form = class CustomFrappeForm extends frappe.ui.form.Form {
    constructor(doctype, parent, in_form, doctype_layout_name) {
        super(doctype, parent, in_form, doctype_layout_name);
        this.sidebarToggled = true; // Track sidebar visibility state
    }

    refresh(docname) {
        var switched = docname ? true : false;

        removeEventListener("beforeunload", this.beforeUnloadListener, { capture: true });

        if (docname) {
            this.switch_doc(docname);
        }

        cur_frm = this;

        this.undo_manager.erase_history();

        if (this.docname) {
            // Document to show
            this.save_disabled = false;
            this.doc = frappe.get_doc(this.doctype, this.docname);

            // Check permissions
            this.fetch_permissions();
            if (!this.has_read_permission()) {
                frappe.show_not_permitted(__(this.doctype) + " " + __(cstr(this.docname)));
                return;
            }

            // Update grids with new permissions
            this.grids.forEach((table) => {
                table.grid.refresh();
            });

            // Read only (workflow)
            this.read_only = frappe.workflow.is_read_only(this.doctype, this.docname);
            if (this.read_only) {
                this.set_read_only(true);
            }

            // Check if doctype is already open
            if (!this.opendocs[this.docname]) {
                this.check_doctype_conflict(this.docname);
            } else {
                if (this.check_reload()) {
                    return;
                }
            }

            // Do setup
            if (!this.setup_done) {
                this.setup();
            }

            // Trigger onload
            this.trigger_onload(switched);

            // Set status classes
            this.$wrapper
                .removeClass("validated-form")
                .toggleClass("editable-form", this.doc.docstatus === 0)
                .toggleClass("submitted-form", this.doc.docstatus === 1)
                .toggleClass("cancelled-form", this.doc.docstatus === 2);

            this.show_conflict_message();
            this.show_submission_queue_banner();

            if (frappe.boot.read_only) {
                this.disable_form();
            }

            // Add custom features
            this.removeFormHeading();
            setTimeout(() => this.setupSidebarToggle(), 0); // Defer to ensure DOM readiness
        } else {
            // No document, remove toggle button
            this.removeSidebarToggle();
        }

        // Call parent refresh
        super.refresh(docname);
    }

    removeFormHeading() {
        // Hide the form title (e.g., "Purchase Order: PO-1234")
        const titleElements = this.$wrapper.find('.title-text, .form-title, .page-title, .form-header h2, .form-header .title');
        titleElements.hide();
    }

    setupSidebarToggle() {
        // Manage sidebar visibility
        const sidebarElements = document.querySelectorAll('.layout-side-section');
        sidebarElements.forEach(element => {
            if (element) {
                element.classList.toggle('hide-side-section', !this.sidebarToggled);
            }
        });

        // Find the page head container
        let buttonContainer = this.$wrapper.find('.page-head');
        if (!buttonContainer.length) {
            console.warn('No page-head container found for sidebar toggle button');
            return;
        }

        // Remove stray sidebar toggle buttons or buttons with sidebar icons
        this.$wrapper.find('.sidebar-toggle-btn, .toggle-sidebar, .sidebar-toggle, button:has(svg use[href*="#icon-sidebar"], svg use[href*="#icon-left"], svg use[href*="#icon-right"])')
            .not('.custom-button-bar .sidebar-toggle-btn, .custom-button-bar .menu-open-btn')
            .remove();
        console.log('Removed stray sidebar toggle buttons');

        // Check if on a document page (Form/*)
        const isDocumentPage = frappe.router.current_route[0] === 'Form';

        // Create or update button bar
        let buttonBar = buttonContainer.find('.custom-button-bar');
        if (!buttonBar.length) {
            buttonBar = $('<div class="custom-button-bar"></div>').prependTo(buttonContainer);
            console.log('Button bar added to page-head:', buttonContainer[0]);

            // Add toggle button
            let toggleButton = $('<button class="sidebar-toggle-btn"></button>').appendTo(buttonBar);
            toggleButton.html(
                this.sidebarToggled
                    ? `<svg class="icon icon-sm"><use href="#icon-left"></use></svg>`
                    : `<svg class="icon icon-sm"><use href="#icon-right"></use></svg>`
            ).css({ display: 'inline-flex', visibility: 'visible' });
            console.log('Toggle button added to button bar');

            // Add menu button only on non-document pages
            if (!isDocumentPage) {
                let menuButton = $('<button class="menu-open-btn"></button>').appendTo(buttonBar);
                menuButton.html(`<svg class="icon icon-sm"><use href="#icon-menu"></use></svg>`).css({ display: 'inline-flex', visibility: 'visible' });
                console.log('Menu button added to button bar');

                // Bind menu button to navigate to workspace
                const workspace = this.getWorkspaceForDoctype(this.doctype);
                menuButton.on('click', () => {
                    frappe.set_route('workspaces', workspace.name);
                });
            }

            // Bind toggle event
            toggleButton.on('click', () => {
                this.sidebarToggled = !this.sidebarToggled;
                // Update sidebar visibility
                sidebarElements.forEach(element => {
                    if (element) {
                        element.classList.toggle('hide-side-section', !this.sidebarToggled);
                    }
                });
                // Update button icon
                toggleButton.html(
                    this.sidebarToggled
                        ? `<svg class="icon icon-sm"><use href="#icon-left"></use></svg>`
                        : `<svg class="icon icon-sm"><use href="#icon-right"></use></svg>`
                );
            });
        } else {
            // Update existing toggle button icon
            let toggleButton = buttonBar.find('.sidebar-toggle-btn');
            if (toggleButton.length) {
                toggleButton.html(
                    this.sidebarToggled
                        ? `<svg class="icon icon-sm"><use href="#icon-left"></use></svg>`
                        : `<svg class="icon icon-sm"><use href="#icon-right"></use></svg>`
                );
            }
            // Hide menu button on document pages
            if (isDocumentPage) {
                buttonBar.find('.menu-open-btn').remove();
                console.log('Menu button removed on document page');
            } else {
                // Ensure menu button is present on non-document pages
                let menuButton = buttonBar.find('.menu-open-btn');
                if (!menuButton.length) {
                    menuButton = $('<button class="menu-open-btn"></button>').appendTo(buttonBar);
                    menuButton.html(`<svg class="icon icon-sm"><use href="#icon-menu"></use></svg>`).css({ display: 'inline-flex', visibility: 'visible' });
                    console.log('Menu button re-added on non-document page');

                    const workspace = this.getWorkspaceForDoctype(this.doctype);
                    menuButton.on('click', () => {
                        frappe.set_route('workspaces', workspace.name);
                    });
                }
            }
        }
    }

    getWorkspaceForDoctype(doctype) {
        // Find workspace containing the doctype
        const workspaces = frappe.boot.workspaces || {};
        for (const workspaceName in workspaces) {
            const workspace = workspaces[workspaceName];
            const hasDoctype = workspace.content?.some(block => 
                block.type === "link" && block.data?.doctype === doctype
            );
            if (hasDoctype) {
                return workspace;
            }
        }
        // Fallback to a default workspace
        return { name: "home", title: "Home" };
    }

    removeSidebarToggle() {
        // Remove button bar and stray toggle buttons
        this.$wrapper.find('.custom-button-bar').remove();
        this.$wrapper.find('.sidebar-toggle-btn, .toggle-sidebar, .sidebar-toggle, button:has(svg use[href*="#icon-sidebar"], svg use[href*="#icon-left"], svg use[href*="#icon-right"])')
            .remove();
        console.log('Cleared all sidebar toggle buttons');
    }
};