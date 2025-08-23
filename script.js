// Portfolio App Class
class PortfolioApp {
    constructor() {
        this.projects = [];
        this.products = [];
        this.currentImageIndex = 0;
        this.currentImages = [];
        this.init();
    }

    async init() {
        await this.loadProjects();
        await this.loadProducts();
        this.renderProjects();
        this.renderProducts();
        this.updateProjectCount();
        this.setupEventListeners();
        this.setupNavigation();
    }

    async loadProjects() {
        try {
            const response = await fetch('./projects.json');
            if (!response.ok) throw new Error('Failed to load projects');
            this.projects = await response.json();
        } catch (error) {
            console.error('Error loading projects:', error);
            this.projects = [];
        }
    }

    async loadProducts() {
        try {
            const response = await fetch('./products.json');
            if (!response.ok) throw new Error('Failed to load products');
            this.products = await response.json();
        } catch (error) {
            console.error('Error loading products:', error);
            this.products = [];
        }
    }

    renderProjects() {
        const projectsGrid = document.getElementById('projects-grid');
        if (!projectsGrid) return;

        projectsGrid.innerHTML = '';

        if (this.projects.length === 0) {
            projectsGrid.innerHTML = '<p class="no-projects">No projects to display yet. Add some projects to projects.json!</p>';
            return;
        }

        this.projects.forEach((project, index) => {
            const projectCard = this.createProjectCard(project, index);
            projectsGrid.appendChild(projectCard);
        });
    }

    createProjectCard(project, index) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('data-project-index', index);

        // Add visibility animation with delay
        setTimeout(() => card.classList.add('visible'), index * 100);

        card.innerHTML = `
            <div class="project-image-container">
                <img src="${project.thumbnail}" alt="${project.title}" class="project-thumbnail" onerror="this.src='https://via.placeholder.com/400x220/f8fafb/666666?text=Image+Not+Found'">
            </div>
            <div class="project-type ${project.type}">${project.type}</div>
            <div class="project-info">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
            </div>
        `;

