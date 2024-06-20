document.addEventListener('DOMContentLoaded', () => {
  // Función para manejar el formulario de suscripción
  document.getElementById('subscription-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;

    fetch('/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: email })
    })
    .then(response => response.text())
    .then(data => {
      const messageElement = document.getElementById('message');
      messageElement.textContent = "¡Muy bien! Tu suscripción ha sido recibida.";
      messageElement.style.display = 'block';
      messageElement.classList.remove('fade-out');

      document.getElementById('email').value = '';

      setTimeout(() => {
        messageElement.classList.add('fade-out');
        setTimeout(() => {
          messageElement.style.display = 'none';
        }, 1000);
      }, 4000);
    })
    .catch(error => {
      const messageElement = document.getElementById('message');
      messageElement.textContent = "Hubo un error al enviar tu suscripción.";
      messageElement.style.display = 'block';
      messageElement.classList.remove('fade-out');

      document.getElementById('email').value = '';

      setTimeout(() => {
        messageElement.classList.add('fade-out');
        setTimeout(() => {
          messageElement.style.display = 'none';
        }, 1000);
      }, 4000);

      console.log('Error:' + error);
    });
  });

  // Función para manejar las barras de progreso
  const progressBars = document.querySelectorAll('.progress');

  const isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  const fillProgressBars = () => {
    progressBars.forEach(bar => {
      if (isInViewport(bar)) {
        const percentage = bar.getAttribute('data-percentage');
        bar.style.width = percentage + '%';
      }
    });
  };

  window.addEventListener('scroll', fillProgressBars);
  fillProgressBars(); // Trigger animation if already in viewport

  // Función para manejar elementos arrastrables y zona de soltar
  const draggables = document.querySelectorAll('.draggable');
  const dropzone = document.getElementById('dropzone');
  const checkoutSection = document.getElementById('checkout-section');
  let droppedItems = [];

  draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', e.target.id);
    });
  });

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text');
    const draggableElement = document.getElementById(id);

    if (!droppedItems.includes(id)) {
      dropzone.appendChild(draggableElement);
      droppedItems.push(id);
    }

    if (droppedItems.length === 3) {
      checkoutSection.style.display = 'block';
    }
  });

  document.getElementById('pay-button').addEventListener('click', () => {
    alert('Redirigiendo a la página de pago...');
    // Aquí puedes agregar la lógica para redirigir a la página de pago
  });

  // Función para configurar cada carrusel
  const setupCarousel = (carouselId) => {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;

    const items = carousel.querySelectorAll('.carousel-item');
    const prevButton = carousel.querySelector('.carousel-control-prev');
    const nextButton = carousel.querySelector('.carousel-control-next');
    let currentIndex = 0;

    const showItem = (index) => {
      items.forEach((item, i) => {
        item.classList.toggle('active', i === index);
      });
    };

    prevButton.addEventListener('click', () => {
      currentIndex = (currentIndex > 0) ? currentIndex - 1 : items.length - 1;
      showItem(currentIndex);
    });

    nextButton.addEventListener('click', () => {
      currentIndex = (currentIndex < items.length - 1) ? currentIndex + 1 : 0;
      showItem(currentIndex);
    });

    showItem(currentIndex);
  };

  setupCarousel('carousel-business-2012');
  setupCarousel('carousel-business-2024');

  // Configuración específica para el carrusel de opiniones
  const setupReviewCarousel = () => {
    const reviewCarousel = document.querySelector('#reviews-section .carousel-inner');
    if (!reviewCarousel) return;

    const items = reviewCarousel.querySelectorAll('.carousel-item');
    const prevButton = document.querySelector('#reviews-section .carousel-control-prev');
    const nextButton = document.querySelector('#reviews-section .carousel-control-next');
    let currentIndex = 0;

    const showItem = (index) => {
      items.forEach((item, i) => {
        item.classList.toggle('active', i === index);
      });
    };

    prevButton.addEventListener('click', () => {
      currentIndex = (currentIndex > 0) ? currentIndex - 1 : items.length - 1;
      showItem(currentIndex);
    });

    nextButton.addEventListener('click', () => {
      currentIndex = (currentIndex < items.length - 1) ? currentIndex + 1 : 0;
      showItem(currentIndex);
    });

    showItem(currentIndex);
  };

  // Funcionalidad del modal para las imágenes ampliadas
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const images = document.querySelectorAll('.mobile-view, .desktop-view');
  const closeModal = document.querySelector('.close');

  images.forEach(img => {
    img.addEventListener('click', () => {
      modal.style.display = 'block';
      modalImg.src = img.src;
      modalImg.style.height = 'auto';
      modalImg.style.maxWidth = window.innerWidth < 768 ? '400px' : '900px';
    });
  });

  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Cargar opiniones desde el servidor
  const loadReviews = () => {
    fetch('/reviews')
      .then(response => response.json())
      .then(data => {
        const carouselInner = document.querySelector('#reviews-section .carousel-inner');
        carouselInner.innerHTML = '';
        data.forEach((review, index) => {
          const reviewItem = document.createElement('div');
          reviewItem.classList.add('carousel-item');
          if (index === 0) reviewItem.classList.add('active');
          reviewItem.innerHTML = `
            <h3>${review.name}</h3>
            <p>${review.review}</p>
            <small>${new Date(review.date).toLocaleDateString()}</small>
          `;
          carouselInner.appendChild(reviewItem);
        });
        setupReviewCarousel();
      })
      .catch(error => {
        console.error('Error fetching reviews:', error);
      });
  };

  loadReviews();

  // Enviar nueva opinión
  document.getElementById('review-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const review = document.getElementById('review').value;

    fetch('/submit-review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: name, review: review })
    })
    .then(response => response.json())
    .then(data => {
      document.getElementById('review-message').textContent = "¡Gracias por tu opinión!";
      document.getElementById('review-form').reset();
      loadReviews();
    })
    .catch(error => {
      document.getElementById('review-message').textContent = "Hubo un error al enviar tu opinión.";
      console.error('Error:', error);
    });
  });
});





