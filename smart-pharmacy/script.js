
        // Form submission using Formspree
        document.getElementById('prescription-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('full-name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                medicine: document.getElementById('medicine').value,
                dosage: document.getElementById('dosage').value,
                quantity: document.getElementById('quantity').value,
                frequency: document.getElementById('frequency').value,
                prescriptionDetails: document.getElementById('prescription-details').value,
                deliveryTime: document.getElementById('delivery-time').value,
                notes: document.getElementById('notes').value,
                terms: document.getElementById('terms').checked ? 'Yes' : 'No',
                privacy: document.getElementById('privacy').checked ? 'Yes' : 'No',
                timestamp: new Date().toLocaleString(),
                ip: await getIPAddress()
            };
            
            // Validate form
            if (!formData.name || !formData.email || !formData.phone || !formData.address || 
                !formData.medicine || !formData.dosage || !formData.quantity || !formData.frequency || 
                !formData.prescriptionDetails) {
                
                const statusDiv = document.getElementById('form-status');
                statusDiv.innerHTML = `
                    <i class="fas fa-exclamation-circle"></i>
                    <strong>Please fill all required fields</strong>
                    <p>All fields marked with * are required.</p>
                `;
                statusDiv.className = "form-status error";
                statusDiv.style.display = "block";
                
                setTimeout(() => {
                    statusDiv.style.display = "none";
                }, 5000);
                return;
            }
            
            // Disable submit button and show loading
            const submitBtn = document.getElementById('submit-btn');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="loading"></span> Processing...';
            submitBtn.disabled = true;
            
            // Show loading status
            const statusDiv = document.getElementById('form-status');
            statusDiv.innerHTML = `
                <i class="fas fa-spinner fa-spin"></i>
                <strong>Submitting your prescription...</strong>
                <p>Please wait while we send your prescription details to our pharmacy.</p>
            `;
            statusDiv.className = "form-status info";
            statusDiv.style.display = "block";
            
            try {
                // Send data to Formspree
                const response = await fetch('https://formspree.io/f/mwpgnvly', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                if (response.ok) {
                    // Success
                    statusDiv.innerHTML = `
                        <i class="fas fa-check-circle"></i>
                        <strong>Prescription submitted successfully!</strong>
                        <p>We've received your prescription details. Our pharmacy team will review it and contact you within 24 hours for confirmation and delivery details.</p>
                        <p>A confirmation email has been sent to <strong>${formData.email}</strong>.</p>
                        <p><small>Order Reference: #${generateOrderId()}</small></p>
                    `;
                    statusDiv.className = "form-status success";
                    
                    // Reset form after successful submission
                    document.getElementById('prescription-form').reset();
                    
                    // Log success
                    console.log('Prescription submitted to Formspree:', formData);
                    
                    // Hide status message after 15 seconds
                    setTimeout(() => {
                        statusDiv.style.display = "none";
                    }, 15000);
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                // Handle error
                statusDiv.innerHTML = `
                    <i class="fas fa-exclamation-circle"></i>
                    <strong>Error submitting form</strong>
                    <p>There was an error submitting your prescription. Please try again or contact customer support at pharmacy@mediquick.com.</p>
                    <p><small>Error details: ${error.message}</small></p>
                `;
                statusDiv.className = "form-status error";
                
                // Log error
                console.error('Form submission error:', error);
                
                // Hide status message after 10 seconds
                setTimeout(() => {
                    statusDiv.style.display = "none";
                }, 10000);
            } finally {
                // Re-enable submit button
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
        
        // Helper function to get IP address (for tracking purposes)
        async function getIPAddress() {
            try {
                const response = await fetch('https://api.ipify.org?format=json');
                const data = await response.json();
                return data.ip;
            } catch (error) {
                return 'Unknown';
            }
        }
        
        // Generate a random order ID
        function generateOrderId() {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let result = '';
            for (let i = 0; i < 8; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        }
        
        // Pre-populate form with sample data for demo purposes
        document.addEventListener('DOMContentLoaded', function() {
            // Sample data for demo
            document.getElementById('full-name').value = 'John Smith';
            document.getElementById('email').value = 'john.smith@example.com';
            document.getElementById('phone').value = '+1 (555) 123-4567';
            document.getElementById('address').value = '123 Main Street, Apt 4B, New York, NY 10001';
            document.getElementById('medicine').value = 'Amoxicillin';
            document.getElementById('dosage').value = '500mg';
            document.getElementById('quantity').value = '30';
            document.getElementById('frequency').value = 'Twice daily';
            document.getElementById('prescription-details').value = 'Prescribed by Dr. Sarah Johnson from City Medical Center for bacterial sinus infection. Take one capsule every 12 hours for 15 days.';
            document.getElementById('delivery-time').value = 'Evening (4 PM - 8 PM)';
            document.getElementById('notes').value = 'Please deliver between 4-6 PM. Ring doorbell twice. Leave package with concierge if not home.';
            
            // Show demo instructions
            setTimeout(() => {
                const statusDiv = document.getElementById('form-status');
                statusDiv.innerHTML = `
                    <i class="fas fa-info-circle"></i>
                    <strong>Welcome to MediQuick Online Pharmacy</strong>
                    <p>This form is connected to Formspree. When you submit, all prescription details will be sent to the pharmacy email.</p>
                    <p>Form endpoint: <small>https://formspree.io/f/mwpgnvly</small></p>
                `;
                statusDiv.className = "form-status info";
                statusDiv.style.display = "block";
                
                setTimeout(() => {
                    statusDiv.style.display = "none";
                }, 8000);
            }, 1000);
        });
        
        // Add input validation
        const phoneInput = document.getElementById('phone');
        phoneInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^\d\s\-\+\(\)]/g, '');
        });
        
        const quantityInput = document.getElementById('quantity');
        quantityInput.addEventListener('input', function(e) {
            if (this.value < 1) this.value = 1;
            if (this.value > 100) this.value = 100;
        });
        
        // Auto-format phone number on blur
        phoneInput.addEventListener('blur', function(e) {
            let phone = this.value.replace(/\D/g, '');
            if (phone.length === 10) {
                this.value = phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
            }
        });
        
        // Add keyboard shortcut to submit form (Ctrl + Enter)
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'Enter') {
                document.getElementById('prescription-form').dispatchEvent(new Event('submit'));
            }
        });

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
