import { useState, useEffect } from 'react';
import api from '../utils/api';
import DoctorCard from '../components/DoctorCard';
import '../styles/pages/Doctors.css';

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [filters, setFilters] = useState({
        search: '',
        department: '',
        specialization: '',
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDoctors();
        fetchDepartments();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, doctors]);

    const fetchDoctors = async () => {
        try {
            const response = await api.get('/doctors');
            setDoctors(response.data.data);
            setFilteredDoctors(response.data.data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await api.get('/departments');
            setDepartments(response.data.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const applyFilters = () => {
        let filtered = doctors;

        if (filters.search) {
            filtered = filtered.filter(doctor =>
                doctor.userId?.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                doctor.specialization.toLowerCase().includes(filters.search.toLowerCase())
            );
        }

        if (filters.department) {
            filtered = filtered.filter(doctor => doctor.department === filters.department);
        }

        if (filters.specialization) {
            filtered = filtered.filter(doctor => doctor.specialization === filters.specialization);
        }

        setFilteredDoctors(filtered);
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            department: '',
            specialization: '',
        });
    };

    return (
        <div className="doctors-page">
            <div className="container">
                <div className="page-header">
                    <h1>Find Your Doctor</h1>
                    <p>Browse through our network of qualified healthcare professionals</p>
                </div>

                <div className="filters-section">
                    <div className="search-box">
                        <input
                            type="text"
                            name="search"
                            value={filters.search}
                            onChange={handleFilterChange}
                            placeholder="Search by name or specialization..."
                            className="search-input"
                        />
                    </div>

                    <div className="filters-row">
                        <select
                            name="department"
                            value={filters.department}
                            onChange={handleFilterChange}
                            className="filter-select"
                        >
                            <option value="">All Departments</option>
                            {departments.map((dept) => (
                                <option key={dept._id} value={dept.name}>
                                    {dept.name}
                                </option>
                            ))}
                        </select>

                        <button onClick={clearFilters} className="btn btn-outline">
                            Clear Filters
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                    </div>
                ) : filteredDoctors.length > 0 ? (
                    <>
                        <p className="results-count">
                            Showing {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''}
                        </p>
                        <div className="doctors-grid">
                            {filteredDoctors.map((doctor) => (
                                <DoctorCard key={doctor._id} doctor={doctor} />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="empty-state">
                        <p>No doctors found matching your criteria</p>
                        <button onClick={clearFilters} className="btn btn-primary">
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Doctors;