document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modalForm');
  const closeModal = document.querySelector('.close');
  const logos = document.querySelectorAll('header .logos img');
  const form = document.getElementById('technology-form');
  const formMessage = document.getElementById('form-message');
  const modalIcon = document.getElementById('modal-icon');
  const technologyName = document.getElementById('technology-name');

  logos.forEach(logo => {
    logo.addEventListener('click', (event) => {
      const iconSrc = event.target.src;
      const iconAlt = event.target.alt;
      modalIcon.src = iconSrc;
      technologyName.textContent = iconAlt;
      modal.style.display = 'block';
    });
  });

  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const formData = {
      name: form.name.value,
      phone: form.phone.value,
      project: form.project.value,
    };

    fetch('/submit-project', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      formMessage.textContent = "¡Gracias! Tu proyecto ha sido enviado.";
      formMessage.style.color = 'green';
      form.reset();
      setTimeout(() => {
        modal.style.display = 'none';
        formMessage.textContent = '';
      }, 3000);
    })
    .catch(error => {
      formMessage.textContent = "Hubo un error al enviar tu proyecto.";
      formMessage.style.color = 'red';
      console.error('Error:', error);
    });
  });
});





document.addEventListener('DOMContentLoaded', () => {
  const leaveReviewButton = document.getElementById('leave-review-button');
  const reviewForm = document.getElementById('review-form');
  const nameStep = document.getElementById('name-step');
  const reviewStep = document.getElementById('review-step');
  const submitStep = document.getElementById('submit-step');

  leaveReviewButton.addEventListener('click', () => {
    leaveReviewButton.style.display = 'none';
    reviewForm.style.display = 'block';
  });

  document.querySelectorAll('.next-step').forEach(button => {
    button.addEventListener('click', (event) => {
      event.preventDefault();  // Evita el comportamiento por defecto del botón

      if (nameStep.style.display !== 'none' && document.getElementById('name').value.trim() !== '') {
        nameStep.style.display = 'none';
        reviewStep.style.display = 'block';
      } else if (reviewStep.style.display !== 'none' && document.getElementById('review').value.trim() !== '') {
        reviewStep.style.display = 'none';
        submitStep.style.display = 'block';
      }
    });
  });

  reviewForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const review = document.getElementById('review').value;

    fetch('/submit-review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, review })
    })
    .then(response => response.json())
    .then(data => {
      document.getElementById('review-message').textContent = "¡Gracias por tu opinión!";
      reviewForm.reset();
      reviewForm.style.display = 'none';
      leaveReviewButton.style.display = 'block';
    })
    .catch(error => {
      document.getElementById('review-message').textContent = "Hubo un error al enviar tu opinión.";
      console.error('Error:', error);
    });
  });
});









document.addEventListener('DOMContentLoaded', () => {
    const drawerMenu = document.getElementById('drawer-menu');
    const drawerHandle = document.getElementById('drawer-handle');
    const closeDrawer = document.getElementById('close-drawer');

    drawerHandle.addEventListener('click', () => {
        drawerMenu.classList.add('open');
    });

    closeDrawer.addEventListener('click', () => {
        drawerMenu.classList.remove('open');
    });
});
document.addEventListener('DOMContentLoaded', () => {
  const drawerMenu = document.getElementById('drawer-menu');
  const drawerHandle = document.getElementById('drawer-handle');
  const closeDrawer = document.getElementById('close-drawer');

  drawerHandle.addEventListener('mouseover', () => {
    drawerMenu.classList.add('open');
  });

  drawerHandle.addEventListener('click', () => {
    drawerMenu.classList.add('open');
  });

  closeDrawer.addEventListener('click', () => {
    drawerMenu.classList.remove('open');
  });

  // Cerrar el drawer si se hace clic fuera de él
  document.addEventListener('click', (event) => {
    if (!drawerMenu.contains(event.target) && !drawerHandle.contains(event.target)) {
      drawerMenu.classList.remove('open');
    }
  });

  // Cerrar el drawer cuando el mouse salga del área del drawer
  drawerMenu.addEventListener('mouseleave', () => {
    drawerMenu.classList.remove('open');
  });
});

