        card.addEventListener('click', () => this.openProjectModal(project));
        return card;
    }

    renderProducts() {
        const productsGrid = document.getElementById('products-grid');
        if (!productsGrid) return;

        productsGrid.innerHTML = '';

        if (this.products.length === 0) {
            productsGrid.innerHTML = '<p class="no-products">No products to display yet. Add some products to products.json!</p>';
            return;
        }

        this.products.forEach((product, index) => {
            const productCard = this.createProductCard(product, index);
            productsGrid.appendChild(productCard);
        });
    }

    createProductCard(product, index) {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        // Add visibility animation with delay
        setTimeout(() => card.classList.add('visible'), index * 100);

        const priceDisplay = product.price === 0 || product.price === "free" ? 
            '<span class="product-price free">FREE</span>' : 
            `<span class="product-price paid">$${product.price}</span>`;

        card.innerHTML = `
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/300x200/f8fafb/666666?text=Image+Not+Found'">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                ${priceDisplay}
            </div>
        `;

        card.addEventListener('click', () => this.openProductModal(product));

        return card;
    }

    openProjectModal(project) {
        const modal = document.getElementById('project-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalImages = document.getElementById('modal-images');
        const modalDescription = document.getElementById('modal-description');

        modalTitle.textContent = project.title;
        
        // Create description section with header
        modalDescription.innerHTML = '';
        const descSection = document.createElement('div');
        descSection.className = 'description-section';
        descSection.innerHTML = `
            <div class="description-header">
                <div class="description-icon">📝</div>
                <h4 class="description-title">Project Description</h4>
            </div>
            <div id="modal-description">${project.description}</div>
        `;
        modalDescription.appendChild(descSection);

        // Clear previous images
        modalImages.innerHTML = '';

        // Create images header
        const imagesHeader = document.createElement('div');
        imagesHeader.className = 'images-header';
        imagesHeader.innerHTML = `
            <h4 class="images-title">Project Gallery</h4>
            <span class="image-counter">${project.images.length} image${project.images.length !== 1 ? 's' : ''}</span>
        `;
        modalImages.appendChild(imagesHeader);

        // Create images grid container
        const imagesGrid = document.createElement('div');
        imagesGrid.className = 'images-grid';

        // Add images to grid with staggered animation
        project.images.forEach((imageSrc, index) => {
            const img = document.createElement('img');
            img.src = imageSrc;
            img.alt = `${project.title} - Image ${index + 1}`;
            img.className = 'modal-image';
            img.setAttribute('data-index', index);
            img.style.animationDelay = `${index * 0.1}s`;
            img.onerror = function() {
                this.src = 'https://via.placeholder.com/150x120/f8fafb/666666?text=Image+Not+Found';
            };
            
            img.addEventListener('click', () => this.openLightbox(project.images, index));
            imagesGrid.appendChild(img);
        });

        modalImages.appendChild(imagesGrid);

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    openLightbox(images, startIndex) {
        this.currentImages = images;
        this.currentImageIndex = startIndex;
        
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        
        lightboxImg.src = images[startIndex];
        lightboxImg.onerror = function() {
            this.src = 'https://via.placeholder.com/800x600/f8fafb/666666?text=Image+Not+Found';
        };
        
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    nextImage() {
        if (this.currentImages.length > 0) {
            this.currentImageIndex = (this.currentImageIndex + 1) % this.currentImages.length;
            const lightboxImg = document.getElementById('lightbox-img');
            lightboxImg.src = this.currentImages[this.currentImageIndex];
        }
    }

    prevImage() {
        if (this.currentImages.length > 0) {
            this.currentImageIndex = (this.currentImageIndex - 1 + this.currentImages.length) % this.currentImages.length;
            const lightboxImg = document.getElementById('lightbox-img');
            lightboxImg.src = this.currentImages[this.currentImageIndex];
        }
    }

    openProductModal(product) {
        const modal = document.getElementById('product-modal');
        const modalTitle = document.getElementById('product-modal-title');
        const modalImages = document.getElementById('product-modal-images');
        const modalDescription = document.getElementById('product-modal-description');
        const modalPrice = document.getElementById('product-modal-price');
        const purchaseBtn = document.getElementById('product-purchase-btn');

        modalTitle.textContent = product.name;
        
        // Create description section with header
        modalDescription.innerHTML = '';
        const descSection = document.createElement('div');
        descSection.className = 'description-section';
        descSection.innerHTML = `
            <div class="description-header">
                <div class="description-icon">📦</div>
                <h4 class="description-title">Product Details</h4>
            </div>
            <div id="product-modal-description">${product.detailedDescription || product.description}</div>
        `;
        modalDescription.appendChild(descSection);
        
        // Set price display
        if (product.price === 0 || product.price === "free") {
            modalPrice.textContent = 'FREE';
            modalPrice.className = 'modal-price free';
        } else {
            modalPrice.textContent = `$${product.price}`;
            modalPrice.className = 'modal-price paid';
        }

        // Clear previous images
        modalImages.innerHTML = '';

        // Create images header
        const imagesHeader = document.createElement('div');
        imagesHeader.className = 'images-header';
        
        // Create images grid container
        const imagesGrid = document.createElement('div');
        imagesGrid.className = 'images-grid';

        // Add images to modal if they exist
        if (product.images && product.images.length > 0) {
            imagesHeader.innerHTML = `
                <h4 class="images-title">Product Gallery</h4>
                <span class="image-counter">${product.images.length} image${product.images.length !== 1 ? 's' : ''}</span>
            `;
            
            product.images.forEach((imageSrc, index) => {
                const img = document.createElement('img');
                img.src = imageSrc;
                img.alt = `${product.name} - Image ${index + 1}`;
                img.className = 'modal-image';
                img.setAttribute('data-index', index);
                img.style.animationDelay = `${index * 0.1}s`;
                img.onerror = function() {
                    this.src = 'https://via.placeholder.com/150x120/f8fafb/666666?text=Image+Not+Found';
                };
                
                img.addEventListener('click', () => this.openLightbox(product.images, index));
                imagesGrid.appendChild(img);
            });
        } else {
            imagesHeader.innerHTML = `
                <h4 class="images-title">Product Preview</h4>
                <span class="image-counter">1 image</span>
            `;
            
            // If no additional images, show the main product image
            const img = document.createElement('img');
            img.src = product.image;
            img.alt = product.name;
            img.className = 'modal-image';
            img.style.animationDelay = '0s';
            img.onerror = function() {
                this.src = 'https://via.placeholder.com/150x120/f8fafb/666666?text=Image+Not+Found';
            };
            imagesGrid.appendChild(img);
        }

        modalImages.appendChild(imagesHeader);
        modalImages.appendChild(imagesGrid);

        // Set up purchase button
        purchaseBtn.onclick = () => {
            if (product.purchaseLink) {
                window.open(product.purchaseLink, '_blank');
            }
        };

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('project-modal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    closeProductModal() {
        const modal = document.getElementById('product-modal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    updateProjectCount() {
        const projectCountElement = document.getElementById('project-count');
        if (projectCountElement) {
            projectCountElement.textContent = this.projects.length;
        }
    }

    setupEventListeners() {
        // Project modal close events
        const closeModal = document.getElementById('close-modal');
        const modal = document.getElementById('project-modal');
        
        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeModal());
        }
        
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeModal();
            });
        }

        // Product modal close events
        const closeProductModal = document.getElementById('close-product-modal');
        const productModal = document.getElementById('product-modal');
        
        if (closeProductModal) {
            closeProductModal.addEventListener('click', () => this.closeProductModal());
        }
        
        if (productModal) {
            productModal.addEventListener('click', (e) => {
                if (e.target === productModal) this.closeProductModal();
            });
        }

        // Lightbox events
        const lightboxClose = document.getElementById('lightbox-close');
        const lightbox = document.getElementById('lightbox');
        const lightboxNext = document.getElementById('lightbox-next');
        const lightboxPrev = document.getElementById('lightbox-prev');

        if (lightboxClose) {
            lightboxClose.addEventListener('click', () => this.closeLightbox());
        }
        
        if (lightbox) {
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) this.closeLightbox();
            });
        }
        
        if (lightboxNext) {
            lightboxNext.addEventListener('click', () => this.nextImage());
        }
        
        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', () => this.prevImage());
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (lightbox && lightbox.style.display === 'block') {
                if (e.key === 'ArrowRight') this.nextImage();
                if (e.key === 'ArrowLeft') this.prevImage();
                if (e.key === 'Escape') this.closeLightbox();
            }
            if (modal && modal.style.display === 'block') {
                if (e.key === 'Escape') this.closeModal();
            }
            
            const productModal = document.getElementById('product-modal');
            if (productModal && productModal.style.display === 'block') {
                if (e.key === 'Escape') this.closeProductModal();
            }
        });
    }

    setupNavigation() {
        // Smooth scrolling for navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                
                // Add active class to clicked link
                link.classList.add('active');
                
                // Get target section
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Update active navigation link on scroll
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('section[id]');
            const headerHeight = document.querySelector('.header').offsetHeight;
            let current = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop - headerHeight - 100;
                const sectionHeight = section.offsetHeight;
                
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            // Update active navigation link
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });

            // If no section is active (top of page), activate home
            if (!current) {
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === '#home') {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});
