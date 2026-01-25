import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import '../styles/pages/Dashboard.css';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileData, setProfileData] = useState({
        name: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        bloodGroup: '',
        height: '',
        weight: '',
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: ''
        }
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                phone: user.phone || '',
                dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
                gender: user.gender || '',
                bloodGroup: user.bloodGroup || '',
                height: user.height || '',
                weight: user.weight || '',
                address: {
                    street: user.address?.street || '',
                    city: user.address?.city || '',
                    state: user.address?.state || '',
                    zipCode: user.address?.zipCode || ''
                }
            });
        }
    }, [user]);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setProfileData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value
                }
            }));
        } else {
            setProfileData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSaveProfile = async () => {
        try {
            const response = await api.put('/users/profile', profileData);

            if (response.data.success) {
                updateUser(response.data.data);
                setIsEditingProfile(false);
                alert('Profile updated successfully!');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to update profile';
            alert(`Failed to update profile: ${errorMessage}`);
        }
    };

    const handleCancelEdit = () => {
        setProfileData({
            name: user.name || '',
            phone: user.phone || '',
            dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
            gender: user.gender || '',
            bloodGroup: user.bloodGroup || '',
            height: user.height || '',
            weight: user.weight || '',
            address: {
                street: user.address?.street || '',
                city: user.address?.city || '',
                state: user.address?.state || '',
                zipCode: user.address?.zipCode || ''
            }
        });
        setIsEditingProfile(false);
    };

    const calculateAge = (dob) => {
        if (!dob) return 'N/A';
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="profile-section">
                    <div className="profile-header-actions">
                        <h2>My Profile</h2>
                        {!isEditingProfile && (
                            <button onClick={() => setIsEditingProfile(true)} className="btn btn-primary">
                                ✏️ Edit Profile
                            </button>
                        )}
                    </div>

                    <div className="profile-card">
                        {isEditingProfile ? (
                            <div className="profile-edit-form">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={profileData.name}
                                            onChange={handleProfileChange}
                                            className="form-control"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Email (Read-only)</label>
                                        <input
                                            type="email"
                                            value={user.email}
                                            className="form-control"
                                            disabled
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Phone *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={profileData.phone}
                                            onChange={handleProfileChange}
                                            className="form-control"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Gender</label>
                                        <select
                                            name="gender"
                                            value={profileData.gender}
                                            onChange={handleProfileChange}
                                            className="form-control"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Date of Birth</label>
                                        <input
                                            type="date"
                                            name="dateOfBirth"
                                            value={profileData.dateOfBirth}
                                            onChange={handleProfileChange}
                                            className="form-control"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Blood Group</label>
                                        <select
                                            name="bloodGroup"
                                            value={profileData.bloodGroup}
                                            onChange={handleProfileChange}
                                            className="form-control"
                                        >
                                            <option value="">Select Blood Group</option>
                                            <option value="A+">A+</option>
                                            <option value="A-">A-</option>
                                            <option value="B+">B+</option>
                                            <option value="B-">B-</option>
                                            <option value="AB+">AB+</option>
                                            <option value="AB-">AB-</option>
                                            <option value="O+">O+</option>
                                            <option value="O-">O-</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Height (cm)</label>
                                        <input
                                            type="number"
                                            name="height"
                                            value={profileData.height}
                                            onChange={handleProfileChange}
                                            className="form-control"
                                            min="0"
                                            placeholder="e.g., 175"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Weight (kg)</label>
                                        <input
                                            type="number"
                                            name="weight"
                                            value={profileData.weight}
                                            onChange={handleProfileChange}
                                            className="form-control"
                                            min="0"
                                            placeholder="e.g., 70"
                                        />
                                    </div>

                                    <div className="form-group full-width">
                                        <label>Street Address</label>
                                        <input
                                            type="text"
                                            name="address.street"
                                            value={profileData.address.street}
                                            onChange={handleProfileChange}
                                            className="form-control"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>City</label>
                                        <input
                                            type="text"
                                            name="address.city"
                                            value={profileData.address.city}
                                            onChange={handleProfileChange}
                                            className="form-control"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>State</label>
                                        <input
                                            type="text"
                                            name="address.state"
                                            value={profileData.address.state}
                                            onChange={handleProfileChange}
                                            className="form-control"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Zip Code</label>
                                        <input
                                            type="text"
                                            name="address.zipCode"
                                            value={profileData.address.zipCode}
                                            onChange={handleProfileChange}
                                            className="form-control"
                                        />
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button onClick={handleSaveProfile} className="btn btn-primary">
                                        💾 Save Changes
                                    </button>
                                    <button onClick={handleCancelEdit} className="btn btn-outline">
                                        ❌ Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="profile-details-view">
                                <div className="details-grid">
                                    <div className="detail-group">
                                        <label>Name</label>
                                        <p>{user.name || 'N/A'}</p>
                                    </div>
                                    <div className="detail-group">
                                        <label>Email</label>
                                        <p>{user.email || 'N/A'}</p>
                                    </div>
                                    <div className="detail-group">
                                        <label>Phone</label>
                                        <p>{user.phone || 'N/A'}</p>
                                    </div>
                                    <div className="detail-group">
                                        <label>Gender</label>
                                        <p>{user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'N/A'}</p>
                                    </div>
                                    <div className="detail-group">
                                        <label>Date of Birth</label>
                                        <p>{user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                    <div className="detail-group">
                                        <label>Age</label>
                                        <p>{calculateAge(user.dateOfBirth)} years</p>
                                    </div>
                                    <div className="detail-group">
                                        <label>Blood Group</label>
                                        <p>{user.bloodGroup || 'N/A'}</p>
                                    </div>
                                    <div className="detail-group">
                                        <label>Height</label>
                                        <p>{user.height ? `${user.height} cm` : 'N/A'}</p>
                                    </div>
                                    <div className="detail-group">
                                        <label>Weight</label>
                                        <p>{user.weight ? `${user.weight} kg` : 'N/A'}</p>
                                    </div>
                                    <div className="detail-group full-width">
                                        <label>Address</label>
                                        <p>
                                            {user.address?.street && `${user.address.street}, `}
                                            {user.address?.city && `${user.address.city}, `}
                                            {user.address?.state && `${user.address.state} `}
                                            {user.address?.zipCode && user.address.zipCode}
                                            {!user.address?.street && !user.address?.city && !user.address?.state && !user.address?.zipCode && 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
