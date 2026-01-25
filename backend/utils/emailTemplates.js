// Email template for patient appointment confirmation
export const patientAppointmentConfirmation = (appointmentData) => {
    const { patientName, doctorName, appointmentDate, timeSlot, symptoms, department, specialization } = appointmentData;

    const formattedDate = new Date(appointmentDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                    border-radius: 10px 10px 0 0;
                }
                .content {
                    background: #f9f9f9;
                    padding: 30px;
                    border-radius: 0 0 10px 10px;
                }
                .appointment-details {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .detail-row {
                    display: flex;
                    padding: 10px 0;
                    border-bottom: 1px solid #eee;
                }
                .detail-label {
                    font-weight: bold;
                    color: #667eea;
                    width: 140px;
                }
                .detail-value {
                    flex: 1;
                }
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    padding-top: 20px;
                    border-top: 1px solid #ddd;
                    color: #666;
                    font-size: 14px;
                }
                .button {
                    display: inline-block;
                    padding: 12px 30px;
                    background: #667eea;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🏥 Appointment Confirmed!</h1>
            </div>
            <div class="content">
                <p>Dear <strong>${patientName}</strong>,</p>
                <p>Your appointment has been successfully booked. Here are your appointment details:</p>
                
                <div class="appointment-details">
                    <div class="detail-row">
                        <span class="detail-label">Doctor:</span>
                        <span class="detail-value">${doctorName}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Specialization:</span>
                        <span class="detail-value">${specialization}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Department:</span>
                        <span class="detail-value">${department}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Date:</span>
                        <span class="detail-value">${formattedDate}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Time:</span>
                        <span class="detail-value">${timeSlot}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Symptoms:</span>
                        <span class="detail-value">${symptoms}</span>
                    </div>
                </div>

                <p><strong>Important Reminders:</strong></p>
                <ul>
                    <li>Please arrive 15 minutes before your scheduled time</li>
                    <li>Bring your ID and any relevant medical records</li>
                    <li>If you need to cancel or reschedule, please contact us at least 24 hours in advance</li>
                </ul>

                <div class="footer">
                    <p>Thank you for choosing HealthSync!</p>
                    <p>For any queries, please contact our support team.</p>
                    <p style="font-size: 12px; color: #999;">This is an automated email. Please do not reply.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};

// Email template for doctor appointment notification
export const doctorAppointmentNotification = (appointmentData) => {
    const { patientName, patientEmail, patientPhone, doctorName, appointmentDate, timeSlot, symptoms } = appointmentData;

    const formattedDate = new Date(appointmentDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                    border-radius: 10px 10px 0 0;
                }
                .content {
                    background: #f9f9f9;
                    padding: 30px;
                    border-radius: 0 0 10px 10px;
                }
                .appointment-details {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .detail-row {
                    display: flex;
                    padding: 10px 0;
                    border-bottom: 1px solid #eee;
                }
                .detail-label {
                    font-weight: bold;
                    color: #11998e;
                    width: 140px;
                }
                .detail-value {
                    flex: 1;
                }
                .symptoms-box {
                    background: #fff3cd;
                    border-left: 4px solid #ffc107;
                    padding: 15px;
                    margin: 15px 0;
                    border-radius: 4px;
                }
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    padding-top: 20px;
                    border-top: 1px solid #ddd;
                    color: #666;
                    font-size: 14px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>📋 New Appointment Scheduled</h1>
            </div>
            <div class="content">
                <p>Dear <strong>Dr. ${doctorName}</strong>,</p>
                <p>A new appointment has been scheduled with you. Here are the details:</p>
                
                <div class="appointment-details">
                    <div class="detail-row">
                        <span class="detail-label">Patient Name:</span>
                        <span class="detail-value">${patientName}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Email:</span>
                        <span class="detail-value">${patientEmail}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Phone:</span>
                        <span class="detail-value">${patientPhone}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Date:</span>
                        <span class="detail-value">${formattedDate}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Time:</span>
                        <span class="detail-value">${timeSlot}</span>
                    </div>
                </div>

                <div class="symptoms-box">
                    <strong>Patient Symptoms:</strong>
                    <p style="margin: 10px 0 0 0;">${symptoms}</p>
                </div>

                <p style="margin-top: 20px;">Please review the patient's symptoms before the appointment.</p>

                <div class="footer">
                    <p>HealthSync Appointment Management System</p>
                    <p style="font-size: 12px; color: #999;">This is an automated email. Please do not reply.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};
