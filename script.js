// Scents data
const scents = {
    'وردي': { color: '#E91E63', basePrice: 3 },
    'مسك': { color: '#8B4789', basePrice: 4 },
    'عود': { color: '#8B6914', basePrice: 5 },
    'زهري': { color: '#FFB6C1', basePrice: 3 },
    'حمضي': { color: '#FFD700', basePrice: 2 },
    'شرقي': { color: '#D4A574', basePrice: 4 }
};

let selectedScents = {};
let totalPrice = 15; // Base price

// Initialize scent sliders
document.querySelectorAll('.scent-slider').forEach(slider => {
    slider.addEventListener('input', updatePerfume);
});

// Initialize scent checkboxes
document.querySelectorAll('.scent-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        const scent = this.dataset.scent;
        if (this.checked) {
            selectedScents[scent] = 0;
        } else {
            delete selectedScents[scent];
            // Reset slider when unchecked
            document.querySelector(`input[data-scent="${scent}"].scent-slider`).value = 0;
        }
        updatePerfume();
    });
});

function updatePerfume() {
    let totalPercentage = 0;
    let colors = [];
    let composition = '<strong>تركيبة العطر:</strong><br>';
    let priceAddition = 0;
    
    document.querySelectorAll('.scent-slider').forEach(slider => {
        const scent = slider.dataset.scent;
        const percentage = parseInt(slider.value);
        const percentage_display = slider.parentElement.querySelector('.percentage');
        
        percentage_display.textContent = percentage + '%';
        
        if (percentage > 0) {
            totalPercentage += percentage;
            colors.push({
                color: document.querySelector(`input[data-scent="${scent}"].scent-checkbox`).dataset.color,
                weight: percentage
            });
            composition += `<br>${scent}: ${percentage}%`;
            priceAddition += (percentage / 100) * scents[scent].basePrice;
        }
    });

    // Update bottle color
    updateBottleColor(colors);
    
    // Update composition display
    const compositionDiv = document.getElementById('composition');
    if (totalPercentage === 0) {
        compositionDiv.innerHTML = '<p>اختر الروائح لرؤية التركيبة</p>';
    } else if (totalPercentage > 100) {
        compositionDiv.innerHTML = '<p style="color: red;">⚠️ مجموع النسب لا يجب أن يتجاوز 100%</p>' + composition;
    } else {
        compositionDiv.innerHTML = composition;
    }

    // Update price - السعر يزيد مع نسب الروائح
    if (totalPercentage === 0) {
        totalPrice = 0;
    } else {
        totalPrice = 10 + priceAddition; // 10 ريال أساسي + سعر الروائح
    }
    document.getElementById('priceDisplay').textContent = totalPrice.toFixed(2);

    // Disable sliders if total reaches 100%
    document.querySelectorAll('.scent-slider').forEach(slider => {
        const percentage = parseInt(slider.value);
        slider.style.opacity = totalPercentage >= 100 && percentage === 0 ? '0.5' : '1';
    });
}

function updateBottleColor(colors) {
    const bottleColor = document.getElementById('bottleColor');
    let totalPercentage = 0;
    
    // حساب مجموع النسب المئوية
    document.querySelectorAll('.scent-slider').forEach(slider => {
        totalPercentage += parseInt(slider.value);
    });
    
    // حساب نسبة ملء الزجاجة (الحد الأقصى 100%)
    const fillHeight = Math.min(totalPercentage, 100);
    
    if (fillHeight === 0) {
        bottleColor.style.height = '0%';
        bottleColor.style.background = 'linear-gradient(180deg, #a78bfa, #60a5fa)';
    } else if (colors.length === 1) {
        bottleColor.style.background = colors[0].color;
        bottleColor.style.height = fillHeight + '%';
    } else if (colors.length > 1) {
        // Mix colors
        let gradientStops = [];
        let currentPosition = 0;
        
        colors.forEach((item, index) => {
            const nextPosition = currentPosition + item.weight;
            gradientStops.push(`${item.color} ${currentPosition}%, ${item.color} ${nextPosition}%`);
            currentPosition = nextPosition;
        });
        
        bottleColor.style.background = `linear-gradient(180deg, ${gradientStops.join(', ')})`;
        bottleColor.style.height = fillHeight + '%';
    } else {
        bottleColor.style.height = fillHeight + '%';
    }
}

// Add to cart function
function addToCart() {
    let totalPercentage = 0;
    document.querySelectorAll('.scent-slider').forEach(slider => {
        totalPercentage += parseInt(slider.value);
    });

    if (totalPercentage === 0) {
        alert('الرجاء اختيار الروائح أولاً!');
        return;
    }

    if (totalPercentage > 100) {
        alert('مجموع النسب المئوية لا يجب أن يتجاوز 100%');
        return;
    }

    // Get composition details
    let composition = 'عطرك المخصص:\n';
    document.querySelectorAll('.scent-slider').forEach(slider => {
        const percentage = parseInt(slider.value);
        if (percentage > 0) {
            composition += `${slider.dataset.scent}: ${percentage}%\n`;
        }
    });

    alert(`✅ تمت إضافة العطر إلى السلة!\n\n${composition}\nالسعر: ${totalPrice.toFixed(2)} ر.ع\n\nشكراً لاختيارك ORVEN`);
    
    // Scroll to shipping section
    setTimeout(() => {
        document.querySelector('#shipping').scrollIntoView({behavior: 'smooth'});
    }, 500);
}

// Navigation smooth scroll
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 8px 30px rgba(167, 139, 250, 0.5)';
    } else {
        navbar.style.boxShadow = '0 4px 15px rgba(147, 51, 234, 0.3)';
    }
});

// Create floating stars
function createStars() {
    const starsContainer = document.querySelector('.stars');
    if (!starsContainer) return;
    
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        starsContainer.appendChild(star);
    }
}

createStars();
