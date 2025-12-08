// Global variables
        let doctors = [];
        let specializations = [];
        let countries = [];
        let counties = [];

        // County data by country
        const countyData = {
            'Kenya': [
                'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Uasin Gishu', 'Kiambu', 'Kakamega',
                'Bungoma', 'Meru', 'Kisii', 'Migori', 'Machakos', 'Kitui', 'Garissa', 'Wajir',
                'Mandera', 'Marsabit', 'Isiolo', 'Nyeri', 'Kirinyaga', 'Muranga', 'Nyandarua',
                'Laikipia', 'Nandi', 'Baringo', 'Samburu', 'Turkana', 'West Pokot', 'Trans Nzoia',
                'Elgeyo Marakwet', 'Bomet', 'Kericho', 'Narok', 'Kajiado', 'Makueni', 'Taita Taveta',
                'Kwale', 'Kilifi', 'Tana River', 'Lamu', 'Homa Bay', 'Siaya', 'Busia', 'Vihiga',
                'Tharaka Nithi', 'Embu', 'Nyamira'
            ],
            'Uganda': [
                'Kampala', 'Wakiso', 'Mukono', 'Jinja', 'Mbale', 'Mbarara', 'Gulu', 'Lira',
                'Arua', 'Soroti', 'Masaka', 'Entebbe', 'Fort Portal', 'Hoima', 'Kabale', 'Kasese'
            ],
            'Tanzania': [
                'Dar es Salaam', 'Arusha', 'Mwanza', 'Dodoma', 'Mbeya', 'Morogoro', 'Tanga',
                'Kahama', 'Tabora', 'Zanzibar', 'Moshi', 'Kigoma', 'Shinyanga', 'Mtwara'
            ],
            'Rwanda': [
                'Kigali', 'Eastern Province', 'Northern Province', 'Western Province', 'Southern Province'
            ],
            'Ethiopia': [
                'Addis Ababa', 'Oromia', 'Amhara', 'Tigray', 'Somali', 'Afar', 'SNNPR', 'Gambela', 'Harari', 'Dire Dawa'
            ],
            'South Africa': [
                'Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape', 'Free State',
                'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape'
            ],
            'Nigeria': [
                'Lagos', 'Kano', 'Abuja', 'Rivers', 'Delta', 'Oyo', 'Imo', 'Kaduna', 'Edo', 'Plateau'
            ],
            'Ghana': [
                'Greater Accra', 'Ashanti', 'Western', 'Eastern', 'Central', 'Volta', 'Brong Ahafo',
                'Northern', 'Upper East', 'Upper West'
            ]
        };

        // Initialize the application
        document.addEventListener('DOMContentLoaded', () => {
            // Close modals when clicking outside
            window.addEventListener('click', (e) => {
                if (e.target === contactModal) {
                    closeContactModal();
                }
                if (e.target === successModal) {
                    closeSuccessModal();
                }
            });
            
            // Search when pressing Enter
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    searchDoctors();
                }
            });
            
            // Form submission handler
            document.getElementById('registrationForm').addEventListener('submit', handleFormSubmission);
            
            // Initialize filters
            initializeFilters();
            
            // Load sample data
            loadSampleDoctors();
        });

        // Initialize location filters
        function initializeFilters() {
            // Populate country filter
            const countries = Object.keys(countyData);
            countries.forEach(country => {
                const option = document.createElement('option');
                option.value = country;
                option.textContent = country;
                countryFilter.appendChild(option);
            });
        }

        // Update counties based on selected country
        function updateCounties() {
            const country = document.getElementById('country').value;
            const countySelect = document.getElementById('county');
            countySelect.innerHTML = '<option value="">Select county</option>';
            
            if (country && countyData[country]) {
                countyData[country].forEach(county => {
                    const option = document.createElement('option');
                    option.value = county;
                    option.textContent = county;
                    countySelect.appendChild(option);
                });
            }
        }

        // Tab switching functions
        function showBrowseTab() {
            browseTab.classList.add('active');
            registrationTab.classList.remove('active');
            tabBtns[0].classList.add('active');
            tabBtns[1].classList.remove('active');
        }

        function showRegistrationTab() {
            browseTab.classList.remove('active');
            registrationTab.classList.add('active');
            tabBtns[0].classList.remove('active');
            tabBtns[1].classList.add('active');
        }

        // Load sample doctors (with pictures for display)
        function loadSampleDoctors() {
            doctors = getSampleDoctors();
            displayDoctors(doctors);
            updateFilters();
            updateSpecializations();
        }

        // Update filters based on current doctors
        function updateFilters() {
            // Get unique countries and counties from doctors
            const uniqueCountries = [...new Set(doctors.map(doctor => doctor.country))].filter(Boolean);
            const uniqueCounties = [...new Set(doctors.map(doctor => doctor.county))].filter(Boolean);
            
            // Update country filter
            countries = uniqueCountries;
            
            // Update county filter
            counties = uniqueCounties;
        }

        // Update specializations from current doctors
        function updateSpecializations() {
            const uniqueSpecializations = [...new Set(doctors.map(doctor => doctor.specialization))];
            specializations = uniqueSpecializations;
            displaySpecializations();
        }

        // Display doctors in the UI (WITH PICTURES)
        function displayDoctors(doctorsArray) {
            if (doctorsArray.length === 0) {
                doctorsList.innerHTML = '<p class="no-doctors">No doctors found matching your criteria.</p>';
                return;
            }

            doctorsList.innerHTML = doctorsArray.map(doctor => `
                <div class="doctor-card">
                    <img src="${doctor.profile_picture || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=300&fit=crop'}" 
                         alt="${doctor.full_name}" class="profile-img">
                    <div class="doctor-info">
                        <h4>${doctor.full_name}</h4>
                        <span class="specialization-tag">${doctor.specialization}</span>
                        
                        <div class="hospital-name">
                            <i class="fas fa-hospital"></i>
                            ${doctor.hospital_name || 'Not specified'}
                        </div>
                        
                        <div class="location-info">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${doctor.hospital_address || ''}</span>
                        </div>
                        
                        <div class="location-info">
                            <i class="fas fa-globe"></i>
                            <span>${doctor.county || ''}, ${doctor.country || ''}</span>
                        </div>
                        
                        <p>${doctor.description || 'No description available.'}</p>
                        
                        ${doctor.experience_years ? `
                            <div class="experience">
                                <i class="fas fa-briefcase"></i>
                                ${doctor.experience_years} years of experience
                            </div>
                        ` : ''}
                        
                        <button class="contact-btn" onclick="showContactModal('${doctor.id}')">
                            <i class="fas fa-phone-alt"></i> Contact Doctor
                        </button>
                    </div>
                </div>
            `).join('');
        }

        // Display specializations as clickable buttons
        function displaySpecializations() {
            specializationsList.innerHTML = specializations.map(spec => `
                <button class="specialization-btn" onclick="filterBySpecialization('${spec}')">
                    ${spec}
                </button>
            `).join('');
        }

        // Search doctors by specialization or hospital name
        function searchDoctors() {
            const query = searchInput.value.trim().toLowerCase();
            if (query) {
                const filteredDoctors = doctors.filter(doctor => 
                    doctor.specialization.toLowerCase().includes(query) ||
                    doctor.hospital_name.toLowerCase().includes(query) ||
                    doctor.description.toLowerCase().includes(query)
                );
                displayDoctors(filteredDoctors);
            } else {
                filterDoctors(); // Use current filter values
            }
        }

        // Filter doctors by multiple criteria
        function filterDoctors() {
            const country = countryFilter.value;
            const county = countyFilter.value;
            const hospitalType = hospitalTypeFilter.value;
            const searchQuery = searchInput.value.trim().toLowerCase();
            
            let filteredDoctors = doctors;
            
            // Apply country filter
            if (country) {
                filteredDoctors = filteredDoctors.filter(doctor => doctor.country === country);
            }
            
            // Apply county filter
            if (county) {
                filteredDoctors = filteredDoctors.filter(doctor => doctor.country === county);
            }
            
            // Apply hospital type filter
            if (hospitalType) {
                filteredDoctors = filteredDoctors.filter(doctor => doctor.hospital_type === hospitalType);
            }
            
            // Apply search query
            if (searchQuery) {
                filteredDoctors = filteredDoctors.filter(doctor => 
                    doctor.specialization.toLowerCase().includes(searchQuery) ||
                    doctor.hospital_name.toLowerCase().includes(searchQuery) ||
                    doctor.description.toLowerCase().includes(searchQuery) ||
                    doctor.full_name.toLowerCase().includes(searchQuery)
                );
            }
            
            displayDoctors(filteredDoctors);
        }

        // Filter by specialization only
        function filterBySpecialization(specialization) {
            const filteredDoctors = doctors.filter(doctor => 
                doctor.specialization === specialization
            );
            displayDoctors(filteredDoctors);
            searchInput.value = specialization;
        }

        // Show contact modal with doctor's information (WITH PICTURE IN MODAL)
        function showContactModal(doctorId) {
            const doctor = doctors.find(d => d.id === doctorId);
            if (!doctor) return;

            document.getElementById('doctorContactInfo').innerHTML = `
                <div class="doctor-contact-header" style="margin-bottom: 1.5rem; text-align: center;">
                    <img src="${doctor.profile_picture || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop'}" 
                         alt="${doctor.full_name}" 
                         style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin-bottom: 1rem; border: 3px solid #2a9d8f;">
                    <h4 style="color: #264653; margin-bottom: 0.5rem;">${doctor.full_name}</h4>
                    <p class="specialization-tag">${doctor.specialization}</p>
                </div>
                
                <div class="contact-info-item">
                    <i class="fas fa-envelope"></i>
                    <div>
                        <strong>Email:</strong><br>
                        ${doctor.email}
                    </div>
                </div>
                
                <div class="contact-info-item">
                    <i class="fas fa-phone"></i>
                    <div>
                        <strong>Phone:</strong><br>
                        ${doctor.phone || 'Not provided'}
                    </div>
                </div>
                
                <div class="contact-info-item">
                    <i class="fas fa-hospital"></i>
                    <div>
                        <strong>Workplace:</strong><br>
                        ${doctor.hospital_name || 'Not specified'} (${doctor.hospital_type || 'Not specified'})
                    </div>
                </div>
                
                <div class="contact-info-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <div>
                        <strong>Location:</strong><br>
                        ${doctor.hospital_address || 'Not specified'}<br>
                        ${doctor.county || ''}, ${doctor.country || ''}
                    </div>
                </div>
                
                ${doctor.experience_years ? `
                    <div class="contact-info-item">
                        <i class="fas fa-briefcase"></i>
                        <div>
                            <strong>Experience:</strong><br>
                            ${doctor.experience_years} years
                        </div>
                    </div>
                ` : ''}
                
                <div style="margin-top: 1.5rem; padding: 1rem; background-color: #e8f4f8; border-radius: 5px;">
                    <p style="margin: 0; color: #2a9d8f;">
                        <i class="fas fa-info-circle"></i> Please be professional when contacting doctors.
                    </p>
                </div>
            `;

            contactModal.style.display = 'block';
        }

        // Close contact modal
        function closeContactModal() {
            contactModal.style.display = 'none';
        }

        // Close success modal
        function closeSuccessModal() {
            successModal.style.display = 'none';
            showBrowseTab();
        }

        // Show success modal
        function showSuccessModal() {
            successModal.style.display = 'block';
        }

        // Get field value with trim
        function getFieldValue(fieldId) {
            const element = document.getElementById(fieldId);
            return element ? element.value.trim() : '';
        }

        // Handle form submission
        async function handleFormSubmission(e) {
    e.preventDefault();

    const messageDiv = document.getElementById('message');
    const submitBtn = document.getElementById('submitBtn');
    const originalBtnText = submitBtn.innerHTML;

    // Validate required fields
    const fieldChecks = [
        { id: 'full_name', name: 'Full Name', value: getFieldValue('full_name') },
        { id: 'email', name: 'Email', value: getFieldValue('email') },
        { id: 'phone', name: 'Phone', value: getFieldValue('phone') },
        { id: 'reg_specialization', name: 'Specialization', value: getFieldValue('reg_specialization') },
        { id: 'hospital_name', name: 'Hospital/Clinic Name', value: getFieldValue('hospital_name') },
        { id: 'hospital_type', name: 'Facility Type', value: document.getElementById('hospital_type')?.value },
        { id: 'hospital_address', name: 'Hospital Address', value: getFieldValue('hospital_address') },
        { id: 'country', name: 'Country', value: document.getElementById('country')?.value },
        { id: 'county', name: 'County', value: document.getElementById('county')?.value },
        { id: 'description', name: 'Professional Description', value: getFieldValue('description') }
    ];

    const missingFields = fieldChecks.filter(field => !field.value);

    if (missingFields.length > 0) {
        const fieldNames = missingFields.map(f => f.name).join(', ');
        messageDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            Please fill in the following required fields: ${fieldNames}
        `;
        messageDiv.className = 'message error';
        messageDiv.style.display = 'block';

        missingFields.forEach(field => {
            const element = document.getElementById(field.id);
            if (element) {
                element.style.borderColor = '#e76f51';
                element.focus();
            }
        });
        return;
    }

    const email = getFieldValue('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        messageDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            Please enter a valid email address.
        `;
        messageDiv.className = 'message error';
        messageDiv.style.display = 'block';
        document.getElementById('email').style.borderColor = '#e76f51';
        document.getElementById('email').focus();
        return;
    }

    try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading"></span> Submitting...';

        // Set reply-to
        document.getElementById('reply_to_email').value = email;

        // Simulated delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Show success modal
        showSuccessModal();

        // 🔥 FIX: Actually submit the form now
        document.getElementById('registrationForm').submit();

    } catch (error) {
        console.error('Form submission error:', error);
        messageDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            Error: ${error.message || 'Submission failed. Please try again.'}
        `;
        messageDiv.className = 'message error';
        messageDiv.style.display = 'block';
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
}

       
        // Sample doctors for browsing display (WITH PICTURES)
        function getSampleDoctors() {
            return [
                {
                    id: 'doctor_1',
                    full_name: 'Dr. Sarah Johnson',
                    email: 'sarah.j@example.com',
                    phone: '+254 712 345 678',
                    specialization: 'Cardiology',
                    description: 'Expert in cardiovascular diseases with 15 years experience. Specializes in preventive cardiology and heart failure management.',
                    experience_years: 15,
                    profile_picture: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop',
                    hospital_name: 'Nairobi Heart Center',
                    hospital_type: 'Specialty Center',
                    hospital_address: '123 Cardiac Road, Upper Hill',
                    country: 'Kenya',
                    county: 'Nairobi'
                },
                {
                    id: 'doctor_6',
                    full_name: 'Dr. David Kim',
                    email: 'd.kim@example.com',
                    phone: '+254 767 890 123',
                    specialization: 'Cardiology',
                    description: 'Interventional cardiologist with focus on minimally invasive procedures and cardiac rehabilitation.',
                    experience_years: 18,
                    profile_picture: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
                    hospital_name: 'Kenyatta National Hospital',
                    hospital_type: 'Hospital',
                    hospital_address: 'Hospital Road',
                    country: 'Kenya',
                    county: 'Nairobi'
                }
            ];
        }

          // Security shortcuts disabled
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
  });

  document.addEventListener('keydown', function (e) {
    if (
      e.key === "F12" ||
      (e.ctrlKey && e.shiftKey && e.key === "I") ||
      (e.ctrlKey && e.key === "U")
    ) {
      e.preventDefault();
      alert("Action disabled");
    }
  });
